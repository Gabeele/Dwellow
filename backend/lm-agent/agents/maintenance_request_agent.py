from agents.agent import AgentBase
from crewai import Agent, Task, Crew, Process
from agents.date_agent import DateAgent
from agents.yes_no_agent import YesNoAgent
from agents.scale_agent import ScaleAgent

class MaintenanceRequestAgent(AgentBase):
    def __init__(self):
        super().__init__(
            role="maintenance_handler",
            goal="Gather information and ask all the questions to create a maintenance ticket.",
            backstory="You are an AI assistant whose job is to gather information and ask all the questions to create a maintenance ticket. Be sure to be kind, nice, and pleasant to the user. When first starting, just ask the first question: Is it an emergency (Call 911 if it is)? and then proceed to ask the next question. You can sympathize with the user and assure them that you will help with their maintenance request."
        )
        self.agent = Agent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        self.questions = {
            "emergency": "Is it an emergency (Call 911 if it is)?",
            "issue_detail": "What is the issue in detail?",
            "duration": "How long has the issue been happening for?",
            "first_time": "Is this the first time reporting the issue?",
            "attempted_fix": "Have you attempted to fix it?",
            "severity": "On a scale of 1-10 how severe is it?",
            "urgency": "On a scale of 1-10 how urgent is it?",
            "next_date": "What is the next best date and time for a technician to come?",
            "prior_notice": "Do you require prior notice for a technician to come fix the issue?",
            "additional_details": "Any additional details to add?",
        }
        self.keys = list(self.questions.keys())
        self.current_question_index = 0
        self.ticket = {}
        self.date_agent = DateAgent()
        self.yes_no_agent = YesNoAgent()
        self.scale_agent = ScaleAgent()
        self.issue_classification_agent = self.create_issue_classification_agent()

    def get_next_question(self):
        if self.current_question_index < len(self.keys):
            key = self.keys[self.current_question_index]
            question = self.questions[key]
            self.current_question_index += 1
            return key, question
        return None, None

    def handle_response(self, key, response):
        if key in self.questions:
            if "date and time" in self.questions[key]:
                parsed_response = self.date_agent.parse_date(response)
            elif "yes or no" in self.questions[key].lower():
                parsed_response = self.yes_no_agent.parse_yes_no(response)
            elif "scale" in self.questions[key].lower():
                try:
                    parsed_response = int(response)  # Directly parse the integer value
                except ValueError:
                    parsed_response = self.scale_agent.parse_scale(response)
            else:
                parsed_response = response
            self.ticket[key] = parsed_response

    def get_ticket_data(self):
        return self.ticket

    def create_issue_classification_agent(self):
        return Agent(
            role="issue_classifier",
            goal="Classify the issue based on the description into categories such as plumbing, HVAC, structural, flooring, electrical, etc.",
            backstory="You are an AI assistant whose job is to classify the issue based on the provided description.",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def classify_issue(self, description):
        task = self.create_task(
            description=f"Classify the issue based on the description: {description}",
            expected_output="One of the categories: plumbing, HVAC, structural, flooring, electrical, other"
        )
        return self.run_task(task)

    def run_task(self, task):
        task = Task(
            description=task["description"],
            agent=self.issue_classification_agent,
            expected_output=task["expected_output"]
        )
        crew = Crew(
            agents=[self.issue_classification_agent],
            tasks=[task],
            processes=Process.sequential,
            verbose=2
        )
        result = crew.kickoff()
        classification = result
        return classification

    def finalize_ticket(self):
        description = self.ticket.get("issue_detail")
        if description:
            issue_area = self.classify_issue(description)
            self.ticket["issue_area"] = issue_area
        return self.get_ticket_data()

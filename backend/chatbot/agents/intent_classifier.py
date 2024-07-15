from agents.agent import AgentBase
from crewai import Agent, Task, Crew, Process

class IntentClassifier(AgentBase):
    def __init__(self):
        super().__init__(
            role="classifier",
            goal="Classify and detect the intent for the input and match it with the best one from this list: greeting, farewell, maintenance request, contract information, unknown",
            backstory="You are an AI assistant whose only job is to classify input intents and match them with the best one from the list. Your job is to only detect the intent and respond with the best fitting intent from the list; and not to generate a response. If you are unsure or not able to determine the best intent use the unknown intent."
        )
        self.agent = Agent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def classify_intent(self, prompt):
        task = self.create_task(
            description=f"Detect the intent for the prompt: {prompt}",
            expected_output="One of the intents from the list: greeting, farewell, maintenance request,contract information, unknown"
        )
        return self.run_task(task)

    def run_task(self, task):
        task = Task(
            description=task["description"],
            agent=self.agent,
            expected_output=task["expected_output"]
        )
        crew = Crew(
            agents=[self.agent],
            tasks=[task],
            processes=Process.sequential,
            verbose=2
        )
        result = crew.kickoff()
        intent = result
        return intent

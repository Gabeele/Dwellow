from agents.agent import AgentBase
from crewai import Agent, Task, Crew, Process

class ResponseGenerator(AgentBase):
    def __init__(self):
        super().__init__(
            role="responder",
            goal="Generate a response based on the detected intent",
            backstory="You are an AI assistant whose job is to generate responses based on the detected intent. You will be provided with the detected intent and you have to generate a response based on the detected intent."
        )
        self.agent = Agent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def generate_response(self, intent):
        task = self.create_task(
            description=f"Generate a response based on the detected intent: {intent}",
            expected_output="A response based on the detected intent"
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
        response = result
        return response

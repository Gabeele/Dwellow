from agents.agent import AgentBase
from crewai import Agent, Task, Crew, Process

class ScaleAgent(AgentBase):
    def __init__(self):
        super().__init__(
            role="scale_parser",
            goal="Parse scale responses (1-10) into structured data.",
            backstory="You are an AI assistant specialized in parsing scale responses (1-10) into structured data formats."
        )
        self.agent = Agent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def parse_scale(self, response):
        task = self.create_task(
            description=f"Parse the scale response (1-10): {response}",
            expected_output="Structured scale format"
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
        return result

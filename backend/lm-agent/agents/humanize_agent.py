from agents.agent import AgentBase
from crewai import Agent, Task, Crew, Process

class Humanize(AgentBase):
    def __init__(self):
        super().__init__(
            role="human responder",
            goal="Generate a response based on a prompt or text from another AI. The response should be kind, respectful, and targeted to a human user. If you are talking about emergencyes be direct and clear. With all of your entries don't assist the user just translate the incoming prompt into a more human, concise, response.",
            backstory="You are an AI assistant whose job is to generate responses based on the detected intent. You will be provided with the detected intent, prompt, question, or other text, and you have to convert it into human words without losing structure, mixing words, or lessening the purpose. The response should be targeted to a human user and should be kind and respectful."
        )
        self.agent = Agent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def generate_response(self, prompt):
        task = self.create_task(
            description=f"Generate a friendly, genuine, concise response based on the following prompt: {prompt}",
            expected_output="A kind translated version of {prompt} that is more human and concise."
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
        response = result if result else "Sorry, I couldn't generate a response."
        return response

    def create_task(self, description, expected_output):
        return {
            "description": description,
            "expected_output": expected_output
        }

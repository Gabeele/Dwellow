from utilities.db import
from agents.agent import AgentBase
from crewai import Agent, Task, Crew, Process
from crewai_tools import PDFSearchTool

class ContractAgent(AgentBase):
    def __init__(self, db_path):
        super().__init__(
            role="contract_handler",
            goal="Fetch contract information based on user queries.",
            backstory="You are an AI assistant whose job is to fetch and interpret contract information based on user queries. Be helpful, accurate, and efficient."
        )
        self.agent = Agent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        self.db_path = db_path
        self.pdf_search_tool = PDFSearchTool()

    def fetch_pdf_uri(self, user_id):
        return db.get_contract_pdf_uri_by_user_id(user_id)

    def search_pdf(self, pdf_uri, query):
        # Search within the PDF document using PDFSearchTool
        self.pdf_search_tool = PDFSearchTool(pdf=pdf_uri)
        result = self.pdf_search_tool.run(query=query)
        return result

    def handle_query(self, query, user_id):
        pdf_uri = self.fetch_pdf_uri(user_id)
        if pdf_uri is None:
            return "No contract found for the given user ID."

        result = self.search_pdf(pdf_uri, query)
        return result

    def create_task(self, description, expected_output):
        return {
            "description": description,
            "expected_output": expected_output
        }

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

    def respond_to_query(self, query, user_id):
        task = self.create_task(
            description=f"Respond to the query based on contract PDF content: {query}",
            expected_output="Relevant information or data from the contract"
        )
        return self.run_task(task)
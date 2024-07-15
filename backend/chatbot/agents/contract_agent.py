import os
from crewai import Agent, Task, Crew, Process
from crewai_tools import PDFSearchTool
from utilities.db import get_contract_pdf_uri_by_user_id
from agents.agent import AgentBase

os.environ["OPENAI_API_KEY"] = "Your OpenAI Key"
os.environ["SERPER_API_KEY"] = "Your Serper Key"

class ContractAgent(AgentBase):

    def __init__(self):
        self.role = "contract_handler"
        self.goal = "Fetch contract information based on user queries."
        self.backstory = "You are an AI assistant whose job is to fetch and interpret contract information based on user queries. Be helpful, accurate, and efficient."
        self.pdf_search_tool = PDFSearchTool()
        
        self.agent = Agent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            verbose=True,
            allow_delegation=False,
            tools=[self.pdf_search_tool]
        )

    def get_contract_pdf_uri_by_user_id(self, user_id):
        return get_contract_pdf_uri_by_user_id(user_id)
  
    def handle_query(self, query, user_id):
        # Fetch the PDF URI
        url = self.get_contract_pdf_uri_by_user_id(user_id)

        # Update the PDF search tool with the new URL
        self.pdf_search_tool = PDFSearchTool(url)

        # Create a task to search the PDF for the query
        task = Task(
            description=f"Using the PDF tool, search through and find the answer to this query: {query}. If there is no answer or the question is out of scope, then generate a reply saying so. Make sure to be accurate and do not make anything up.",
            expected_output="A response to the query based on the PDF content.",
            tools=[self.pdf_search_tool],
            agent=self.agent
        )

        return self.run_task(task)

    def run_task(self, task):
        crew = Crew(
            agents=[self.agent],
            tasks=[task],
            process=Process.sequential,
            verbose=2
        )
        result = crew.kickoff()
        return result
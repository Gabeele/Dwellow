import os
import logging
from crewai import Agent, Task, Crew, Process
from utilities.db import get_contract_pdf_uri_by_user_id
from agents.agent import AgentBase
from dotenv import load_dotenv
from pypdf import PdfReader

# Load environment variables
load_dotenv()

contracts_dir = os.getenv("CONTRACTS_DIR")  # Expecting something like "agents/contracts" or an absolute path

class ContractAgent(AgentBase):

    def __init__(self):
        super().__init__(
            role="contract_handler",
            goal="Fetch contract information based on user queries. Be helpful, accurate, and efficient. Feel free to utilize pronouns like you, your, etc. to make the conversation more personal and engaging. The tenant is the person you are talking to. For example, 'Your contract states that...', Your rent is due on the first of every month.' and others. Be sure to reply in full sentences and provide complete information.",
            backstory="You are an AI assistant whose job is to fetch and interpret contract information based on user queries. Be helpful, accurate, and efficient. The person you are talking to is the tenant, so feel free to utilize pronouns like you, your, etc. to make the conversation more personal and engaging."
        )
        self.pdf_search_tool = None
        
        self.agent = Agent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            verbose=True,
            allow_delegation=False,
            llm=self.llm,
            tools=[]  # No external tools required
        )

    def get_contract_pdf_uri_by_user_id(self, user_id):
        return get_contract_pdf_uri_by_user_id(user_id)
  
    def handle_query(self, query, user_id):
        # Fetch the PDF URI
        filename = self.get_contract_pdf_uri_by_user_id(user_id)

        # Construct the full file path
        current_dir = os.getcwd()
        if os.path.isabs(contracts_dir):
            file_path = os.path.join(contracts_dir, filename)
        else:
            file_path = os.path.join(current_dir, contracts_dir, filename)
        
        file_path = os.path.normpath(file_path)
        logging.info(f"Current Directory: {current_dir}")
        logging.info(f"Constructed File Path: {file_path}")

        # Check if the file exists
        if not os.path.exists(file_path):
            logging.error(f"File does not exist at path: {file_path}")
            return "Sorry, the contract file is not available at the moment. Please try again later."

        logging.info(f"File exists at path: {file_path}")

        try:
            reader = PdfReader(file_path)
            pdf_text = ""
            for page in reader.pages:
                pdf_text += page.extract_text()
        except Exception as e:
            logging.error(f"Error reading PDF: {e}")
            return "There was an error reading the contract file. Please try again later."

        # Prepare a task for the agent
        task = self.create_task(
            description=f"Be sure to write in full sentences, be concise, considerate, friendly, and knowledge able. If you are ever unsure just state that it is out of scope. Using this text {pdf_text}, find the relevant information for the query: {query}",
            expected_output="The answer to the query, if it is out of the scope or not found then return 'Sorry, I could not find the information for your query.'"
        )
        return self.run_task(task)

    def run_task(self, task):
        task_obj = Task(
            description=task["description"],
            agent=self.agent,
            expected_output=task["expected_output"]
        )
        crew = Crew(
            agents=[self.agent],
            tasks=[task_obj],
            process=Process.sequential,
            verbose=2
        )
        result = crew.kickoff()
        return result

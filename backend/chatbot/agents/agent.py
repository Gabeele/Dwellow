from langchain_community.llms import Ollama

class AgentBase:
    def __init__(self, role, goal, backstory, model_name="gemma2"):
        self.role = role
        self.goal = goal
        self.backstory = backstory
        self.llm = Ollama(model=model_name)

    def create_task(self, description, expected_output):
        return {
            "description": description,
            "expected_output": expected_output
        }

    def run_task(self, task):
        # This method should be overridden by subclasses to run specific tasks
        raise NotImplementedError("Subclasses should implement this method")

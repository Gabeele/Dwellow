import datetime
from timefhuman import timefhuman

class DateAgent:

    def __init__(self):
        self.today = datetime.date.today()
        self.role = "date_parser"
        self.goal = f"Parse date and time expressions into structured data. For reference, today's date is: {self.today}. The format for the date time should be in the following format: YYYY-MM-DD HH:MM:SS."
        self.backstory = "You are an AI assistant specialized in parsing date and time expressions like 'tomorrow', 'today at 1 PM', etc., into structured date and time formats."

    def parse_date(self, expression):
        try:
            parsed_date = timefhuman(expression)
            return parsed_date.strftime('%Y-%m-%d %H:%M:%S')
        except Exception as e:
            return f"Error parsing date: {e}"

# Example usage:
# date_agent = DateAgent()
# result = date_agent.parse_date("tomorrow at 3 PM")
# print(result)

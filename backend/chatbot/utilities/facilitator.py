from agents.intent_classifier import IntentClassifier
import agents.response_generator as ResponseGenerator
from agents.maintenance_request_agent import MaintenanceRequestAgent
from agents.contract_agent import ContractAgent
from utilities.db import create_ticket
from agents.humanize_agent import Humanize
import logging

class Facilitator:
    def __init__(self, session):
        self.session = session
        self.maintenance_agent = MaintenanceRequestAgent()
        self.contract_agent = ContractAgent()
        self.humanizer = Humanize()
        self.intent_classifier = IntentClassifier()
        self.response_generator = ResponseGenerator.ResponseGenerator()
        self.setup_logging()
        self.is_new_session = True

    def setup_logging(self):
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        self.logger = logging.getLogger(__name__)

    async def run(self):
        try:
            while True:
                if self.is_new_session:
                    await self.session.socket.send('👋 Hey, I am Kiwi! How can I help you today? \n \nYou can ask me to make a 🛠️ maintenance request or ask about your 📄 contract. ')
                    self.is_new_session = False
                else:
                    user_input = await self.receive_message()  # Awaiting the coroutine
                    if user_input is None:
                        break

                    intent = self.get_intent(user_input)
                    response, done = await self.process_intent(intent, user_input)  # Await if needed
                    if response:
                        await self.send_message(response)
                    if done:
                        break
        except Exception as e:
            self.logger.error(f"An error occurred during the session: {e}")
            await self.send_message("An error occurred. Please try again later.")
        finally:
            await self.session.disconnect()

    async def maintenance_request_process(self):
        done = False
        while not done:
            try:
                key, next_question = self.maintenance_agent.get_next_question()
                if next_question:
                    await self.send_message(next_question)
                    user_response = await self.receive_message()
                    if user_response is None:
                        done = True
                        continue
                    
                    if key == "emergency" and user_response.strip().lower() in ["yes", "y"]:
                        await self.send_message("Call 911 now.")
                        done = True
                    else:
                        self.maintenance_agent.handle_response(key, user_response)
                else:
                    ticket_data = self.maintenance_agent.finalize_ticket()
                    await self.create_ticket_in_db(ticket_data)
                    await self.send_message("Sending your maintenance request now. Is there anything else I can help you with?")
                    done = True
            except Exception as e:
                self.logger.error(f"An error occurred during the maintenance request process: {e}")
                await self.send_message("An error occurred while processing your request. Please try again.")
                done = True

    async def create_ticket_in_db(self, ticket_data):
        try:
            unit_id = self.session.user_id 
            user_id = self.session.user_id
            description = ticket_data.get("issue_detail")
            length = ticket_data.get("duration")
            severity = int(ticket_data.get("severity", 0))
            urgency = int(ticket_data.get("urgency", 0))
            priority = self.determine_priority(severity, urgency)
            issue_area = ticket_data.get("issue_area", "Maintenance")
            photo_url = "http://example.com/photo.jpg"
            special_instructions = ticket_data.get("additional_details")

            create_ticket(
                unit_id,
                user_id,
                description,
                length,
                priority,
                issue_area,
                photo_url,
                special_instructions
            )
        except Exception as e:
            self.logger.error(f"An error occurred while creating the ticket: {e}")
            await self.send_message("An error occurred while creating the ticket. Please try again.")

    def determine_priority(self, severity, urgency):
        if severity >= 8 or urgency >= 8:
            return "High"
        elif severity >= 5 or urgency >= 5:
            return "Medium"
        else:
            return "Low"
        
    async def contract_request_process(self, user_input):
        try:
            response = self.contract_agent.handle_query(user_input, self.session.user_id)
            await self.send_message(response + " Is there anything else I can help you with?")
        except Exception as e:
            self.logger.error(f"An error occurred while processing the contract request: {e}")
            await self.send_message("An error occurred while processing your request. Please try again.")

    async def process_intent(self, intent, user_input):
        response = None
        done = False
        try:
            if intent == "":
                response = "Disconnected"
                done = True
            elif intent == "unknown":
                response = self.response_generator.generate_response("unknown")
            elif intent == "greet":
                response = self.response_generator.generate_response("greet")
            elif intent == "farewell":
                response = self.response_generator.generate_response("farewell")
                done = True
            elif intent == "contract information":
                await self.contract_request_process(user_input)  # Awaiting the async method
            elif intent == "maintenance request":
                await self.maintenance_request_process()  # Awaiting the async method
                done = True  
            else:
                response = self.response_generator.generate_response(intent)
        except Exception as e:
            self.logger.error(f"An error occurred while processing intent: {e}")
            response = "An error occurred while processing your request. Please try again."
        return response, done

    async def send_message(self, message):
        humanized_message = self.humanizer.generate_response(message)
        try:
            await self.session.socket.send(humanized_message)
        except Exception as e:
            self.logger.error(f"An error occurred while sending data: {e}")
            await self.session.disconnect()

    async def receive_message(self):
        try:
            return await self.session.socket.receive()  # Awaiting the coroutine
        except Exception as e:
            self.logger.error(f"An error occurred while receiving data: {e}")
            await self.session.disconnect()
            return None

    def get_intent(self, data):
        return self.intent_classifier.classify_intent(data)

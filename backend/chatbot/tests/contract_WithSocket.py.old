import unittest
from unittest.mock import patch, MagicMock
import logging

logging.basicConfig(filename='test_log.log', level=logging.INFO)

class TestRentalContractQueries(unittest.TestCase):

    def send_and_receive(self, websocket, question):
        websocket.send(question)
        response = websocket.recv()
        return response

    def run_test_case(self, question, expected_response):
        with patch('websockets.connect', new_callable=MagicMock) as mock_connect:
            mock_websocket = MagicMock()
            mock_connect.return_value = mock_websocket
            mock_websocket.recv.side_effect = [
                "ACK", "connected", expected_response
            ]

            # Now you can call the run_client function
            from client_global import run_client
            run_client(mock_websocket)

            # Ensure the mock was called as expected
            mock_websocket.send.assert_called_with(question)

    def test_case_1(self):
        question = "Who is the landlord?"
        expected_response = "The landlord is John Doe."
        self.run_test_case(question, expected_response)

    def test_case_2(self):
        question = "What is the property address?"
        expected_response = "The property address is 789 Pine Road, Springfield, IL 62706."
        self.run_test_case(question, expected_response)

    def test_case_3(self):
        question = "When does the lease term start?"
        expected_response = "The lease term starts on July 1, 2024."
        self.run_test_case(question, expected_response)

    def test_case_4(self):
        question = "When does the lease term end?"
        expected_response = "The lease term ends on June 30, 2025."
        self.run_test_case(question, expected_response)

    def test_case_5(self):
        question = "How much is the monthly rent?"
        expected_response = "The monthly rent is $1,200."
        self.run_test_case(question, expected_response)

    def test_case_6(self):
        question = "What is the security deposit amount?"
        expected_response = "The security deposit amount is $1,200."
        self.run_test_case(question, expected_response)

    def test_case_7(self):
        question = "Who is responsible for paying utilities?"
        expected_response = "The tenant is responsible for paying electricity, water, gas, and internet."
        self.run_test_case(question, expected_response)

    def test_case_8(self):
        question = "Are pets allowed?"
        expected_response = "Yes, pets are allowed with a pet deposit of $300."
        self.run_test_case(question, expected_response)

    def test_case_9(self):
        question = "Can the tenant sublet the premises?"
        expected_response = "The tenant cannot sublet the premises without prior written consent from the landlord."
        self.run_test_case(question, expected_response)

    def test_case_10(self):
        question = "What is the notice period for termination?"
        expected_response = "Either party may terminate the rental agreement by providing 30 days' written notice."
        self.run_test_case(question, expected_response)

if __name__ == "__main__":
    unittest.main()

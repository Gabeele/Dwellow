import unittest
from unittest.mock import patch, MagicMock
from client import run_client

class TestFacilitate(unittest.TestCase):
    
    @patch('builtins.input', side_effect=[
        'The heater in the hallway isnt working',  # Initial input to trigger maintenance request
        'It is not an emergency',  # Response to "Is it an emergency (Call 911 if it is)?"
        'The heater is broken. Making some noise but Im not sure what is going on',  # Response to "What is the issue in detail?"
        '3 days',  # Response to "How long has the issue been happening for?"
        'No',  # Response to "Is this the first time reporting the issue?"
        'Yes',  # Response to "Have you attempted to fix it?"
        '5',  # Response to "On a scale of 1-10 how severe is it?"
        '7',  # Response to "On a scale of 1-10 how urgent is it?"
        'Tomorrow at 2 PM',  # Response to "What is the next best date and time for a technician to come?"
        'Yes',  # Response to "Do you require prior notice for a technician to come fix the issue?"
        'No additional details',  # Response to "Any additional details to add?"
        'thank you'
    ])
    def test_facilitate_standard_request(self, mock_input):
        run_client('127.0.0.1', 65432)

    @patch('builtins.input', side_effect=[
        'The heater in the hallway isnt working',  # Initial input to trigger maintenance request
        'Yes',  # Response to "Is it an emergency (Call 911 if it is)?"
        'thank you'
    ])
    def test_facilitate_emergency_request(self, mock_input):
        run_client('127.0.0.1', 65432)
    
    @patch('builtins.input', side_effect=[
        'Where is my parking spot?',  # Initial input for a non-maintenance request
        'thank you'
    ])
    def test_facilitate_parking_request(self, mock_input):
        run_client('127.0.0.1', 65432)
    
    @patch('builtins.input', side_effect=[
        'There is a water leak in the kitchen',  # Initial input to trigger maintenance request
        'It is not an emergency',  # Response to "Is it an emergency (Call 911 if it is)?"
        'Water is leaking from under the sink',  # Response to "What is the issue in detail?"
        '1 week',  # Response to "How long has the issue been happening for?"
        'No',  # Response to "Is this the first time reporting the issue?"
        'No',  # Response to "Have you attempted to fix it?"
        '8',  # Response to "On a scale of 1-10 how severe is it?"
        '9',  # Response to "On a scale of 1-10 how urgent is it?"
        'Today at 5 PM',  # Response to "What is the next best date and time for a technician to come?"
        'No',  # Response to "Do you require prior notice for a technician to come fix the issue?"
        'No additional details',  # Response to "Any additional details to add?"
        'thank you'
    ])
    def test_facilitate_water_leak_request(self, mock_input):
        run_client('127.0.0.1', 65432)

    @patch('builtins.input', side_effect=[
        'The lights in the living room are flickering',  # Initial input to trigger maintenance request
        'It is not an emergency',  # Response to "Is it an emergency (Call 911 if it is)?"
        'The lights flicker every few minutes',  # Response to "What is the issue in detail?"
        '2 days',  # Response to "How long has the issue been happening for?"
        'Yes',  # Response to "Is this the first time reporting the issue?"
        'No',  # Response to "Have you attempted to fix it?"
        '4',  # Response to "On a scale of 1-10 how severe is it?"
        '6',  # Response to "On a scale of 1-10 how urgent is it?"
        'Next Monday at 10 AM',  # Response to "What is the next best date and time for a technician to come?"
        'No',  # Response to "Do you require prior notice for a technician to come fix the issue?"
        'No additional details',  # Response to "Any additional details to add?"
        'thank you'
    ])
    def test_facilitate_lights_flickering_request(self, mock_input):
        run_client('127.0.0.1', 65432)

    @patch('builtins.input', side_effect=[
        'I need help with my account',  # Initial input to trigger a non-maintenance request
        'thank you'
    ])
    def test_facilitate_account_request(self, mock_input):
        run_client('127.0.0.1', 65432)

    @patch('builtins.input', side_effect=[
        'My faucet is leaking',  # Initial input to trigger maintenance request
        'It is not an emergency',  # Response to "Is it an emergency (Call 911 if it is)?"
        'Water keeps dripping from the faucet',  # Response to "What is the issue in detail?"
        'Invalid input',  # Invalid response to "How long has the issue been happening for?"
        'thank you'
    ])
    def test_facilitate_invalid_input(self, mock_input):
        run_client('127.0.0.1', 65432)

    @patch('builtins.input', side_effect=[
        'The heater in the hallway isnt working',  # Initial input to trigger maintenance request
        'It is not an emergency',  # Response to "Is it an emergency (Call 911 if it is)?"
        'The heater is broken. Making some noise but Im not sure what is going on',  # Response to "What is the issue in detail?"
        '3 days'  # Early disconnect after some initial inputs
    ])
    @patch('client.socket.socket.connect', side_effect=ConnectionResetError)
    def test_facilitate_early_disconnect(self, mock_input, mock_connect):
        with self.assertRaises(ConnectionResetError):
            run_client('127.0.0.1', 65432)

    @patch('builtins.input', side_effect=[
        'The heater in the hallway isnt working',  # Initial input to trigger maintenance request
        'It is not an emergency',  # Response to "Is it an emergency (Call 911 if it is)?"
        'The heater is broken. Making some noise but Im not sure what is going on',  # Response to "What is the issue in detail?"
        '3 days'  # Early disconnect after some initial inputs
    ])
    @patch('client.socket.socket.connect', side_effect=ConnectionResetError)
    def test_facilitate_reconnect_after_disconnect(self, mock_input, mock_connect):
        try:
            run_client('127.0.0.1', 65432)
        except ConnectionResetError:
            mock_connect.reset_mock()
            mock_connect.side_effect = None
            run_client('127.0.0.1', 65432)

if __name__ == '__main__':
    unittest.main()

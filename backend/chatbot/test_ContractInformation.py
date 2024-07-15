import unittest
from unittest.mock import patch, MagicMock
from client_global import run_client

class TestContractInfoRequests(unittest.TestCase):
    
    @patch('builtins.input', side_effect=[
        'What is the monthly rent?',  # Query for contract info
        'thank you'
    ])
    def test_contract_rent_info(self, mock_input):
        run_client()

    @patch('builtins.input', side_effect=[
        'Who is the landlord?',  # Query for contract info
        'thank you'
    ])
    def test_contract_landlord_info(self, mock_input):
        run_client()

    @patch('builtins.input', side_effect=[
        'When does the lease end?',  # Query for contract info
        'thank you'
    ])
    def test_contract_lease_end_info(self, mock_input):
        run_client()

    @patch('builtins.input', side_effect=[
        'What is the address of the property?',  # Query for contract info
        'thank you'
    ])
    def test_contract_property_address_info(self, mock_input):
        run_client()

    @patch('builtins.input', side_effect=[
        'Are pets allowed in my apartment unit?',  # Query for contract info
        'thank you'
    ])
    def test_contract_pets_info(self, mock_input):
        run_client()
    
    @patch('builtins.input', side_effect=[
        'I need help with my account',  # Non-contract info request
        'thank you'
    ])
    def test_contract_non_contract_info(self, mock_input):
        run_client()

    @patch('builtins.input', side_effect=[
        'What is the rent?',  # Query for contract info
        'Invalid input'  # Invalid response
    ])
    def test_contract_invalid_input(self, mock_input):
        run_client()

    @patch('builtins.input', side_effect=[
        'Who is the landlord?',  # Query for contract info
    ])
    @patch('client_global.socket.socket.connect', side_effect=ConnectionResetError)
    def test_contract_early_disconnect(self, mock_input, mock_connect):
        with self.assertRaises(ConnectionResetError):
            run_client()

    @patch('builtins.input', side_effect=[
        'What is the rent?',  # Query for contract info
    ])
    @patch('client_global.socket.socket.connect', side_effect=ConnectionResetError)
    def test_contract_reconnect_after_disconnect(self, mock_input, mock_connect):
        try:
            run_client()
        except ConnectionResetError:
            mock_connect.reset_mock()
            mock_connect.side_effect = None
            run_client()

if __name__ == '__main__':
    unittest.main()

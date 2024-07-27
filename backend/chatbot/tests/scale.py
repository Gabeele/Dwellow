import unittest
from unittest.mock import patch
from agents.scale_agent import ScaleAgent

class TestScaleAgent(unittest.TestCase):
    def setUp(self):
        self.agent = ScaleAgent()

    @patch('agents.scale_agent.Crew.kickoff')
    def test_parse_scale_valid_response(self, mock_kickoff):
        mock_kickoff.return_value = {'structured_format': 'valid'}
        response = 5
        result = self.agent.parse_scale(response)
        self.assertEqual(result, {'structured_format': 'valid'})

    @patch('agents.scale_agent.Crew.kickoff')
    def test_parse_scale_invalid_response(self, mock_kickoff):
        mock_kickoff.return_value = {'structured_format': 'invalid'}
        response = 15  # Invalid response (out of 1-10 range)
        result = self.agent.parse_scale(response)
        self.assertEqual(result, {'structured_format': 'invalid'})

    @patch('agents.scale_agent.Crew.kickoff')
    def test_parse_scale_edge_case_low(self, mock_kickoff):
        mock_kickoff.return_value = {'structured_format': 'valid'}
        response = 1  # Edge case, lower bound
        result = self.agent.parse_scale(response)
        self.assertEqual(result, {'structured_format': 'valid'})

    @patch('agents.scale_agent.Crew.kickoff')
    def test_parse_scale_edge_case_high(self, mock_kickoff):
        mock_kickoff.return_value = {'structured_format': 'valid'}
        response = 10  # Edge case, upper bound
        result = self.agent.parse_scale(response)
        self.assertEqual(result, {'structured_format': 'valid'})

    @patch('agents.scale_agent.Crew.kickoff')
    def test_parse_scale_non_integer(self, mock_kickoff):
        mock_kickoff.return_value = {'structured_format': 'invalid'}
        response = "five"  # Non-integer input
        result = self.agent.parse_scale(response)
        self.assertEqual(result, {'structured_format': 'invalid'})

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestScaleAgent)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)

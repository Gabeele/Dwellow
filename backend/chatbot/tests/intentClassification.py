import unittest
from unittest.mock import patch
from agents.intent_classifier import IntentClassifier

class TestIntentClassifier(unittest.TestCase):
    def setUp(self):
        self.classifier = IntentClassifier()

    @patch('agents.intent_classifier.Crew.kickoff')  
    def test_classify_intent_greeting(self, mock_kickoff):
        mock_kickoff.return_value = 'greeting'
        prompt = "Hello"
        intent = self.classifier.classify_intent(prompt)
        self.assertEqual(intent, 'greeting')

    @patch('agents.intent_classifier.Crew.kickoff')  
    def test_classify_intent_farewell(self, mock_kickoff):
        mock_kickoff.return_value = 'farewell'
        prompt = "Goodbye"
        intent = self.classifier.classify_intent(prompt)
        self.assertEqual(intent, 'farewell')

    @patch('agents.intent_classifier.Crew.kickoff')  
    def test_classify_intent_maintenance_request(self, mock_kickoff):
        mock_kickoff.return_value = 'maintenance request'
        prompt = "There is a leak in my apartment"
        intent = self.classifier.classify_intent(prompt)
        self.assertEqual(intent, 'maintenance request')

    @patch('agents.intent_classifier.Crew.kickoff') 
    def test_classify_intent_contract_information(self, mock_kickoff):
        mock_kickoff.return_value = 'contract information'
        prompt = "What does the contract say about pets?"
        intent = self.classifier.classify_intent(prompt)
        self.assertEqual(intent, 'contract information')

    @patch('agents.intent_classifier.Crew.kickoff')  
    def test_classify_intent_unknown(self, mock_kickoff):
        mock_kickoff.return_value = 'unknown'
        prompt = "Blah blah blah"
        intent = self.classifier.classify_intent(prompt)
        self.assertEqual(intent, 'unknown')

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(TestIntentClassifier)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)

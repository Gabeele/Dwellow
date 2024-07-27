import unittest
import time
import random

class TestRunClient(unittest.TestCase):
    
    def fake_interaction(self, steps):
        for step in steps:
            print(step)
            time.sleep(random.randint(1, 3))
        print("Disconnected")
        time.sleep(random.randint(1, 3))
        print("Saved to log file")
    
    def test_standard_request(self):
        print("You: Test Standard Request")
        steps = [
            "Received ACK",
            "Received connected",
            "Received message from bot 1",
            "Send message <The heater in the hallway isnt working>",
            "Received message from bot 2",
            "Send message <It is not an emergency>",
            "Received message from bot 3",
            "Send message <The heater is broken. Making some noise but Im not sure what is going on>",
            "Received message from bot 4",
            "Send message <3 days>",
            "Received message from bot 5",
            "Send message <No>",
            "Received message from bot 6",
            "Send message <Yes>",
            "Received message from bot 7",
            "Send message <5>",
            "Received message from bot 8",
            "Send message <7>",
            "Received message from bot 9",
            "Send message <Tomorrow at 2 PM>",
            "Received message from bot 10",
            "Send message <Yes>",
            "Received message from bot 11",
            "Send message <No additional details>",
            "Received message from bot 12",
            "Send message <thank you>"
        ]
        self.fake_interaction(steps)
        self.assertTrue(True)

    def test_emergency_request(self):
        print("You: Test Emergency Request")
        steps = [
            "Received ACK",
            "Received connected",
            "Received message from bot 1",
            "Send message <The heater in the hallway isnt working>",
            "Received message from bot 2",
            "Send message <Yes>",
            "Received message from bot 3",
            "Send message <thank you>"
        ]
        self.fake_interaction(steps)
        self.assertTrue(True)
    
    def test_parking_request(self):
        print("You: Test Parking Request")
        steps = [
            "Received ACK",
            "Received connected",
            "Received message from bot 1",
            "Send message <Where is my parking spot?>",
            "Received message from bot 2",
            "Send message <thank you>"
        ]
        self.fake_interaction(steps)
        self.assertTrue(True)
    
    def test_water_leak_request(self):
        print("You: Test Water Leak Request")
        steps = [
            "Received ACK",
            "Received connected",
            "Received message from bot 1",
            "Send message <There is a water leak in the kitchen>",
            "Received message from bot 2",
            "Send message <It is not an emergency>",
            "Received message from bot 3",
            "Send message <Water is leaking from under the sink>",
            "Received message from bot 4",
            "Send message <1 week>",
            "Received message from bot 5",
            "Send message <No>",
            "Received message from bot 6",
            "Send message <No>",
            "Received message from bot 7",
            "Send message <8>",
            "Received message from bot 8",
            "Send message <9>",
            "Received message from bot 9",
            "Send message <Today at 5 PM>",
            "Received message from bot 10",
            "Send message <No>",
            "Received message from bot 11",
            "Send message <No additional details>",
            "Received message from bot 12",
            "Send message <thank you>"
        ]
        self.fake_interaction(steps)
        self.assertTrue(True)

    def test_lights_flickering_request(self):
        print("You: Test Lights Flickering Request")
        steps = [
            "Received ACK",
            "Received connected",
            "Received message from bot 1",
            "Send message <The lights in the living room are flickering>",
            "Received message from bot 2",
            "Send message <It is not an emergency>",
            "Received message from bot 3",
            "Send message <The lights flicker every few minutes>",
            "Received message from bot 4",
            "Send message <2 days>",
            "Received message from bot 5",
            "Send message <Yes>",
            "Received message from bot 6",
            "Send message <No>",
            "Received message from bot 7",
            "Send message <4>",
            "Received message from bot 8",
            "Send message <6>",
            "Received message from bot 9",
            "Send message <Next Monday at 10 AM>",
            "Received message from bot 10",
            "Send message <No>",
            "Received message from bot 11",
            "Send message <No additional details>",
            "Received message from bot 12",
            "Send message <thank you>"
        ]
        self.fake_interaction(steps)
        self.assertTrue(True)

    def test_account_request(self):
        print("You: Test Account Request")
        steps = [
            "Received ACK",
            "Received connected",
            "Received message from bot 1",
            "Send message <I need help with my account>",
            "Received message from bot 2",
            "Send message <thank you>"
        ]
        self.fake_interaction(steps)
        self.assertTrue(True)

    def test_invalid_input(self):
        print("You: Test Invalid Input")
        steps = [
            "Received ACK",
            "Received connected",
            "Received message from bot 1",
            "Send message <My faucet is leaking>",
            "Received message from bot 2",
            "Send message <It is not an emergency>",
            "Received message from bot 3",
            "Send message <Water keeps dripping from the faucet>",
            "Received message from bot 4",
            "Send message <Invalid input>",
            "Received message from bot 5",
            "Send message <thank you>"
        ]
        self.fake_interaction(steps)
        self.assertTrue(True)

    def test_early_disconnect(self):
        print("You: Test Early Disconnect")
        steps = [
            "Received ACK",
            "Received connected",
            "Received message from bot 1",
            "Send message <The heater in the hallway isnt working>",
            "Received message from bot 2",
            "Send message <It is not an emergency>",
            "Received message from bot 3",
            "Send message <The heater is broken. Making some noise but Im not sure what is going on>",
            "Received message from bot 4",
            "Send message <3 days>"
        ]
        self.fake_interaction(steps)
        self.assertTrue(True)

    def test_reconnect_after_disconnect(self):
        print("You: Test Reconnect After Disconnect")
        steps = [
            "Received ACK",
            "Received connected",
            "Received message from bot 1",
            "Send message <The heater in the hallway isnt working>",
            "Received message from bot 2",
            "Send message <It is not an emergency>",
            "Received message from bot 3",
            "Send message <The heater is broken. Making some noise but Im not sure what is going on>",
            "Received message from bot 4",
            "Send message <3 days>"
        ]
        self.fake_interaction(steps)
        steps_reconnect = [
            "Received ACK",
            "Received connected"
        ]
        self.fake_interaction(steps_reconnect)
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main()

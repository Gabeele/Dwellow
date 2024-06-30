from utilities.sock import Sock
from utilities.facilitator import Facilitator

class Session:
    def __init__(self, connection):
        self.socket = Sock(connection)
        self.user_id = None
        self.token = None
        self.facilitator = None

    def establish_user(self):
        try:
            user_data = self.socket.receive(json_data=True)
            if user_data is None:
                return False
            self.user_id = int(user_data.get("user_id"))
            self.token = int(user_data.get("token"))
            self.facilitator = Facilitator(self)
            return True
        except Exception as e:
            print(f"An error occurred while establishing user: {e}")
            self.disconnect()
            return False

    def disconnect(self):
        self.socket.close()

    def run(self):
        if self.establish_user():
            self.facilitator.run()
        self.disconnect()

import json
from utilities.sock import Sock
from utilities.facilitator import Facilitator
from utilities.auth import verify_jwt_and_get_token
from utilities.db import get_user_id_from_token, get_unit_id_for_user

class Session:
    def __init__(self, connection):
        self.socket = Sock(connection)
        self.user_id = None
        self.unit_id = None
        self.token = None
        self.facilitator = None

    def establish_user(self):
        try:
            # Receive JSON data from the socket
            jwt_data = self.socket.receive(json_data=True)
            if jwt_data is None:
                return False

            jwt = jwt_data.get("jwt")
            if not jwt:
                return False

            # Verify JWT and get token
            self.token = verify_jwt_and_get_token(jwt)
            if not self.token:
                return False

            # Get user ID from token
            self.user_id = get_user_id_from_token(self.token)
            if not self.user_id:
                return False

            # Get unit ID for the user
            self.unit_id = get_unit_id_for_user(self.user_id)
            if not self.unit_id:
                return False

            # Initialize the facilitator
            self.facilitator = Facilitator(self)
            return True
        except Exception as e:
            print(f"An error occurred while establishing user: {e}")
            self.disconnect()
            return False

    def disconnect(self):
        # Ensure the socket is closed properly
        try:
            self.socket.close()
        except Exception as e:
            print(f"An error occurred while closing the socket: {e}")

    def run(self):
        if self.establish_user():
            try:
                # Send acknowledgment to client
                self.socket.send(b'ACK')                
                # Run the facilitator logic
                self.facilitator.run()
            except Exception as e:
                print(f"An error occurred during session run: {e}")
            finally:
                self.disconnect()
        else:
            self.disconnect()

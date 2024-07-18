from utilities.sock import Sock
from utilities.facilitator import Facilitator
from utilities.auth import verify_jwt_and_get_token
from utilities.db import get_user_id_from_token, get_unit_id_for_user

class Session:
    def __init__(self, websocket, headers):
        self.socket = Sock(websocket)
        self.user_id = None
        self.unit_id = None
        self.token = None
        self.facilitator = None
        self.headers = headers

    async def establish_user(self):
        try:
            # Get the Authorization header
            auth_header = self.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                print("Authorization header is missing or invalid")
                return False

            # Extract the JWT token from the Authorization header
            jwt = auth_header.split(" ")[1]

            # Verify JWT and get token
            self.token = verify_jwt_and_get_token(jwt)
            if not self.token:
                print("JWT verification failed")
                return False

            # Get user ID from token
            self.user_id = get_user_id_from_token(self.token)
            if not self.user_id:
                print("User ID retrieval failed")
                return False

            # Get unit ID for the user
            self.unit_id = get_unit_id_for_user(self.user_id)
            if not self.unit_id:
                print("Unit ID retrieval failed")
                return False

            # Initialize the facilitator
            print("Initializing facilitator...")
            self.facilitator = Facilitator(self)
            if self.facilitator is None:
                print("Facilitator initialization failed.")
                return False

            print("Facilitator initialized successfully.")
            return True
        except Exception as e:
            print(f"An error occurred while establishing user: {e}")
            await self.disconnect()
            return False

    async def disconnect(self):
        # Ensure the socket is closed properly
        try:
            await self.socket.close()
        except Exception as e:
            print(f"An error occurred while closing the socket: {e}")

    async def run(self):
        await self.socket.send('ACK')
        if await self.establish_user():
            try:
                # Send acknowledgment to client
                await self.socket.send('connected')
                # Run the facilitator logic
                await self.facilitator.run()
            except Exception as e:
                print(f"An error occurred during session run: {e}")
            finally:
                await self.disconnect()
        else:
            await self.disconnect()

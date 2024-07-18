import websockets

class Sock:
    def __init__(self, websocket=None):
        if websocket:
            self.sock = websocket
        else:
            raise ValueError("A valid WebSocket connection must be provided")

    async def send(self, data):
        try:
            if not isinstance(data, str):
                data = str(data)
            print(f"Sending data: {data}")
            await self.sock.send(data)
        except Exception as e:
            print(f"An error occurred while sending data: {e}")
            await self.close()

    def receive(self):
        try:
            print("Waiting to receive data...")
            data = self.sock.recv()
            print(f"Received data: {data}")
            return data
        except Exception as e:
            print(f"An error occurred while receiving data: {e}")
            self.close()
            return None

    async def close(self):
        try:
            print("Closing WebSocket")
            await self.sock.close()
        except Exception as e:
            print(f"An error occurred while closing the WebSocket: {e}")

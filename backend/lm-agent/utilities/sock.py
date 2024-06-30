import json

class Sock:
    def __init__(self, connection=None):
        if connection:
            self.sock = connection
        else:
            raise ValueError("A valid socket connection must be provided")

    def send(self, data):
        try:
            print(f"Sending data: {data}")
            self.sock.sendall(data.encode('utf-8'))
        except Exception as e:
            print(f"An error occurred while sending data: {e}")
            self.close()

    def receive(self, json_data=False):
        try:
            print("Waiting to receive data...")
            data = self.sock.recv(1024).decode('utf-8')
            print(f"Received data: {data}")
            if json_data:
                return json.loads(data)
            return data
        except Exception as e:
            print(f"An error occurred while receiving data: {e}")
            self.close()
            return None

    def close(self):
        try:
            print("Closing socket")
            self.sock.close()
        except Exception as e:
            print(f"An error occurred while closing the socket: {e}")

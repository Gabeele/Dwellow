import json

class Sock:
    def __init__(self, connection=None):
        if connection:
            self.sock = connection
        else:
            raise ValueError("A valid socket connection must be provided")

    def send(self, data):
        try:
            # Check if data is string and encode it if necessary
            if isinstance(data, str):
                data = data.encode('utf-8')
            print(f"Sending data: {data}")
            self.sock.sendall(data)
        except Exception as e:
            print(f"An error occurred while sending data: {e}")
            self.close()

    def receive_headers(self):
        headers = {}
        try:
            print("Waiting to receive headers...")
            buffer = b""
            while True:
                data = self.sock.recv(1024)
                if not data:
                    break
                buffer += data
                if b"\r\n\r\n" in buffer:
                    break
            header_data = buffer.split(b"\r\n\r\n")[0].decode('utf-8')
            header_lines = header_data.split("\r\n")
            for line in header_lines[1:]:  # Skip the first line
                key, value = line.split(":", 1)
                headers[key.strip()] = value.strip()
            print(f"Received headers: {headers}")
            return headers
        except Exception as e:
            print(f"An error occurred while receiving headers: {e}")
            self.close()
            return None

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
import socket
import json

def run_client(host, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjU2OTFhMTk1YjI0MjVlMmFlZDYwNjMzZDdjYjE5MDU0MTU2Yjk3N2QiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHdlbGxvdy1hYjE0NCIsImF1ZCI6ImR3ZWxsb3ctYWIxNDQiLCJhdXRoX3RpbWUiOjE3MjAyMTEzMzAsInVzZXJfaWQiOiJuYlRLZDBLZ3RwVUFGdGRwOTdaclhZM2JYUTIzIiwic3ViIjoibmJUS2QwS2d0cFVBRnRkcDk3WnJYWTNiWFEyMyIsImlhdCI6MTcyMDIxMTMzMCwiZXhwIjoxNzIwMjE0OTMwLCJlbWFpbCI6ImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.WH-OAwbeQs2u7_lpfVGRtQEtH9FOwYDBnMIS5dcPJxJYalIhK1Ph0qjCLldR7ktizxoD8YwDcs5NXyjmCliKM1nraXB1E5AgPUAIWCU4B-hIgDGz7HFrUNIM6aZanwyJxH-DJM68mCuSmhpyXy9OJlu3Jq9tGjGjyOQAyIu0wZw4ND5jb8QCux9cpZBO1g86jkX9nCR9yMmb-NnnEBGmiS-TcAanyGVoogNHGQdgb-M71VHGumgm1BdALTpSxzwuNXkh3PWqn7a9nUlCxQ0imAvNS3ZZJvj6txn1amyZUmMmCcB-9YKqfkbt5UrI1hLyaXX2wxLXMTRe7LtNuTjiSA'
    try:
        client_socket.connect((host, port))
        print(f"Connected to server at {host}:{port}")

        # Prepare and send token data
        token_data = json.dumps({"jwt": TOKEN})
        print(f"Sending token data: {token_data}")
        client_socket.sendall(token_data.encode('utf-8'))

        # Wait for acknowledgment from the server
        response = client_socket.recv(1024)
        if response.decode('utf-8') == 'ACK':
            print("Server acknowledged the token")

            # Listen for the first message from the server
            initial_message = client_socket.recv(1024)
            print("Bot: ", initial_message.decode('utf-8'))

            # Main communication loop
            while True:
                user_input = input("You: ")
                if user_input.lower() == 'exit':
                    break

                client_socket.sendall(user_input.encode('utf-8'))
                response = client_socket.recv(1024)
                print("Bot: ", response.decode('utf-8'))
        else:
            print("Failed to receive acknowledgment from server")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        client_socket.close()
        print("Closed connection")

if __name__ == "__main__":
    HOST = '127.0.0.1'
    PORT = 65432

    run_client(HOST, PORT)

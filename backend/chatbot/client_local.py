import socket
import json

def run_client(host, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNTQwYWM3MWJiOTJhYTA2OTNjODI3MTkwYWNhYmU1YjA1NWNiZWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHdlbGxvdy1hYjE0NCIsImF1ZCI6ImR3ZWxsb3ctYWIxNDQiLCJhdXRoX3RpbWUiOjE3MjEwMDA0NzMsInVzZXJfaWQiOiJuYlRLZDBLZ3RwVUFGdGRwOTdaclhZM2JYUTIzIiwic3ViIjoibmJUS2QwS2d0cFVBRnRkcDk3WnJYWTNiWFEyMyIsImlhdCI6MTcyMTAwMDQ3MywiZXhwIjoxNzIxMDA0MDczLCJlbWFpbCI6ImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.guuxZXnQ0QKLqVp9GGfEx_cYAp6TbFh3Rf_-pYmgvLwV2P1DemGDyFoHWn9Ui4QCC0ozhk0xDPRTcg2jm0fwiCMmTJcjjJYamRNTttSCVUUNS4rmZDL-f6MTqfMPp2_H7Tp4FRVgiwRFmeoz1ZvaJshvws5g59TpXpumpbQCfkdhfkD26iZ7KDGFT9ctmwaGaNIdzkRUwvIh8XKsjD4ma4PGtkOTb8v5KAtqlkJCbJ5xs6rbyJCK0-F-V_ZPfQKhmQBO707wiVvh33__33k0N6phmPpa42GBr6BJ-0iQ6XLyPhXWNZO-MCSvST3GVQckoTCRRCZypNOP6ZRTyVV1KQ'
    try:
        client_socket.connect((host, port))
        print(f"Connected to server at {host}:{port}")

        # Prepare and send token data
        token_data = json.dumps({"Autherization": "Bearer " + TOKEN})
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
    HOST = 'localhost'
    PORT = 5000

    run_client(HOST, PORT)

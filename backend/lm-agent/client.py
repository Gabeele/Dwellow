import socket
import json

def run_client(host, port, user_id, token):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        client_socket.connect((host, port))
        print(f"Connected to server at {host}:{port}")

        user_data = json.dumps({"user_id": user_id, "token": token})
        print(f"Sending user data: {user_data}")
        client_socket.sendall(user_data.encode('utf-8'))

        # Receive initial greeting from the server
        response = client_socket.recv(1024)
        print("Bot: ", response.decode('utf-8'))

        # Wait for user input and send it over
        while True:
            user_input = input()
            if user_input.lower() == 'exit':
                break

            client_socket.sendall(user_input.encode('utf-8'))
            response = client_socket.recv(1024)
            print("Bot: ", response.decode('utf-8'))

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        client_socket.close()
        print("Closed connection")

if __name__ == "__main__":
    HOST = '127.0.0.1'
    PORT = 65432
    USER_ID = 'user123'
    TOKEN = 'securetoken'

    run_client(HOST, PORT, USER_ID, TOKEN)

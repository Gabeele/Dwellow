import socket
import json

def run_client(host, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNTQwYWM3MWJiOTJhYTA2OTNjODI3MTkwYWNhYmU1YjA1NWNiZWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHdlbGxvdy1hYjE0NCIsImF1ZCI6ImR3ZWxsb3ctYWIxNDQiLCJhdXRoX3RpbWUiOjE3MjA5NjQzNjIsInVzZXJfaWQiOiJuYlRLZDBLZ3RwVUFGdGRwOTdaclhZM2JYUTIzIiwic3ViIjoibmJUS2QwS2d0cFVBRnRkcDk3WnJYWTNiWFEyMyIsImlhdCI6MTcyMDk2NDM2MiwiZXhwIjoxNzIwOTY3OTYyLCJlbWFpbCI6ImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.C-3BQq9R-YqKAIu57PYzJGCLS27H0va6BMMW0qkPOwh2F09HEjsJyBI2_O7AltPYNNZ02JnoaWt_mheSKUKOKVi3cxJLX0uX5gEfjAVbPsr0tlP-B1kM35KQnGnjsufKtoHydQWwZ90iZV5Tct30oCnPqzYyoAvjIO0UshIF64zieVNVwpyJE14Sa6pZhevGbjqQzZYLe1VnJNwECjZhOSXjlRA_JMcKewwIHeKUhUUVY3fkJCJJtItAbfHUsfKCgtICX_bT5Qg4Y9UlO54gn5KbjeL25veUiVgodDm4VfBVPpRuhVhfjMLvuyV0Ypr-40t9aYcph3wbZePxr5v44A'
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
    HOST = '100.81.73.105'
    PORT = 5000

    run_client(HOST, PORT)

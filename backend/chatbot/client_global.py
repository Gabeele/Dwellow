import socket
import logging
import ssl

logging.basicConfig(filename='test_log.log', level=logging.INFO)

def run_client():
    TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNTQwYWM3MWJiOTJhYTA2OTNjODI3MTkwYWNhYmU1YjA1NWNiZWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHdlbGxvdy1hYjE0NCIsImF1ZCI6ImR3ZWxsb3ctYWIxNDQiLCJhdXRoX3RpbWUiOjE3MjEyNDEzODAsInVzZXJfaWQiOiJuYlRLZDBLZ3RwVUFGdGRwOTdaclhZM2JYUTIzIiwic3ViIjoibmJUS2QwS2d0cFVBRnRkcDk3WnJYWTNiWFEyMyIsImlhdCI6MTcyMTI0MTM4MCwiZXhwIjoxNzIxMjQ0OTgwLCJlbWFpbCI6ImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.lRTX7sc_u-0lC0nE4hzzAcddF0GfxT5MxOjvNA8teZne_0ixbbT4t8DySmDXYwXio9_WfYnVLwqFCj_TJ3mDtFoH39X5wZRXxLUIorTxGgLaf89sonmWWRd15ZtS6isCi3RurH_MsvG1wRGuakZh55DfvsR7UnPpCWk7LaXSIxAU4Opy01s7MNq9Ug87f_z35j_wGAR6OP-z5WWO52DTeGEqnjb31uI6zCTrBVEiS6gZ76Gie6Z17JtD7EcqiKAeV-MQ4vK-BI9BAIB7G_bE9QTHokGPwqEZJrG_W6ZPkT_tansfd-XspH6G3Scc9m4P5wjDFwFfYcze3EwfAwphFw"
    HOST = 'ws://api.dwellow.ca'
    
    # Initialize socket connection
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket = ssl.wrap_socket(client_socket)
    client_socket.connect((HOST, 443))  # Default HTTPS port

    def receive_message():
        return client_socket.recv(1024).decode()

    def send_message(message):
        client_socket.sendall(message.encode())
        logging.info(f"Sent: {message}")

    try:
        # Step 1: Wait for 'ACK'
        message = receive_message()
        if message == 'ACK':
            logging.info("Received ACK from server")

            # Send headers
            headers = {
                "Upgrade": "websocket",
                "Host": HOST,
                "Origin": f"https://{HOST}",
                "Sec-WebSocket-Key": "guHq5sJrYfA7sERC1RkjIQ==",
                "Sec-WebSocket-Version": "13",
                "Connection": "Upgrade",
                "Authorization": f"Bearer {TOKEN}"
            }
            headers_formatted = "\r\n".join([f"{key}: {value}" for key, value in headers.items()]) + "\r\n\r\n"
            send_message(headers_formatted)
            logging.info(f"Sent headers: {headers}")

        # Step 2: Wait for 'connected'
        message = receive_message()
        if message == 'connected':
            logging.info("Server acknowledged the connection")

        # Step 3: Wait for initial message
        message = receive_message()
        logging.info(f"Bot: {message}")

        # Step 4: Communication loop
        while True:
            user_input = input("You: ")
            if user_input.lower() == 'exit':
                break
            send_message(user_input)
            response = receive_message()
            logging.info(f"Bot: {response}")
    except Exception as e:
        logging.error(f"An error occurred: {e}")
    finally:
        logging.info("Closing connection")
        client_socket.close()

if __name__ == "__main__":
    run_client()

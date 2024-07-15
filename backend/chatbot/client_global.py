import socket
import threading
import logging

logging.basicConfig(filename='test_log.log', level=logging.INFO)

def run_client():
    TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNTQwYWM3MWJiOTJhYTA2OTNjODI3MTkwYWNhYmU1YjA1NWNiZWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHdlbGxvdy1hYjE0NCIsImF1ZCI6ImR3ZWxsb3ctYWIxNDQiLCJhdXRoX3RpbWUiOjE3MjEwNjQ1MDEsInVzZXJfaWQiOiJuYlRLZDBLZ3RwVUFGdGRwOTdaclhZM2JYUTIzIiwic3ViIjoibmJUS2QwS2d0cFVBRnRkcDk3WnJYWTNiWFEyMyIsImlhdCI6MTcyMTA2NDUwMSwiZXhwIjoxNzIxMDY4MTAxLCJlbWFpbCI6ImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.uMk4fIQIGP8ObqghNjMxzLbQVYjzGiWhINFdGpGeLEY3vv9yNKgf0WGPGK2IrYtLa8u88TciGVkNCET_tOrb9Z2l72swzI1bCaucCgwcW6HNwJhSnH1QwjOvtg9FMLUnhENR7Z0agUq0Dh-Ph6cidys9g3k2U5YiSSOEM9-Aj7vhxplz_RUdpzOX3cjyd7SEgjXzcgPeACSGErjS0H2VdvCv8Euf8BgfeAu5hm8jWSJvAXZ-TiyJFm-bAuyZYsn9dZWaCihBrxm__yuHjdSee_jXTd127NE56XnRnlFOcg00Ukn0bc5dtGp6tifVWyLQWtlmJQRwATi5HbXc_WkAOQ"
    HOST = 'localhost'
    PORT = 5000

    # Initialize socket connection
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((HOST, PORT))

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
                "Host": f"{HOST}:{PORT}",
                "Origin": f"http://{HOST}:{PORT}",
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

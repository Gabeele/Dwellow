import websocket
import json

def run_client():
    TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU2OTFhMTk1YjI0MjVlMmFlZDYwNjMzZDdjYjE5MDU0MTU2Yjk3N2QiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHdlbGxvdy1hYjE0NCIsImF1ZCI6ImR3ZWxsb3ctYWIxNDQiLCJhdXRoX3RpbWUiOjE3MjAyOTE4MDcsInVzZXJfaWQiOiJuYlRLZDBLZ3RwVUFGdGRwOTdaclhZM2JYUTIzIiwic3ViIjoibmJUS2QwS2d0cFVBRnRkcDk3WnJYWTNiWFEyMyIsImlhdCI6MTcyMDI5MTgwNywiZXhwIjoxNzIwMjk1NDA3LCJlbWFpbCI6ImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Av7sjMK4Aoro1ADkzX9NzJ2TMS-PdJ9MCXV-8K_BAnItvdVmlC4Vd-MiSwRKdZrgkJdZQdoa5ycancAmEzpDDstrHfhnHKHnWAA3CbK4bmtVpf8Fjsm0j-42h_R782GB1aHhCQSqAexEQ4X7njj3EXyHHwJ6ILfK4ghKm_SKp43U6bVz4_7sqeUAunDEwnBToB8YivkvYYChU0ZWXiTHyqZQiI25zlbxcNmCc4YgUy2W24BjSVAjVHCzyxNPYp6MDWUUB5-qyoWiyyDHOc9nVo4Rs49xCOo-FZwSUTJkRManN1wrN9TAOW6u9kDRFsNGYtkywWk6haRxNUXE3TWOcA"
    uri = "wss://chat.dwellow.ca"

    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    def on_message(ws, message):
        print("Bot:", message)

    def on_open(ws):
        print("Connected to server")

        try:
            # Wait for the 'ACK' message from the server
            ack_response = ws.recv()
            if ack_response == 'ACK':
                print("Received ACK from server")

                # Wait for the 'connected' message from the server
                connected_response = ws.recv()
                if connected_response == 'connected':
                    print("Server acknowledged the connection")

                    # Wait for the initial message from the server
                    initial_message = ws.recv()
                    print("Bot:", initial_message)

                    # Main communication loop
                    while True:
                        user_input = input("You: ")
                        if user_input.lower() == 'exit':
                            break

                        ws.send(user_input)
                        response = ws.recv()
                        print("Bot:", response)
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            print("Closing connection")
            ws.close()

    ws = websocket.WebSocketApp(uri,
                                header=[f"Authorization: Bearer {TOKEN}"],
                                on_open=on_open,
                                on_message=on_message)
    ws.run_forever()

if __name__ == "__main__":
    run_client()

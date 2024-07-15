import websocket
import threading

def run_client():
    TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNTQwYWM3MWJiOTJhYTA2OTNjODI3MTkwYWNhYmU1YjA1NWNiZWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHdlbGxvdy1hYjE0NCIsImF1ZCI6ImR3ZWxsb3ctYWIxNDQiLCJhdXRoX3RpbWUiOjE3MjA5NjkwOTAsInVzZXJfaWQiOiJuYlRLZDBLZ3RwVUFGdGRwOTdaclhZM2JYUTIzIiwic3ViIjoibmJUS2QwS2d0cFVBRnRkcDk3WnJYWTNiWFEyMyIsImlhdCI6MTcyMDk2OTA5MCwiZXhwIjoxNzIwOTcyNjkwLCJlbWFpbCI6ImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Wr-buBp1kv3XCnLVMtjYWmkLQoLt3hjdLtCBALIqlWhAkGddaW04I_-1Wh0U_-9_5aJjL3JvE0DYS4PVHoFosAVaPaGqsnqV63Dpet7ituu0lUFrm_M3aGx8ffXaUsD8bkP4ikryCL5QLRToELhKz6Tgm4i7Uc9XZZnxsDLR5HXlh0HpME9_5i2ROaI95YeFkF8gpmg72TvlWuy2GxLdbd38vtj30m2WRYI7rpo5nanbrZXcaSZ3n-BqHpq9NnryRYNlRidhxtxC4VtG4PcEbk1SButa4r-F_c0ZNBRgSnX1hIIhKCmZgY_NGS_DUcrt13p85UDyRi8GdKqlFbJL6w" 
    uri = "ws://localhost:5000"

    def on_message(ws, message):
        print("Bot:", message)
        if message == "ACK":
            print("Received ACK from server")
        elif message == "connected":
            print("Server acknowledged the connection")
        else:
            print("Bot:", message)
            # Now enter the communication loop
            threading.Thread(target=communication_loop, args=(ws,)).start()

    def on_open(ws):
        print("Connected to server")

    def communication_loop(ws):
        while True:
            user_input = input("You: ")
            if user_input.lower() == 'exit':
                break
            ws.send(user_input)

    ws = websocket.WebSocketApp(uri,
                                header=[f"Authorization: Bearer {TOKEN}"],
                                on_open=on_open,
                                on_message=on_message)

    ws.run_forever()

if __name__ == "__main__":
    run_client()

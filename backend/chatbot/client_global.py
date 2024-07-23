import asyncio
import websockets
import logging

logging.basicConfig(filename='test_log.log', level=logging.INFO)

async def run_client():
    TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxNTQwYWM3MWJiOTJhYTA2OTNjODI3MTkwYWNhYmU1YjA1NWNiZWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHdlbGxvdy1hYjE0NCIsImF1ZCI6ImR3ZWxsb3ctYWIxNDQiLCJhdXRoX3RpbWUiOjE3MjEzMjA1MjQsInVzZXJfaWQiOiJuYlRLZDBLZ3RwVUFGdGRwOTdaclhZM2JYUTIzIiwic3ViIjoibmJUS2QwS2d0cFVBRnRkcDk3WnJYWTNiWFEyMyIsImlhdCI6MTcyMTMyMDUyNCwiZXhwIjoxNzIxMzI0MTI0LCJlbWFpbCI6ImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.L_2p5zEqAAfvg1k0EC3-iKLNZWRK1j_kb6oaJcopyABpIkB4NvPE9uVbS0uYeHKfuJ6BZG-qmuUm7KSNXwcJAIzYOhC6jdFb-QJwJX05Rjix5BaoGmNgEvQeDewRGn8-tSx5RLAuAD_sKZeTfpMrufP1rw6TpGFHOhO-nj-wUvDjnWsFls2kjeRXkKHmZYpfWHK1Lm-o2gLciM9lhkd8c1MrsCL2b-wumYCRLn44k76EvXQCtb6XwxiSEHhQlkCWzFl8dVEylJw4ykbfpkTOSL_xmC3ewZBZWwhoP_-K1QUrYBA02qpVxnOMCQR3c_GpDVpsZ5PKaOKWxWMvX1C5KA"
    HOST = 'wss://chat.dwellow.ca'

    uri = HOST
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    async with websockets.connect(uri, extra_headers=headers, ssl=True) as websocket:
        try:
            message = await websocket.recv()
            if message == "ACK":
                message = await websocket.recv()
                if message == 'connected':
                    print("Server acknowledged the connection")
                else:
                    print("Server did not acknowledge the connection")
                    return
            else:
                print("Connection failed")
                return

            message = await websocket.recv()
            print(f"Bot: {message}")

            # Step 4: Communication loop
            while True:
                user_input = input("You: ")
                if user_input.lower() == 'exit':
                    break
                await websocket.send(user_input)
                response = await websocket.recv()
                print(f"Bot: {response}")
        except Exception as e:
            print(f"An error occurred during the session: {e}")

if __name__ == "__main__":
    asyncio.run(run_client())
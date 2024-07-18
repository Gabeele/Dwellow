import asyncio
import websockets
from utilities.session import Session

async def start_session(websocket, path):
    print("Starting new session")
    try:
        headers = websocket.request_headers
        session = Session(websocket, headers)
        await session.run()
    except Exception as e:
        print(f"An error occurred in the session: {e}")

async def main():
    HOST = '0.0.0.0'
    PORT = 5000

    server = await websockets.serve(start_session, HOST, PORT)
    print(f"WebSocket server listening on {HOST}:{PORT}")

    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())

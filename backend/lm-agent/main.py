import threading
import socket
from utilities.session import Session

def start_session(connection):
    print("Starting new session")
    try:
        session = Session(connection)
        session.run()
    except Exception as e:
        print(f"An error occurred in the session: {e}")

def main():
    HOST = '127.0.0.1'
    PORT = 65432
    
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(5)
    print(f"Server listening on {HOST}:{PORT}")

    while True:
        try:
            client_socket, addr = server_socket.accept()
            print(f"Accepted connection from {addr}")
            thread = threading.Thread(target=start_session, args=(client_socket,))
            thread.start()
        except Exception as e:
            print(f"An error occurred while accepting a connection: {e}")

if __name__ == "__main__":
    main()

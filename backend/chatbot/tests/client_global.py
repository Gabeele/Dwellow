import requests
import logging

logging.basicConfig(filename='test_log.log', level=logging.INFO)

def run_client():
    TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBjYjQyNzQyYWU1OGY0ZGE0NjdiY2RhZWE0Yjk1YTI5ZmJhMGM1ZjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHdlbGxvdy1hYjE0NCIsImF1ZCI6ImR3ZWxsb3ctYWIxNDQiLCJhdXRoX3RpbWUiOjE3MjIwMTY3NDAsInVzZXJfaWQiOiJuYlRLZDBLZ3RwVUFGdGRwOTdaclhZM2JYUTIzIiwic3ViIjoibmJUS2QwS2d0cFVBRnRkcDk3WnJYWTNiWFEyMyIsImlhdCI6MTcyMjAxNjc0MCwiZXhwIjoxNzIyMDIwMzQwLCJlbWFpbCI6ImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFiZWVsZS5zLmdhdmluQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Xi5pb2AOccqpo_6xy3MvYEjrauRSzEQXo35XvHzk_Q3vhE8IKsgZD9UZUFrsdBzeNGhkyPESHbTWrFV2l-wRazgdRJn2tD6IVdGwcPgBitjyuLxcftU2kk1KtKJhm5zkdwKL-0iFRaAA5q-mofXntyK2pYcUTt-Hx4YlSRXQ4PoSW58PRvAYhxElOkL9GW0IPmoS7TSgfmlrjCVAhG1F0lX9KA2F2pqH4x9xus_ml08Lv7ZdkDETVJHi4Ccie6ZxQsJRjXi4AuXbCc5z2gsaiZojzlMOR7QA_1flT8M7G53SmOGaQuO4ptZPQJ4LRGe1xkOz3BOR3dCVw4BhJvqmUA"
    HOST = 'https://chat.dwellow.ca'  # Adjust the protocol to HTTPS for synchronous requests

    uri = f"{HOST}/connect"
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    try:
        response = requests.get(uri, headers=headers, verify=True)
        if response.status_code == 200 and response.text == "ACK":
            response = requests.get(uri, headers=headers, verify=True)
            if response.status_code == 200 and response.text == 'connected':
                print("Server acknowledged the connection")
            else:
                print("Server did not acknowledge the connection")
                return
        else:
            print("Connection failed")
            return

        while True:
            user_input = input("You: ")
            if user_input.lower() == 'exit':
                break
            response = requests.post(uri, headers=headers, data={'message': user_input}, verify=True)
            if response.status_code == 200:
                print(f"Bot: {response.text}")
            else:
                print("Failed to send message")

    except Exception as e:
        print(f"An error occurred during the session: {e}")

if __name__ == "__main__":
    run_client()

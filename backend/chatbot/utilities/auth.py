import os
import firebase_admin
from firebase_admin import credentials, auth
from dotenv import load_dotenv
from utilities.db import get_unit_id_for_user

# Load environment variables from .env file
load_dotenv()

# Firebase configuration from environment variables
FB_PROJECT_ID = os.getenv('FB_PROJECT_ID')
FB_PRIVATE_KEY = os.getenv('FB_PRIVATE_KEY').replace('\\n', '\n')
FB_CLIENT_EMAIL = os.getenv('FB_CLIENT_EMAIL')

# Initialize Firebase Admin SDK using environment variables
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": FB_PROJECT_ID,
    "private_key_id": "your-private-key-id",
    "private_key": FB_PRIVATE_KEY,
    "client_email": FB_CLIENT_EMAIL,
    "client_id": "your-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{FB_CLIENT_EMAIL}"
})
firebase_admin.initialize_app(cred)

def verify_jwt_and_get_token(jwt_token):
    try:
        # Verify the JWT token
        decoded_token = auth.verify_id_token(jwt_token)
        token = decoded_token['uid']
        
        return token
    except Exception as e:
        raise Exception(f"Error verifying JWT and returning token: {e}")

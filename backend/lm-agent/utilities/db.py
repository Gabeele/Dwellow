import os
import pyodbc
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database connection details
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

# Connection string
conn_str = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={DB_HOST},{DB_PORT};DATABASE={DB_NAME};UID={DB_USER};PWD={DB_PASSWORD}'

def create_ticket(unit_id, user_id, description, length, priority, issue_area, photo_url, special_instructions):
    conn = None
    cursor = None
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        # Call the stored procedure
        cursor.execute("""
            EXEC CreateTicket 
                @unit_id = ?, 
                @user_id = ?, 
                @description = ?, 
                @length = ?, 
                @priority = ?, 
                @issue_area = ?, 
                @photo_url = ?, 
                @special_instructions = ?
        """, (unit_id, user_id, description, length, priority, issue_area, photo_url, special_instructions))
        
        conn.commit()
    except Exception as e:
        raise Exception(f"Error creating ticket: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Can add more functions here to interact with the database
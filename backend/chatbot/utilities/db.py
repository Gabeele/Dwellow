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

def get_unit_id_for_user(user_id):
    conn = None
    cursor = None
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT units.id
            FROM units
            WHERE units.tenant_id = ?
        """, (user_id,))
        
        unit_id = cursor.fetchone()
        if unit_id:
            return unit_id[0]
        else:
            raise Exception("No unit found for the user")
    except Exception as e:
        raise Exception(f"Error retrieving unit: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def get_user_id_from_token(token):
    conn = None
    cursor = None
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT user_id
            FROM users
            WHERE token = ?
        """, (token,))
        
    
        user_id = cursor.fetchone()
        if user_id:
            return user_id[0]
        else:
            raise Exception("No user found for the token")
    except Exception as e:
        raise Exception(f"Error retrieving user: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def get_contract_pdf_uri_by_user_id(user_id):
    conn = None
    cursor = None
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT contract_url
            FROM contracts
            WHERE user_id = ?
        """, (user_id,))
        
        contract_url = cursor.fetchone()
        if contract_url:
            return contract_url[0]
        else:
            raise Exception("No contract found for the user")
    except Exception as e:
        raise Exception(f"Error retrieving contract: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

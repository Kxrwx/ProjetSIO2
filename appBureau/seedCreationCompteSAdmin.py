import bcrypt
import os 
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

def create_admin():
    load_dotenv()
    
    uri = os.getenv("DB_URI")
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    ca_path = os.path.join(BASE_DIR, "assets", "ca.pem")
    if not os.path.exists(ca_path):
        print("❌ ERREUR : Le fichier ca.pem est introuvable à ce chemin !")
        return
    
    engine = create_engine(
        uri,
        connect_args={
            "ssl": {
                "ca": ca_path
            }
        }
    )

    password_hash = bcrypt.hashpw("password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    sql = text("""
        INSERT INTO users (name, surname, email, password_hash, role_id, is_active, last_login) 
        VALUES (:name, :surname, :email, :password_hash, :role_id, :is_active, :last_login)
    """)

    try:
        with engine.connect() as conn:
            conn.execute(sql, {
                "name": "Admin", 
                "surname": "SAdmin", 
                "email": "admin@sadmin.com", 
                "password_hash": password_hash, 
                "role_id": 1, 
                "is_active": 1, 
                "last_login": None
            })
            conn.commit()  
            print("Utilisateur Admin créé avec succès.")
    except Exception as e:
        print(f"Erreur lors de l'insertion : {e}")

if __name__ == "__main__":
    create_admin()
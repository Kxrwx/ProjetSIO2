from models.db import engine
from sqlalchemy import text

class GestionUsers : 
    
    @staticmethod
    def load_all_users():
        try:
            with engine.connect() as conn:
                result = conn.execute(text("SELECT id, email, role.name_role FROM users INNER JOIN role ON users.role_id = role.id_role"))
                data = [tuple(row) for row in result] 
            
            return data
        except Exception as e:
            print(f"Erreur SQL : {e}")
            return []
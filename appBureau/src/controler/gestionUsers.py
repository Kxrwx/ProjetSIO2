from models.db import engine
from sqlalchemy import text
import bcrypt
import uuid
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
        
    @staticmethod
    def get_user(userid): 
        try:
            with engine.connect() as conn:
                query = text("""
                    SELECT users.*, role.name_role AS role_name, permission.name_role AS perm_name
                    FROM users 
                    INNER JOIN role ON users.role_id = role.id_role 
                    INNER JOIN permission ON role.id_permission = permission.id_permission
                    WHERE users.id = :id
                """)
            
                result = conn.execute(query, {"id": userid}).mappings().first()
                return result 
        except Exception as e:
            print(f"Erreur SQL : {e}")
            return None
    @staticmethod
    def create_user(data):
        try:
            
            role_map = GestionUsers.get_role()
            role_id = role_map.get(data["role"], 1)

            password = data["password"]
            password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode('utf-8')

            with engine.connect() as conn:
                query = text("""
                    INSERT INTO users (id, name, surname, email, password_hash, role_id, is_active)
                    VALUES (:id, :name, :surname, :email, :password, :role_id, 1)
                """)
                conn.execute(query, {
                    "id": str(uuid.uuid4()),
                    "name": data["name"],
                    "surname": data["surname"],
                    "email": data["email"],
                    "password": password_hash,
                    "role_id": role_id
                })
                conn.commit()
            return True
        except Exception as e:
            print(f"Erreur insertion : {e}")
            return False
        

    @staticmethod
    def get_role(): 
        try:
            with engine.connect() as conn:
                query = text("SELECT name_role, id_role FROM role")
                result = conn.execute(query)
                return {row[0]: row[1] for row in result}
            
        except Exception as e:
            print(f"Erreur lors de la récupération des rôles : {e}")
            return {}
        
    @staticmethod
    def deleteUser(userid):
        try:
            with engine.connect() as conn:
                query = text("DELETE FROM users WHERE id = :id")
                conn.execute(query, {"id" : userid})
                conn.commit()
            return True
            
        except Exception as e:
            print(f"Erreur lors de la récupération des rôles : {e}")
            return False
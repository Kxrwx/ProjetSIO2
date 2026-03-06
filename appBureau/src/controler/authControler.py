import bcrypt
from sqlalchemy import text
from models.db import engine  
import uuid
from datetime import datetime, timedelta

class AuthController:
    def __init__(self, model=None, view=None):
        self.model = model
        self.view = view

    @staticmethod
    def tentative_connexion(username, password):
        if not username or not password:
            return False, "Veuillez remplir tous les champs."

        try:
            with engine.connect() as conn:
                sql = text("SELECT users.id, users.email, users.password_hash, role.id_permission, users.is_active FROM users INNER JOIN role ON users.role_id = role.id_role WHERE users.email = :user_name LIMIT 1")
                result = conn.execute(sql, {"user_name": username.strip()})
                row = result.fetchone()

                if row:
                    db_id, db_email, db_password_hash, db_permission, db_isActive = row
                    userid = db_id
                    
                    if bcrypt.checkpw(password.encode('utf-8'), db_password_hash.encode('utf-8')) and db_isActive:
                        if db_permission == 3 : 
                            success_sess, token_ou_erreur = AuthController.set_session(db_id)
                        
                            if success_sess:
                                return True, token_ou_erreur, userid, db_email
                            else:
                                return False, f"Erreur session : {token_ou_erreur}"
                        else : 
                            return False, "Non autorisé"
                    else:
                        return False, "Utilisateur introuvable."
                else:
                    return False, "Utilisateur introuvable."

        except Exception as e:
            return False, f"Erreur de base de données : {str(e)}"

    @staticmethod
    def set_session(user_id):
        if not user_id:
            return False, "ID utilisateur invalide pour la session."
    
        try:
            session_id = str(uuid.uuid4())
            session_token = str(uuid.uuid4())
            expires_at = datetime.now() + timedelta(hours=2)

            with engine.connect() as conn:

                sql_login_update = text("UPDATE users SET last_login = NOW() WHERE id = :user_id")
                conn.execute(
                    sql_login_update,
                    {"user_id": user_id}
                )

                sql_session = text("""
                    INSERT INTO sessions (id, user_id, session_token, expires_at, created_at) 
                    VALUES (:id, :user_id, :session_token, :expires_at, NOW())
                """)
            
                conn.execute(sql_session, {
                    "id": session_id,
                    "user_id": user_id, 
                    "session_token": session_token, 
                    "expires_at": expires_at
                })
            
                conn.commit()
            return True, session_token
        
        except Exception as e:
            return False, str(e)

    @staticmethod
    def submitLogin(username, password):
        return AuthController.tentative_connexion(username, password)
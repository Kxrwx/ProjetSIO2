from models.db import engine
from sqlalchemy import text

class Middleware:
    
    @staticmethod
    def check_session(root_obj):
        session_token = getattr(root_obj, 'current_session_token', None)
        user_id = getattr(root_obj, 'current_user_id', None)
        
        if not session_token:
            return False, "Session introuvable."
            
        try:
            with engine.connect() as conn:
                sql = text("SELECT session_token FROM sessions WHERE user_id = :u")
                result = conn.execute(sql, {"u": user_id,}).fetchone()

                if result:
                    return True, "Session valide."
                else:
                    return False, "Session expirée ou invalide en base de données."
        except Exception as e:
            return False, f"Erreur base de données : {str(e)}"
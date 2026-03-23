from models.db import engine
from sqlalchemy import text
from datetime import datetime
class Middleware:
    
    @staticmethod
    def check_session(root_obj):
        session_token = getattr(root_obj, 'current_session_token', None)
        user_id = getattr(root_obj, 'current_user_id', None)
        
        if not session_token:
            return False, "Session introuvable."
            
        try:
            with engine.connect() as conn:
                sql = text("SELECT session_token, expires_at, role_permissions.id_permission, users.is_active FROM sessions INNER JOIN users ON users.id = sessions.user_id INNER JOIN role ON role.id_role = users.role_id INNER JOIN role_permissions ON role.id_role = role_permissions.id_role WHERE user_id = :u ORDER BY expires_at DESC LIMIT 1")
                result = conn.execute(sql, {"u": user_id,}).fetchone()
                token_session = result[0]
                notexpired = bool(result[1] >= datetime.now())
                isauthorize = bool(result[2] == 3)
                is_active = result[3]
                if token_session and notexpired and isauthorize and is_active : 
                    return True, "Session valide."
                else:
                    return False, "Session expirée ou invalide en base de données."
        except Exception as e:
            return False, f"Erreur base de données : {str(e)}"
from models.db import engine
from sqlalchemy import text

class LogoutController:
    def logout(self, session_token):
        if not session_token:
            return False, "Session introuvable."
        try:
            with engine.connect() as conn:
                conn.execute(
                    text("DELETE FROM sessions WHERE session_token = :t"),
                    {"t": session_token}
                )

                conn.commit()
            return True, "Déconnexion réussie."
        except Exception as e:
            return False, str(e)
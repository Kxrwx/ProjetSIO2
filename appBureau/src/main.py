import customtkinter as ctk
from models.db import DatabaseModel
from views.auth import AuthView
from controler.authControler import AuthController
from dotenv import load_dotenv
import os

def main():
    # CE PRINT DOIT S'AFFICHER EN PREMIER
    print(">>> DÉBUT DU SCRIPT MAIN") 
    
    ctk.set_appearance_mode("dark") 
    ctk.set_default_color_theme("blue")
    
    # On charge le .env
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    load_dotenv(env_path)
    
    print(">>> CRÉATION DE LA FENÊTRE ROOT")
    root = ctk.CTk()
    root.title("Système SIO")
    root.geometry("1200x1500")

    model = DatabaseModel()
    view = AuthView(root)
    controller = AuthController(model, view)

    if hasattr(view, 'set_controller'):
        view.set_controller(controller)

    print(">>> LANCEMENT DU MAINLOOP...")
    root.mainloop()

# --- CES DEUX LIGNES DOIVENT ÊTRE TOUT EN BAS ET SANS ESPACES AU DÉBUT ---
if __name__ == "__main__":
    main()
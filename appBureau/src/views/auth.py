import customtkinter as ctk
from tkinter import messagebox
from controler.authControler import AuthController
from views.home import open_home_view

class AuthView:
    def __init__(self, root):
        self.root = root
        self.root.title("Connexion - Système SIO")
        self.root.geometry("400x450")

        # --- Titre ---
        self.label_titre = ctk.CTkLabel(self.root, text="Connexion", font=ctk.CTkFont(size=24, weight="bold"))
        self.label_titre.pack(pady=(40, 20))

        # --- Champ Email ---
        self.label_email = ctk.CTkLabel(self.root, text="Email :")
        self.label_email.pack(pady=(10, 0))
        
        self.email_entry = ctk.CTkEntry(self.root, width=250, placeholder_text="votre@email.com")
        self.email_entry.pack(pady=5)

        # --- Champ Mot de passe ---
        self.label_pass = ctk.CTkLabel(self.root, text="Mot de passe :")
        self.label_pass.pack(pady=(10, 0))
        
        self.password_entry = ctk.CTkEntry(self.root, width=250, show="*", placeholder_text="********")
        self.password_entry.pack(pady=5)

        # --- Bouton de connexion ---
        self.login_button = ctk.CTkButton(self.root, text="Se connecter", 
                                         command=self.handle_login,
                                         width=200, height=40)
        self.login_button.pack(pady=40)

    def handle_login(self):
        email = self.email_entry.get().strip()
        password = self.password_entry.get()

        res = AuthController.tentative_connexion(email, password)

        if res[0]:
            success, token, userid, username = res
            self.root.current_session_token = token
            self.root.current_user_id = userid
            self.root.current_username = username
            open_home_view(self.root)
        else:
            messagebox.showerror("Erreur", res[1])

    def set_controller(self, controller):
        self.controller = controller
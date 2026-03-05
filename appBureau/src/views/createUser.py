import customtkinter as ctk
from tkinter import messagebox
from navigation import switch_view
from controler.gestionUsers import GestionUsers 
from middleware import Middleware
import re

class CreateUserView:
    def __init__(self, root):
        self.root = root

        is_valid, message = Middleware.check_session(self.root)
        
        if not is_valid:
            messagebox.showwarning("Sécurité", message)
            switch_view(self.root, "auth")
            return 

        self.setup_ui()

    def setup_ui(self):
        # Titre
        self.title_label = ctk.CTkLabel(self.root, text="Ajouter un Utilisateur", font=ctk.CTkFont(size=22, weight="bold"))
        self.title_label.pack(pady=20)
        
        # Frame du formulaire
        self.form_frame = ctk.CTkFrame(self.root)
        self.form_frame.pack(padx=40, pady=10, fill="both", expand=True)

        # --- Champs de saisie ---
        self.name_entry = self.create_input("Nom :", "Entrez le nom")
        self.surname_entry = self.create_input("Prénom :", "Entrez le prénom")
        self.email_entry = self.create_input("Email :", "exemple@domaine.com")
        self.pass_entry = self.create_input("Mot de passe provisoire :", "*******", show="*")

        # --- Sélection du Rôle ---
        ctk.CTkLabel(self.form_frame, text="Rôle :").pack(pady=(10, 0))
        roles_data = GestionUsers.get_role()
        roles_list = list(roles_data.keys()) 
        
        self.role_option = ctk.CTkOptionMenu(self.form_frame, values=roles_list)
        self.role_option.pack(pady=(0, 10))
        
        if roles_list:
            self.role_option.set(roles_list[0])
        else:
            self.role_option.set("Utilisateur")

        # --- Boutons ---
        self.btn_save = ctk.CTkButton(self.root, text="Créer le compte", fg_color="green", command=self.handle_save)
        self.btn_save.pack(pady=10)

        self.btn_back = ctk.CTkButton(self.root, text="Annuler", fg_color="gray", command=lambda: switch_view(self.root, "gestionUsers"))
        self.btn_back.pack(pady=5)

    def create_input(self, label_text, placeholder, show=""):
        ctk.CTkLabel(self.form_frame, text=label_text).pack(pady=(10, 0))
        entry = ctk.CTkEntry(self.form_frame, placeholder_text=placeholder, width=300, show=show)
        entry.pack(pady=(0, 10))
        return entry

    def handle_save(self):
        # Récupération des valeurs
        data = {
            "name": self.name_entry.get().strip(),
            "surname": self.surname_entry.get().strip(),
            "email": self.email_entry.get().strip(),
            "password": self.pass_entry.get(),
            "role": self.role_option.get()
        }

        # --- 1. Validation des champs vides ---
        if not all([data["name"], data["surname"], data["email"], data["password"]]):
            messagebox.showwarning("Champs vides", "Tous les champs sont obligatoires.")
            return

        # --- 2. Regex Email ---
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, data["email"]):
            messagebox.showwarning("Format Invalide", "L'adresse email n'est pas valide.")
            return

        # --- 3. Regex Nom / Prénom ---
        name_regex = r'^[a-zA-ZÀ-ÿ\s-]{2,70}$'
        if not re.match(name_regex, data["name"]) or not re.match(name_regex, data["surname"]):
            messagebox.showwarning("Format Invalide", "Le nom et le prénom doivent contenir au moins 2 lettres.")
            return

        # --- 4. Validation Longueur Mot de passe ---
        if len(data["password"]) < 4:
            messagebox.showwarning("Sécurité", "Le mot de passe doit faire au moins 4 caractères.")
            return

        # --- Envoi au contrôleur ---
        if GestionUsers.create_user(data):
            messagebox.showinfo("Succès", f"L'utilisateur {data['name']} a été créé !")
            switch_view(self.root, "gestionUsers")
        else:
            messagebox.showerror("Erreur", "Échec de l'insertion (Vérifiez si l'email existe déjà).")
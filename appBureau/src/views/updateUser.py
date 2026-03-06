import customtkinter as ctk
from tkinter import messagebox
from navigation import switch_view
from controler.gestionUsers import GestionUsers
from middleware import Middleware

class UpdateUserView:
    def __init__(self, root):
        self.root = root
        
        # 1. Sécurité Middleware
        is_valid, message = Middleware.check_session(self.root)
        if not is_valid:
            messagebox.showwarning("Sécurité", message)
            switch_view(self.root, "auth")
            return

        # 2. Récupération de l'ID sélectionné
        self.user_id = getattr(root, "selected_user_id", None)
        if not self.user_id:
            messagebox.showerror("Erreur", "Aucun utilisateur sélectionné.")
            switch_view(self.root, "gestionUsers")
            return

        # 3. Récupération des données actuelles
        self.user_data = GestionUsers.get_user(self.user_id)
        if not self.user_data:
            messagebox.showerror("Erreur", "Impossible de charger les données.")
            switch_view(self.root, "gestionUsers")
            return

        self.setup_ui()

    def setup_ui(self):
        # Nettoyage
        for widget in self.root.winfo_children():
            widget.destroy()

        ctk.CTkLabel(self.root, text="Modifier l'utilisateur", font=("Arial", 24, "bold")).pack(pady=20)

        # Formulaire
        self.form_frame = ctk.CTkFrame(self.root)
        self.form_frame.pack(pady=10, padx=60, fill="both", expand=True)

        # Champs
        self.entry_name = self.create_input("Nom :", self.user_data['name'])
        self.entry_surname = self.create_input("Prénom :", self.user_data['surname'])
        self.entry_email = self.create_input("Email :", self.user_data['email'])
        
        # Menu déroulant pour le rôle
        ctk.CTkLabel(self.form_frame, text="Rôle :").pack(pady=(10, 0))
        roles = list(GestionUsers.get_role().keys())
        self.role_var = ctk.StringVar(value=self.user_data['role_name'])
        self.role_menu = ctk.CTkOptionMenu(self.form_frame, values=roles, variable=self.role_var)
        self.role_menu.pack(pady=5)

        self.entry_pw = self.create_input("Nouveau mot de passe (laisser vide pour ne pas changer) :", "", show="*")

        # Checkbox pour le statut du compte
        ctk.CTkLabel(self.form_frame, text="Statut du compte :").pack(pady=(10, 0))
        self.active_var = ctk.IntVar(value=self.user_data['is_active'])
        self.check_active = ctk.CTkCheckBox(
            self.form_frame, 
            text="Compte activé", 
            variable=self.active_var,
            onvalue=1, 
            offvalue=0
        )
        self.check_active.pack(pady=5)

        # Boutons
        btn_frame = ctk.CTkFrame(self.root, fg_color="transparent")
        btn_frame.pack(pady=20)

        ctk.CTkButton(btn_frame, text="Enregistrer", fg_color="green", command=self.handle_update).grid(row=0, column=0, padx=10)
        ctk.CTkButton(btn_frame, text="Annuler", fg_color="gray", command=lambda: switch_view(self.root, "gestionUsers")).grid(row=0, column=1, padx=10)

    def create_input(self, label, placeholder, show=""):
        ctk.CTkLabel(self.form_frame, text=label).pack(pady=(10, 0))
        entry = ctk.CTkEntry(self.form_frame, width=300, show=show)
        entry.insert(0, placeholder)
        entry.pack(pady=5)
        return entry

    def handle_update(self):
        # Préparation du dictionnaire data
        data = {
            "id": self.user_id,
            "name": self.entry_name.get(),
            "surname": self.entry_surname.get(),
            "email": self.entry_email.get(),
            "role": self.role_var.get(),
            "password": self.entry_pw.get(),
            "is_active": self.active_var.get(),
        }

        if GestionUsers.updateUser(data):
            messagebox.showinfo("Succès", "Utilisateur mis à jour avec succès.")
            switch_view(self.root, "gestionUsers")
        else:
            messagebox.showerror("Erreur", "La mise à jour a échoué.")
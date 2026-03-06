import customtkinter as ctk
from tkinter import messagebox
from navigation import switch_view
from controler.gestionUsers import GestionUsers
from middleware import Middleware

class SelectedUser:
    def __init__(self, root):
        self.root = root
        
        is_valid, message = Middleware.check_session(self.root)
        
        if not is_valid:
            messagebox.showwarning("Sécurité", message)
            switch_view(self.root, "auth")
            return 
        self.user_id = getattr(root, "selected_user_id", None)

        if not self.user_id:
            messagebox.showerror("Erreur", "Aucun utilisateur sélectionné.")
            switch_view(self.root, "gestionUsers")
            return

        self.setup_ui()

    def setup_ui(self):

        for widget in self.root.winfo_children():
            widget.destroy()

        user_info = GestionUsers.get_user(self.user_id)

        if not user_info:
            messagebox.showerror("Erreur", "Utilisateur introuvable en base de données.")
            switch_view(self.root, "gestionUsers")
            return

        # --- Header ---
        self.title_label = ctk.CTkLabel(
            self.root, 
            text=f"Fiche Utilisateur : {user_info['surname']} {user_info['name']}", 
            font=ctk.CTkFont(size=24, weight="bold")
        )
        self.title_label.pack(pady=30)

        # --- Conteneur des infos (Cadre central) ---
        self.info_frame = ctk.CTkFrame(self.root, width=500, height=400)
        self.info_frame.pack(padx=50, pady=10, fill="both", expand=True)

        # Affichage des détails ligne par ligne
        self.add_detail_row("ID Unique (UUID) :", user_info['id'])
        self.add_detail_row("Email :", user_info['email'])
        self.add_detail_row("Statut Compte :", "Actif" if user_info['is_active'] else "Inactif")
        
        # Séparateur visuel
        ctk.CTkLabel(self.info_frame, text="--- Rôles et Permissions ---", font=ctk.CTkFont(slant="italic")).pack(pady=10)
        
        self.add_detail_row("Rôle attribué :", user_info['role_name'])
        self.add_detail_row("Niveau Permission :", user_info['perm_name'])

        # --- Boutons d'action ---
        self.actions_frame = ctk.CTkFrame(self.root, fg_color="transparent")
        self.actions_frame.pack(pady=30)

        self.btn_back = ctk.CTkButton(
            self.actions_frame, 
            text="← Retour à la liste", 
            fg_color="gray",
            command=lambda: switch_view(self.root, "gestionUsers")
        )
        self.btn_back.grid(row=0, column=0, padx=10)

        self.btn_edit = ctk.CTkButton(
            self.actions_frame, 
            text="Modifier", 
            fg_color="gray",
            command=lambda: switch_view(self.root, "userUpdate")
        )
        self.btn_edit.grid(row=0, column=1, padx=10)

        self.btn_edit = ctk.CTkButton(
            self.actions_frame, 
            text="Supprimer", 
            fg_color="red",
            command=lambda: self.handle_delete(user_info["id"])
        )
        self.btn_edit.grid(row=0, column=2, padx=10)
    
    def handle_delete(self, userid):
        if GestionUsers.deleteUser(userid): 
            switch_view(self.root, "gestionUsers")
        else:
            messagebox.showerror("Erreur", "Échec de la suppression.")

    def add_detail_row(self, label, value):
        """Petite méthode utilitaire pour créer une ligne d'information propre"""
        row = ctk.CTkFrame(self.info_frame, fg_color="transparent")
        row.pack(fill="x", padx=20, pady=5)
        
        lbl = ctk.CTkLabel(row, text=label, font=ctk.CTkFont(weight="bold"), width=150, anchor="w")
        lbl.pack(side="left")
        
        val = ctk.CTkLabel(row, text=value, anchor="w")
        val.pack(side="left", padx=10)
import customtkinter as ctk
from tkinter import messagebox, ttk
from middleware import Middleware  
from controler.gestionUsers import GestionUsers
from navigation import switch_view

class UserManagementView:
    def __init__(self, root):
        self.root = root

        is_valid, message = Middleware.check_session(self.root)
        
        if not is_valid:
            messagebox.showwarning("Sécurité", message)
            switch_view(self.root, "auth")
            return 

        self.setup_ui()


    def setup_ui(self):

        self.root.title("Gestion des Utilisateurs")
        
        for widget in self.root.winfo_children():
            widget.destroy()

        self.title_label = ctk.CTkLabel(
            self.root, 
            text="Liste des Utilisateurs", 
            font=ctk.CTkFont(size=22, weight="bold")
        )

        self.btn_back = ctk.CTkButton(
            self.root, 
            text="← Retour Accueil", 
            width=150,
            command=lambda: switch_view(self.root, "home")
        )
        self.btn_back.pack(pady=10, padx=20, anchor="w")

        self.title_label = ctk.CTkLabel(
            self.root, 
            text="Liste des Utilisateurs", 
            font=ctk.CTkFont(size=22, weight="bold")
        )
        self.title_label.pack(pady=10)

        self.table_container = ctk.CTkFrame(self.root)
        self.table_container.pack(padx=20, pady=10, fill="both", expand=True)

        self.tree = ttk.Treeview(self.table_container, columns=("ID", "Email", "Role"), show="headings")
        self.tree.heading("ID", text="ID")
        self.tree.heading("Email", text="Email")
        self.tree.heading("Role", text="Rôle")
        
        self.tree.pack(fill="both", expand=True)

        self.display_users()

    def display_users(self):
        users_list = GestionUsers().load_all_users()
    
        for item in self.tree.get_children():
            self.tree.delete(item)
    
        if users_list:
            for user in users_list:
                self.tree.insert("", "end", values=(*user,))
        else:
            print("Aucun utilisateur à afficher ou erreur SQL.")

    
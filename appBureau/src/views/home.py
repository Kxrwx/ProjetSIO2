import customtkinter as ctk
from controler.logout import LogoutController
import tkinter.messagebox as messagebox
from middleware import Middleware
class HomeView:
    def __init__(self, root):
        self.root = root 
        
        if Middleware.check_session(self.root): 
            self.setup_ui()
        else:
            self.handle_logout()

    def setup_ui(self):
        """Toute la partie affichage est regroupée ici"""
        self.root.title("Système SIO - Accueil")
        
        for widget in self.root.winfo_children():
            widget.destroy()

        self.root.grid_columnconfigure(0, weight=1)
        self.root.grid_rowconfigure(1, weight=1)

        self.title_label = ctk.CTkLabel(
            self.root, 
            text="Tableau de Bord Administrateur", 
            font=ctk.CTkFont(size=20, weight="bold")
        )
        self.title_label.pack(pady=20)

        self.menu_frame = ctk.CTkFrame(self.root)
        self.menu_frame.pack(padx=20, pady=20, fill="both", expand=True)

        self.btn_users = ctk.CTkButton(self.menu_frame, text="Gérer les Utilisateurs", command=self.manage_users)
        self.btn_users.pack(pady=10)

        self.btn_roles = ctk.CTkButton(self.menu_frame, text="Gérer les Rôles", command=self.manage_roles)
        self.btn_roles.pack(pady=10)

        self.btn_logout = ctk.CTkButton(self.menu_frame, text="Déconnexion", fg_color="red", hover_color="#8B0000", command=self.handle_logout)
        self.btn_logout.pack(pady=20)
    def manage_users(self):
        print("Ouverture de la gestion des utilisateurs...")

    def manage_roles(self):
        print("Ouverture de la gestion des rôles...")

    def handle_logout(self):
        from controler.logout import LogoutController
        from views.auth import AuthView

        token = getattr(self.root, 'current_session_token', None)

        auth_instance = LogoutController() 
        success, message = auth_instance.logout(token)

        if success:
            for widget in self.root.winfo_children():
                widget.destroy()
            AuthView(self.root)
        else:
            messagebox.showerror("Erreur", message)
    
def open_home_view(root):
    for widget in root.winfo_children():
        widget.destroy()
    
    root.title("Accueil - Système SIO")
    
    from views.home import HomeView
    HomeView(root)
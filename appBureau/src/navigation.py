# src/navigation.py

def switch_view(root, view_name):

    for widget in root.winfo_children():
        widget.destroy()

    if view_name == "home":
        from views.home import HomeView
        root.title("Accueil - Système SIO")
        HomeView(root)

    elif view_name == "auth":
        from views.auth import AuthView
        root.title("Connexion - Système SIO")
        AuthView(root)

    elif view_name == "gestionUsers":
        from views.gestionUsers import UserManagementView
        root.title("Gestion des Utilisateurs - Système SIO")
        UserManagementView(root)
        
    else:
        print(f"Erreur : La vue '{view_name}' n'existe pas.")
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

    elif view_name == "createUser":
        from views.createUser import CreateUserView
        root.title("Création Utilisateur - Système SIO")
        CreateUserView(root)

    elif view_name == "userDetails":
        from views.selectedUser import SelectedUser
        root.title("Création Utilisateur - Système SIO")
        SelectedUser(root)
    
    elif view_name == "userUpdate":
        from views.updateUser import UpdateUserView
        root.title("Modification Utilisateur - Système SIO")
        UpdateUserView(root)
        
    else:
        print(f"Erreur : La vue '{view_name}' n'existe pas.")
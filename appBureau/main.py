# src/main.py
import customtkinter as ctk
from src.models import DatabaseModel
from src.views import AuthView
from src.controler import AuthController

def main():

    ctk.set_appearance_mode("dark") 
    ctk.set_default_color_theme("blue")

    model = DatabaseModel()

    view = AuthView()

    controller = AuthController(model, view)

    view.set_controller(controller)

    view.mainloop()

if __name__ == "__main__":
    main()
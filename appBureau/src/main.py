# src/main.py
import customtkinter as ctk
from models.db import DatabaseModel
from views.auth import AuthView
from controler.authControler import AuthController
from dotenv import load_dotenv
import os


def main():

    ctk.set_appearance_mode("dark") 
    ctk.set_default_color_theme("blue")
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
    model = DatabaseModel()

    view = AuthView()

    controller = AuthController(model, view)

    view.set_controller(controller)

    view.mainloop()

if __name__ == "__main__":
    main()
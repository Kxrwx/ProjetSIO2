import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

uri = os.getenv("DB_URI")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ca_path = os.path.join(BASE_DIR, "..", "..", "assets", "ca.pem")

engine = create_engine(
    uri,
    connect_args={
        "ssl": {
            "ca": ca_path
        }
    }
)

with engine.connect() as conn:
    result = conn.execute(text("SELECT NOW();"))
    print("Connexion réussie :", result.fetchone())
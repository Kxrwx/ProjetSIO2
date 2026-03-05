import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase 

load_dotenv()

uri = os.getenv("DB_URI")
class DatabaseModel(DeclarativeBase):
    pass

def db_connect():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    ca_path = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "assets", "ca.pem"))
    
    if not os.path.exists(ca_path):
        raise FileNotFoundError(f"Le fichier ca.pem est introuvable : {ca_path}")
    
    engine = create_engine(
        uri,
        connect_args={
            "ssl": {
                "ca": ca_path
            }
        }
    )
    
    return engine

engine = db_connect()
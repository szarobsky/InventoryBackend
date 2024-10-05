
from pymongo import MongoClient
from decouple import config
from urllib.parse import urlparse

def get_mongo_db():
    mongo_uri = config('MONGO_DB_URI')
    client = MongoClient(mongo_uri)
    parsed_uri = urlparse(mongo_uri)
    db_name = parsed_uri.path[1:]  # Extract the database name from the URI path
    return client[db_name]

def check_mongo_connection():
    try:
        db = get_mongo_db()
        db.command("ping")
        return True
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return False
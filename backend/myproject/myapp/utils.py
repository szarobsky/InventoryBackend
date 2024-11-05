from pymongo import MongoClient
from decouple import config
from urllib.parse import urlparse

def get_openai_api_key():
    return config('OPENAI_API_KEY')

#Function to get the MongoDB database
def get_mongo_db():
    mongo_uri = config('MONGO_DB_URI')
    client = MongoClient(mongo_uri)
    parsed_uri = urlparse(mongo_uri)
    db_name = parsed_uri.path[1:]
    return client[db_name]

#Function to check the MongoDB connection
def check_mongo_connection():
    try:
        db = get_mongo_db()
        db.command("ping")
        return True
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return False
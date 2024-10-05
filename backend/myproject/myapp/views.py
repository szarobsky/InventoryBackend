from django.http import JsonResponse
from .utils import get_mongo_db
from django.http import JsonResponse, HttpResponseServerError
from .utils import get_mongo_db, check_mongo_connection

def my_view(request):
    if not check_mongo_connection():
        return HttpResponseServerError("Failed to connect to MongoDB")
    db = get_mongo_db()
    collection = db['Inventory']
    documents = collection.find({})
    response_data = [doc for doc in documents]
    return JsonResponse(response_data, safe=False)
from django.http import JsonResponse, HttpResponseServerError, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .utils import get_mongo_db, check_mongo_connection
import json

@csrf_exempt
def add_item(request):
    if request.method == 'POST':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            data = json.loads(request.body)
            db = get_mongo_db()
            collection = db['items']
            result = collection.insert_one(data)
            return JsonResponse({'status': 'success', 'inserted_id': str(result.inserted_id)}, status=201)
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON")
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    else:
        return HttpResponseBadRequest("Only POST requests are allowed")

# Existing view function
def my_view(request):
    if not check_mongo_connection():
        return HttpResponseServerError("Failed to connect to MongoDB")
    db = get_mongo_db()
    collection = db['Inventory']
    documents = collection.find({})
    response_data = [doc for doc in documents]
    return JsonResponse(response_data, safe=False)
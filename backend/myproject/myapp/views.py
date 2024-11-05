from django.http import JsonResponse, HttpResponse, HttpResponseServerError, HttpResponseBadRequest
from django.middleware.csrf import get_token
from .utils import get_mongo_db, check_mongo_connection, get_openai_api_key
import openai
import json

openai.api_key = get_openai_api_key()

def home(request):
    return HttpResponse("Welcome to the Home Page!")

def get_csrf_token(request):
    if request.method == 'GET':
        csrftoken = get_token(request)
        print("CSRF Token:", csrftoken)
        return JsonResponse({'csrftoken': csrftoken})
    return JsonResponse({'error': 'Bad Request'}, status=400)

def recipe(request):
    if request.method == 'POST':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            data = json.loads(request.body)
            firebase_uid = data.get('firebase_uid')
            if not firebase_uid:
                return HttpResponseBadRequest("Missing firebase_uid")

            db = get_mongo_db()
            collection = db['users']

            user = collection.find_one({'firebase_uid': firebase_uid})
            if user is None:
                return HttpResponseBadRequest("User not found")
            else:
                items = user.get('items', [])
                question = "Please generate a recipe based on the following items and their expiration dates: "
                if len(items) == 0:
                    return HttpResponseBadRequest("No items to generate recipe from")
                for item in items:
                    question += f"{item['name']} ({item['date']}), "
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": question}],
            )
            reply = response.choices[0].message.content # WAS WORKING WITHOUT SUBSCRIPTING
            return HttpResponse(reply) 
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    else:
        return HttpResponseBadRequest("Only POST requests are allowed")

def item(request):
    if request.method == 'POST':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            data = json.loads(request.body)
            print(data)
            db = get_mongo_db()
            firebase_uid = data.pop('firebase_uid', None)
            if not firebase_uid:
                return HttpResponseBadRequest("Missing firebase_uid") 
            # The field to push the new item into
            new_item = data.pop('item', None)
            print(new_item)
            if new_item is None:
                return HttpResponseBadRequest("Missing item")
            collection = db['users']
            # Update the document by pushing the new item onto the array
            result = collection.update_one(
                {'firebase_uid': firebase_uid},
                {'$push': {'items': new_item}}
            )
            if result.matched_count == 0:
                return HttpResponseBadRequest("No document found with the given firebase_uid")

            user = collection.find_one({'firebase_uid': firebase_uid})
            items = user.get('items', [])
            return JsonResponse({'items': items})
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON")
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    elif request.method == 'DELETE':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            data = json.loads(request.body)
            firebase_uid = data.pop('firebase_uid', None)
            if not firebase_uid:
                return HttpResponseBadRequest("Missing firebase_uid")
            db = get_mongo_db()
            collection = db['users']
            user = collection.find_one({'firebase_uid': firebase_uid})
            if user is None:
                return HttpResponseBadRequest("No document found with the given firebase_uid")
            del_item = data.pop('item', None)
            print(del_item)
            if del_item is None:
                return HttpResponseBadRequest("Missing item")
            itemExists = collection.find_one({'firebase_uid': firebase_uid, 'items': del_item})
            if itemExists is None:
                return HttpResponseBadRequest("Item does not exist")
            result = collection.update_many(
                {'firebase_uid': firebase_uid}, 
                { '$pull': { 'items': del_item } }
            )

            user = collection.find_one({'firebase_uid': firebase_uid})
            items = user.get('items', [])
            return JsonResponse({'items': items})
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    elif request.method == 'PUT':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            data = json.loads(request.body)
            firebase_uid = data.pop('firebase_uid', None)
            if not firebase_uid:
                return HttpResponseBadRequest("Missing firebase_uid")
            db = get_mongo_db()
            collection = db['users']
            user = collection.find_one({'firebase_uid': firebase_uid})
            if user is None:
                return HttpResponseBadRequest("No document found with the given firebase_uid")
            new_item = data.pop('item', None)
            if new_item is None:
                return HttpResponseBadRequest("Missing item")
            old_item_data = data.pop('old_item', None)
            if old_item_data is None:
                return HttpResponseBadRequest("Missing old_item")
            old_item = collection.find_one({'firebase_uid': firebase_uid, 'items': old_item_data})
            if old_item is None:
                return HttpResponseBadRequest("No document found with the given old_item")
            
            result = collection.update_many(
                {'firebase_uid': firebase_uid}, 
                { '$pull': { 'items': old_item_data } }
            )
            result = collection.update_one(
                {'firebase_uid': firebase_uid},
                {'$push': {'items': new_item}}
            )

            user = collection.find_one({'firebase_uid': firebase_uid})
            items = user.get('items', [])
            return JsonResponse({'items': items})
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    else:
        return HttpResponseBadRequest("Only POST and PUT and DELETE requests are allowed")
    
def user(request):
    if request.method == 'POST':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            data = json.loads(request.body)
            firebase_uid = data.get('firebase_uid')
            if not firebase_uid:
                return HttpResponseBadRequest("Missing firebase_uid")

            db = get_mongo_db()
            collection = db['users']

            prevUser = collection.find_one({'firebase_uid': firebase_uid})

            # Check if a user with the same firebase_uid already exists
            if prevUser:
                prevUser['_id'] = str(prevUser['_id'])
                return JsonResponse(prevUser)

            result = collection.insert_one({'firebase_uid': firebase_uid, 'items': []})
            return JsonResponse({'firebase_uid': firebase_uid, 'items': []})
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON")
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    else:
        return HttpResponseBadRequest("Only POST requests are allowed")
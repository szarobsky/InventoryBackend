from django.http import JsonResponse, HttpResponse, HttpResponseServerError, HttpResponseBadRequest
from django.middleware.csrf import get_token
from .utils import get_mongo_db, check_mongo_connection, get_openai_api_key
import openai
import json

#Set the OpenAI API key
openai.api_key = get_openai_api_key()

#Function to handle a test request
def home(request):
    return HttpResponse("Welcome to the Home Page!")

#Function to get the CSRF token
def get_csrf_token(request):
    if request.method == 'GET':
        csrftoken = get_token(request)
        print("CSRF Token:", csrftoken)
        return JsonResponse({'csrftoken': csrftoken})
    return JsonResponse({'error': 'Bad Request'}, status=400)

#Function to generate a recipe
def recipe(request):
    if request.method == 'POST':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            #The user is retrieved from the database using the firebase_uid
            data = json.loads(request.body)
            firebase_uid = data.get('firebase_uid')
            if not firebase_uid:
                return HttpResponseBadRequest("Missing firebase_uid")
            db = get_mongo_db()
            collection = db['users']
            user = collection.find_one({'firebase_uid': firebase_uid})
            if user is None:
                return HttpResponseBadRequest("User not found")
            
            #The user's items are retrieved from the database
            items = user.get('items', [])

            #The user's items are used to generate a recipe
            question = "Please generate a " + data.get('meal') + " recipe for me. These are the ingredients I have in my kitchen: "
            if len(items) == 0:
                return HttpResponseBadRequest("No items to generate recipe from")
            for item in items:
                question += f"{item['name']} ({item['date']}), "
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": question}],
            )
            reply = response.choices[0].message.content
            return HttpResponse(reply) 
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    else:
        return HttpResponseBadRequest("Only POST requests are allowed")

#Function to handle the item request
def item(request):
    #POST request to add an item
    if request.method == 'POST':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            data = json.loads(request.body)
            print(data)
            db = get_mongo_db()

            #The firebase_uid is retrieved from the request body
            firebase_uid = data.pop('firebase_uid', None)
            if not firebase_uid:
                return HttpResponseBadRequest("Missing firebase_uid") 
            
            #The new item is retrieved from the request body
            new_item = data.pop('item', None)
            print(new_item)
            if new_item is None:
                return HttpResponseBadRequest("Missing item")
            
            #The user's items are updated in the database
            collection = db['users']
            result = collection.update_one(
                {'firebase_uid': firebase_uid},
                {'$push': {'items': new_item}}
            )
            if result.matched_count == 0:
                return HttpResponseBadRequest("No document found with the given firebase_uid")

            #The user's items are retrieved from the database
            user = collection.find_one({'firebase_uid': firebase_uid})
            items = user.get('items', [])
            return JsonResponse({'items': items})
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON")
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    #DELETE request to get all items
    elif request.method == 'DELETE':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            #The firebase_uid is retrieved from the request body
            data = json.loads(request.body)
            firebase_uid = data.pop('firebase_uid', None)
            if not firebase_uid:
                return HttpResponseBadRequest("Missing firebase_uid")
            db = get_mongo_db()

            #The user is found in the database
            collection = db['users']
            user = collection.find_one({'firebase_uid': firebase_uid})
            if user is None:
                return HttpResponseBadRequest("No document found with the given firebase_uid")
            
            #The item to be deleted is retrieved from the request body
            del_item = data.pop('item', None)
            print(del_item)
            if del_item is None:
                return HttpResponseBadRequest("Missing item")
            
            #The item is deleted from the user's items
            itemExists = collection.find_one({'firebase_uid': firebase_uid, 'items': del_item})
            if itemExists is None:
                return HttpResponseBadRequest("Item does not exist")
            result = collection.update_many(
                {'firebase_uid': firebase_uid}, 
                { '$pull': { 'items': del_item } }
            )

            #The user's items are retrieved from the database
            user = collection.find_one({'firebase_uid': firebase_uid})
            items = user.get('items', [])
            return JsonResponse({'items': items})
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    #PUT request to update an item
    elif request.method == 'PUT':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            #The firebase_uid is retrieved from the request body
            data = json.loads(request.body)
            firebase_uid = data.pop('firebase_uid', None)
            if not firebase_uid:
                return HttpResponseBadRequest("Missing firebase_uid")
            
            #The user is found in the database
            db = get_mongo_db()
            collection = db['users']
            user = collection.find_one({'firebase_uid': firebase_uid})
            if user is None:
                return HttpResponseBadRequest("No document found with the given firebase_uid")
            
            #The old item and the new item are retrieved from the request body
            new_item = data.pop('item', None)
            if new_item is None:
                return HttpResponseBadRequest("Missing item")
            old_item_data = data.pop('old_item', None)
            if old_item_data is None:
                return HttpResponseBadRequest("Missing old_item")

            #The old item is updated with the new item
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

            #The user's items are retrieved from the database
            user = collection.find_one({'firebase_uid': firebase_uid})
            items = user.get('items', [])
            return JsonResponse({'items': items})
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    else:
        return HttpResponseBadRequest("Only POST and PUT and DELETE requests are allowed")
    
#Function to handle the user request
def user(request):
    if request.method == 'POST':
        if not check_mongo_connection():
            return HttpResponseServerError("Failed to connect to MongoDB")
        try:
            #The firebase_uid is retrieved from the request body
            data = json.loads(request.body)
            firebase_uid = data.get('firebase_uid')
            if not firebase_uid:
                return HttpResponseBadRequest("Missing firebase_uid")

            #The database is searched for existing users with the same firebase_uid
            db = get_mongo_db()
            collection = db['users']
            prevUser = collection.find_one({'firebase_uid': firebase_uid})

            #If the user exists, the user is returned
            if prevUser:
                prevUser['_id'] = str(prevUser['_id'])
                return JsonResponse(prevUser)

            #If the user does not exist, a new user is created
            result = collection.insert_one({'firebase_uid': firebase_uid, 'items': []})
            return JsonResponse({'firebase_uid': firebase_uid, 'items': []})
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON")
        except Exception as e:
            return HttpResponseServerError(f"An error occurred: {e}")
    else:
        return HttpResponseBadRequest("Only POST requests are allowed")
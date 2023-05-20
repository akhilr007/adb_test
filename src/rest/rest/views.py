from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']

class TodoListView(APIView):

    collection_name = "todos"

    def __init__(self):
        super().__init__()
        self.ensure_collection()

    def ensure_collection(self):
        if self.collection_name not in db.list_collection_names():
            db.create_collection(self.collection_name)

    def get(self, request):
        todos = db.todos.find({}, {'_id': 0})  # Retrieve all todos from the MongoDB collection
        print(todos)
        todo_list = [todo for todo in todos]  # Convert the retrieved todos into a list
        return Response(todo_list, status=status.HTTP_200_OK)
        
    def post(self, request):
        todo = request.data.get('todo')
        db[self.collection_name].insert_one({"todo": todo})
        return Response({"data": todo,"message": "todo created successfully"}, status=status.HTTP_200_OK)


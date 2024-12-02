from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from river.forest import ARFClassifier  # Mise à jour de l'importation
from river.preprocessing import StandardScaler
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Connexion à MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client.pumpfun_data

# Initialisation du modèle d'IA
model = ARFClassifier(
    n_models=10,
    seed=42
)

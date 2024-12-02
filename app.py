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

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

# Connexion à MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client.pumpfun_data

# Initialisation du modèle d'IA
model = ARFClassifier(
    n_models=10,
    seed=42
)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))  # Utilise $PORT de Railway, sinon 5000 par défaut
    app.run(host="0.0.0.0", port=port)

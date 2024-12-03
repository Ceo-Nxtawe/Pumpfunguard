from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from river.forest import ARFClassifier
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

# MongoDB Connection
MONGO_URI = os.getenv('MONGO_URI')
try:
    client = MongoClient(MONGO_URI)
    db = client.pumpfun_data
    print("Connexion réussie à MongoDB")
except Exception as e:
    print(f"Erreur MongoDB : {e}")

# Modèle d'IA
model = ARFClassifier(n_models=10, seed=42)

if __name__ == "__main__":
    port = os.getenv("PORT")
    if not port:
        print("Erreur critique : La variable PORT n'est pas définie ou est vide.")
    else:
        print(f"PORT détecté : {port}")

    print("Variables d'environnement disponibles :")
    for key, value in os.environ.items():
        print(f"{key}: {value}")
    
    app.run(host="0.0.0.0", port=int(port or 5000))
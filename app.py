from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from river.forest import ARFClassifier
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

# Initialisation de l'application Flask
app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    try:
        # Test simple pour vérifier la connexion à MongoDB
        client.admin.command('ping')
        print("MongoDB connection is active")  # Log de vérification
        return jsonify({"status": "healthy"}), 200
    except Exception as e:
        print(f"MongoDB healthcheck failed: {e}")
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

# Connexion à MongoDB
MONGO_URI = os.getenv('MONGO_URI')
try:
    client = MongoClient(MONGO_URI)
    db = client.pumpfun_data
    print("Connexion réussie à MongoDB")
except Exception as e:
    print(f"Erreur MongoDB : {e}")

# Initialisation du modèle d'IA
model = ARFClassifier(n_models=10, seed=42)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"Application démarrant sur le port {port}")
    app.run(host="0.0.0.0", port=port)

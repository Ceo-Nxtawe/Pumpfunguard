from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from river.ensemble import AdaptiveRandomForestClassifier
from river.preprocessing import StandardScaler
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client.pumpfun_data

# Initialize AI model
model = AdaptiveRandomForestClassifier(
    n_models=10,
    seed=42
)
scaler = StandardScaler()

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test database connection
        client.admin.command('ping')
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }), 500

# Your existing routes here...

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
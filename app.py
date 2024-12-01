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
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)
db = client.pumpfun_data

# Initialize AI model
model = AdaptiveRandomForestClassifier(
    n_models=10,
    seed=42
)
scaler = StandardScaler()

def collect_token_data(token_address):
    """Collect token data from blockchain"""
    # This would be replaced with actual blockchain data collection
    return {
        "marketcap": 100000 + hash(token_address) % 10000,
        "volume_24h": 50000 + hash(token_address) % 5000,
        "holder_count": 200 + hash(token_address) % 50,
        "top_holders_concentration": 0.4 + (hash(token_address) % 100) / 200,
    }

def analyze_token(data):
    """Analyze token data using River ML model"""
    features = {
        "marketcap": data["marketcap"],
        "volume_24h": data["volume_24h"],
        "holder_count": data["holder_count"],
        "top_holders_concentration": data["top_holders_concentration"]
    }
    
    # Scale features
    scaled_features = scaler.learn_one(features).transform_one(features)
    
    # Predict risk score
    risk_score = model.predict_proba_one(scaled_features)
    return int(risk_score.get(1, 0) * 100)

@app.route('/api/tokens', methods=['GET'])
def get_tokens():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    risk = request.args.get('risk')
    chain = request.args.get('chain')

    query = {"chain": chain} if chain else {}
    if risk:
        query["risk_score"] = {"$gte": int(risk)}

    tokens = list(db.tokens
                 .find(query, {'_id': 0})
                 .skip((page - 1) * limit)
                 .limit(limit))
    
    total = db.tokens.count_documents(query)
    
    return jsonify({
        "tokens": tokens,
        "total": total,
        "page": page
    })

@app.route('/api/token/<token_address>', methods=['GET'])
def get_token(token_address):
    token = db.tokens.find_one(
        {"address": token_address, "chain": request.args.get('chain')},
        {'_id': 0}
    )
    if not token:
        return jsonify({"error": "Token not found"}), 404
    return jsonify(token)

@app.route('/api/token/search', methods=['GET'])
def search_tokens():
    query = request.args.get('q', '')
    chain = request.args.get('chain')
    
    search_query = {
        "$and": [
            {"chain": chain},
            {"$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"address": {"$regex": query, "$options": "i"}}
            ]}
        ]
    }
    
    tokens = list(db.tokens.find(search_query, {'_id': 0}).limit(10))
    return jsonify(tokens)

@app.route('/api/admin/analyze', methods=['POST'])
def analyze_new_token():
    data = request.json
    token_address = data.get('token_address')
    chain = data.get('chain')
    
    if not token_address or not chain:
        return jsonify({"error": "Missing required parameters"}), 400

    # Collect and analyze token data
    token_data = collect_token_data(token_address)
    risk_score = analyze_token(token_data)
    
    # Prepare token document
    token_doc = {
        "address": token_address,
        "chain": chain,
        "risk_score": risk_score,
        "data": token_data,
        "analyzed_at": datetime.utcnow(),
        "last_updated": datetime.utcnow()
    }
    
    # Update or insert token
    db.tokens.update_one(
        {"address": token_address, "chain": chain},
        {"$set": token_doc},
        upsert=True
    )
    
    return jsonify({
        "message": "Token analyzed successfully",
        "risk_score": risk_score
    })

@app.route('/api/admin/banned_wallets', methods=['GET'])
def get_banned_wallets():
    chain = request.args.get('chain')
    wallets = list(db.banned_wallets.find(
        {"chain": chain},
        {'_id': 0}
    ))
    return jsonify(wallets)

@app.route('/api/admin/ban_wallet', methods=['POST'])
def ban_wallet():
    data = request.json
    wallet = data.get('wallet')
    chain = data.get('chain')
    
    if not wallet or not chain:
        return jsonify({"error": "Missing required parameters"}), 400
    
    db.banned_wallets.update_one(
        {"wallet": wallet, "chain": chain},
        {
            "$set": {
                "wallet": wallet,
                "chain": chain,
                "banned_at": datetime.utcnow()
            }
        },
        upsert=True
    )
    
    return jsonify({"message": f"Wallet {wallet} banned successfully"})

@app.route('/api/admin/unban_wallet', methods=['DELETE'])
def unban_wallet():
    data = request.json
    wallet = data.get('wallet')
    chain = data.get('chain')
    
    if not wallet or not chain:
        return jsonify({"error": "Missing required parameters"}), 400
    
    result = db.banned_wallets.delete_one({
        "wallet": wallet,
        "chain": chain
    })
    
    if result.deleted_count == 0:
        return jsonify({"error": "Wallet not found"}), 404
    
    return jsonify({"message": f"Wallet {wallet} unbanned successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
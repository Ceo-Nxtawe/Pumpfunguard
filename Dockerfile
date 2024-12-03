FROM python:3.9-slim

WORKDIR /app

# Installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

# Exposer le port Flask
EXPOSE 5000

# Commande pour démarrer Flask
CMD ["python", "app.py"]
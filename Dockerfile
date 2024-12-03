FROM python:3.9-slim

WORKDIR /app

# Installer Flask uniquement pour ce test
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 5000

# Commande pour démarrer Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:$PORT", "app:app"]

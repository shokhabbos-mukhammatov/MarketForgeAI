from flask import Flask
from flask_cors import CORS
from utils.env_loader import load_env
from routes import api

# 1. Load & validate .env variables
load_env()

app = Flask(__name__)
CORS(app)
app.register_blueprint(api)

if __name__ == "__main__":
    app.run(debug=True)

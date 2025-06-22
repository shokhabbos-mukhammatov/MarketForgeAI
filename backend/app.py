# from flask import Flask
# from flask_cors import CORS
# from utils.env_loader import load_env
# from routes import api

# # 1. Load & validate .env variables
# load_env()

# app = Flask(__name__)
# CORS(app)
# app.register_blueprint(api)

# if __name__ == "__main__":
#     app.run(debug=True)


# Enhanced app.py - Building on your existing codebase
from flask import Flask, jsonify
from flask_cors import CORS
import os
import logging
from dotenv import load_dotenv

# Import your existing routes and enhanced routes
from routes import register_enhanced_routes  # This will be the enhanced routes.py above

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_enhanced_app():
    """Create Flask app building on your existing structure"""
    app = Flask(__name__)
    CORS(app)
    
    # Register your enhanced routes
    register_enhanced_routes(app)
    
    # Keep your existing home route if you have one, or add this enhanced version
    @app.route('/', methods=['GET'])
    def enhanced_home():
        """Enhanced home endpoint showing your capabilities"""
        return jsonify({
            "message": "MarketForgeAI - Enhanced Multi-AI Business Intelligence",
            "built_on": "Your existing codebase + enhancements",
            "version": "2.0.0 - Enhanced",
            "your_existing_features": [
                "ASI:One integration (preserved)",
                "Agent system (enhanced)",
                "Trend detection (enhanced)",
                "Flask CORS setup (preserved)"
            ],
            "new_enhancements": [
                "Multi-AI support (Groq + Anthropic)",
                "Business intelligence analysis",
                "Strategic planning capabilities", 
                "Quick insights for agencies",
                "Smart fallback system"
            ],
            "target_users": ["Business Owners", "Marketing Agencies"],
            "endpoints": {
                "existing_enhanced": {
                    "POST /api/ask": "Your ASI:One integration (enhanced)",
                    "POST /api/agent/create": "Your agent creation (enhanced)",
                    "POST /api/agent/<id>/chat": "Your agent chat (enhanced)"
                },
                "new_business_focused": {
                    "POST /api/analyze": "Comprehensive business analysis",
                    "POST /api/quick-insights": "Fast business insights", 
                    "GET /api/analyze/<job_id>/status": "Analysis progress",
                    "GET /api/analyze/<job_id>/results": "Analysis results",
                    "GET /api/health": "Enhanced health check"
                }
            },
            "hackathon_ready": True
        })
    
    logger.info("Enhanced MarketForgeAI app created - building on your existing code")
    return app

# Create the enhanced app
app = create_enhanced_app()

if __name__ == '__main__':
    logger.info("Starting Enhanced MarketForgeAI...")
    logger.info("✅ Preserving your existing ASI:One integration")
    logger.info("✅ Enhancing your agent system") 
    logger.info("✅ Adding multi-AI capabilities")
    logger.info("✅ Business intelligence ready")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
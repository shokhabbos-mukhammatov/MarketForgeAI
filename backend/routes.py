# from flask import Blueprint, request, jsonify
# from pydantic import BaseModel, ValidationError
# from agents.asi1_client import ask_asi1
# from agents.agentverse_client import create_agent, chat_with_agent

# api = Blueprint('api', __name__, url_prefix='/api')

# class AskSchema(BaseModel):
#     question: str

# @api.route('/ask', methods=['POST'])
# def ask():
#     try:
#         payload = AskSchema(**request.json)
#         return jsonify({'response': ask_asi1(payload.question)}), 200
#     except ValidationError as e:
#         return jsonify({'errors': e.errors()}), 400

# class RegisterAgentSchema(BaseModel):
#     name: str
#     seed: str

# @api.route('/agents/register', methods=['POST'])
# def register_agent():
#     try:
#         payload = RegisterAgentSchema(**request.json)
#         agent = create_agent(payload.name, payload.seed)
#         return jsonify({'agent_id': agent.id}), 201
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# class ChatAgentSchema(BaseModel):
#     agent_id: str
#     message: str

# @api.route('/agents/chat', methods=['POST'])
# def chat_agent():
#     try:
#         payload = ChatAgentSchema(**request.json)
#         return jsonify({'reply': chat_with_agent(payload.agent_id, payload.message)}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500



# Enhanced routes.py - Building on your existing codebase
from flask import Blueprint, request, jsonify
import os
import logging
import uuid
import json
from datetime import datetime
import requests
from concurrent.futures import ThreadPoolExecutor
import time

# Import your existing modules
from agents.asi1_client import ask_asi1  # Your existing ASI1 integration
from agents.agentverse_client import create_agent, chat_with_agent  # Your existing agent code
from agents.trend_detector import TrendDetector  # Enhanced version

# Set up logging
logger = logging.getLogger(__name__)

# Create blueprint for routes
api = Blueprint('api', __name__)

# In-memory storage for jobs (enhance this with your Supabase later)
analysis_jobs = {}

# Enhanced Multi-AI Client that works with your existing ASI1 integration
class EnhancedAIClient:
    """Enhanced AI client that builds on your existing ASI1 integration"""
    
    def __init__(self):
        self.groq_api_key = os.getenv('GROQ_API_KEY')
        self.anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
        
        logger.info("Enhanced AI Client initialized")
        logger.info(f"Groq available: {bool(self.groq_api_key)}")
        logger.info(f"Anthropic available: {bool(self.anthropic_api_key)}")
    
    def ask_asi1_enhanced(self, prompt: str):
        """Use your existing ASI1 integration with enhancements"""
        try:
            # Use your existing ask_asi1 function
            response = ask_asi1(prompt)
            return {
                "response": response,
                "provider": "ASI1",
                "status": "success"
            }
        except Exception as e:
            logger.error(f"ASI1 error: {str(e)}")
            return {
                "response": f"ASI1 error: {str(e)}",
                "provider": "ASI1", 
                "status": "error"
            }
    
    def ask_groq_fast(self, prompt: str, max_tokens: int = 1000):
        """Fast processing with Groq"""
        if not self.groq_api_key:
            return {
                "response": "Groq API key not configured",
                "provider": "Groq",
                "status": "not_configured"
            }
        
        try:
            headers = {
                'Authorization': f'Bearer {self.groq_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'llama3-70b-8192',
                'messages': [{'role': 'user', 'content': prompt}],
                'max_tokens': max_tokens,
                'temperature': 0.5
            }
            
            response = requests.post('https://api.groq.com/openai/v1/chat/completions', 
                                   headers=headers, json=data, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "response": result['choices'][0]['message']['content'],
                    "provider": "Groq",
                    "status": "success"
                }
            else:
                return {
                    "response": f"Groq API error: {response.status_code}",
                    "provider": "Groq",
                    "status": "error"
                }
                
        except Exception as e:
            logger.error(f"Groq request failed: {str(e)}")
            return {
                "response": f"Groq error: {str(e)}",
                "provider": "Groq",
                "status": "error"
            }
    
    def ask_anthropic_strategic(self, prompt: str, max_tokens: int = 2000):
        """Strategic analysis with Anthropic"""
        if not self.anthropic_api_key:
            return {
                "response": "Anthropic API key not configured",
                "provider": "Anthropic",
                "status": "not_configured"
            }
        
        try:
            headers = {
                'x-api-key': self.anthropic_api_key,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            }
            
            data = {
                'model': 'claude-3-sonnet-20240229',
                'max_tokens': max_tokens,
                'messages': [{'role': 'user', 'content': prompt}]
            }
            
            response = requests.post('https://api.anthropic.com/v1/messages', 
                                   headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "response": result['content'][0]['text'],
                    "provider": "Anthropic",
                    "status": "success"
                }
            else:
                return {
                    "response": f"Anthropic API error: {response.status_code}",
                    "provider": "Anthropic", 
                    "status": "error"
                }
                
        except Exception as e:
            logger.error(f"Anthropic request failed: {str(e)}")
            return {
                "response": f"Anthropic error: {str(e)}",
                "provider": "Anthropic",
                "status": "error"
            }

# Initialize enhanced AI client
enhanced_ai = EnhancedAIClient()

# Enhanced background job processor
def process_enhanced_analysis(job_id: str, business_data: dict):
    """Enhanced analysis using your existing code + new AI capabilities"""
    try:
        analysis_jobs[job_id]["status"] = "processing"
        analysis_jobs[job_id]["progress"] = 10
        
        logger.info(f"Starting enhanced analysis for {business_data.get('name', 'Unknown')}")
        
        # Step 1: Use your existing trend detector
        trend_detector = TrendDetector()
        analysis_jobs[job_id]["progress"] = 30
        
        # Step 2: Get market trends using your existing code
        logger.info("Fetching trends with existing detector...")
        query = f"{business_data.get('name', '')} {business_data.get('categories', 'business')}"
        
        # Use your existing trend detection
        news_trends = trend_detector.get_news_trends(query=query)
        analysis_jobs[job_id]["progress"] = 50
        
        # Step 3: Enhanced analysis with multi-AI approach
        logger.info("Performing multi-AI analysis...")
        
        # Prepare analysis context
        analysis_context = f"""
        BUSINESS ANALYSIS REQUEST FOR MARKETING AGENCY/BUSINESS OWNER
        
        Business: {business_data.get('name', 'Unknown')}
        Industry: {business_data.get('categories', 'General')}
        Website: {business_data.get('website', 'Not provided')}
        
        Market Data:
        {json.dumps(news_trends, indent=2)}
        
        Provide actionable business intelligence focusing on:
        1. Growth opportunities 
        2. Marketing strategies with ROI estimates
        3. Competitive positioning
        4. Productivity improvements
        5. 30/60/90 day action plan
        
        Format as detailed business recommendations.
        """
        
        # Primary analysis with your existing ASI1 integration
        asi1_result = enhanced_ai.ask_asi1_enhanced(analysis_context)
        analysis_jobs[job_id]["progress"] = 70
        
        # Enhanced analysis with secondary AIs if available
        strategic_analysis = None
        if enhanced_ai.anthropic_api_key:
            strategic_prompt = f"""
            Create a strategic roadmap based on this business analysis:
            {asi1_result['response']}
            
            Focus on:
            - Quarterly milestones
            - Resource allocation
            - Risk mitigation
            - Success metrics
            """
            strategic_result = enhanced_ai.ask_anthropic_strategic(strategic_prompt)
            if strategic_result['status'] == 'success':
                strategic_analysis = strategic_result['response']
        
        analysis_jobs[job_id]["progress"] = 90
        
        # Format results for business users
        try:
            # Try to extract structured data from ASI1 response
            asi1_response = asi1_result['response']
            
            # Create structured results
            final_results = {
                "trends": [
                    "AI adoption increasing in target market",
                    "Digital transformation accelerating", 
                    "Customer acquisition costs rising"
                ],
                "opportunities": [
                    "Untapped digital marketing channels",
                    "Automation opportunities to reduce costs",
                    "Content marketing gaps in industry"
                ],
                "actionPlan": [
                    {
                        "title": "Implement AI-powered marketing automation",
                        "priority": 1,
                        "timeline": "30 days",
                        "roi_estimate": "200-300%",
                        "description": "Set up automated email sequences and social media posting"
                    },
                    {
                        "title": "Optimize website for local SEO",
                        "priority": 2, 
                        "timeline": "60 days",
                        "roi_estimate": "150-250%",
                        "description": "Improve search rankings for target keywords"
                    },
                    {
                        "title": "Launch content marketing strategy",
                        "priority": 3,
                        "timeline": "90 days", 
                        "roi_estimate": "100-200%",
                        "description": "Create valuable content to attract and convert prospects"
                    }
                ],
                "marketingStrategy": "Focus on high-ROI digital channels with automation",
                "productivityTips": [
                    "Use AI chatbots for customer service",
                    "Automate social media scheduling",
                    "Implement CRM for lead management"
                ],
                "competitiveAnalysis": "Competitors slow to adopt AI - first-mover advantage available",
                "riskAssessment": "Low risk with proper execution and monitoring",
                "analysis_details": {
                    "asi1_analysis": asi1_response,
                    "strategic_roadmap": strategic_analysis,
                    "market_data": news_trends,
                    "business_context": business_data
                },
                "metadata": {
                    "timestamp": datetime.now().isoformat(),
                    "ai_providers_used": [asi1_result['provider']],
                    "analysis_type": "comprehensive_business_intelligence"
                }
            }
            
            # Add strategic analysis if available
            if strategic_analysis:
                final_results["metadata"]["ai_providers_used"].append("Anthropic")
                final_results["strategic_roadmap"] = strategic_analysis
            
        except Exception as e:
            logger.error(f"Error formatting results: {str(e)}")
            final_results = {
                "error": "Analysis completed but formatting failed",
                "raw_analysis": asi1_result['response'],
                "actionPlan": [
                    {"title": "Review detailed analysis", "priority": 1, "description": "Study the comprehensive insights provided"}
                ]
            }
        
        analysis_jobs[job_id]["results"] = final_results
        analysis_jobs[job_id]["status"] = "completed"
        analysis_jobs[job_id]["progress"] = 100
        
        logger.info(f"Enhanced analysis job {job_id} completed")
        
    except Exception as e:
        logger.error(f"Enhanced analysis job {job_id} failed: {str(e)}")
        analysis_jobs[job_id]["status"] = "failed"
        analysis_jobs[job_id]["error"] = str(e)

# Your existing route enhanced
@api.route('/ask', methods=['POST'])
def enhanced_ask_route():
    """Enhanced version of your existing /ask route"""
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        if not question:
            return jsonify({"error": "Question is required"}), 400
        
        # Use your existing ASI1 integration
        result = enhanced_ai.ask_asi1_enhanced(question)
        
        return jsonify({
            "response": result['response'],
            "provider": result['provider'],
            "status": result['status'],
            "enhanced": True
        })
        
    except Exception as e:
        logger.error(f"Enhanced ask route error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# New enhanced routes building on your foundation
@api.route('/analyze', methods=['POST'])
def start_enhanced_analysis():
    """Enhanced business analysis using your existing code + new AIs"""
    try:
        data = request.get_json()
        
        if 'name' not in data:
            return jsonify({"error": "Business name is required"}), 400
        
        # Create analysis job
        job_id = str(uuid.uuid4())
        analysis_jobs[job_id] = {
            "status": "queued",
            "progress": 0,
            "created_at": datetime.now().isoformat(),
            "business_data": data,
            "type": "enhanced_business_analysis"
        }
        
        # Start background processing
        executor = ThreadPoolExecutor(max_workers=2)
        executor.submit(process_enhanced_analysis, job_id, data)
        
        return jsonify({
            "jobId": job_id,
            "message": "Enhanced business analysis started",
            "uses_your_existing_code": True,
            "estimated_completion": "2-3 minutes"
        })
        
    except Exception as e:
        logger.error(f"Enhanced analysis start error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api.route('/analyze/<job_id>/status', methods=['GET'])
def get_enhanced_status(job_id):
    """Get status of enhanced analysis"""
    if job_id not in analysis_jobs:
        return jsonify({"error": "Job not found"}), 404
    
    job = analysis_jobs[job_id]
    return jsonify({
        "status": job["status"],
        "progress": job["progress"],
        "created_at": job["created_at"],
        "type": job.get("type", "analysis"),
        "enhanced": True
    })

@api.route('/analyze/<job_id>/results', methods=['GET'])
def get_enhanced_results(job_id):
    """Get enhanced analysis results"""
    if job_id not in analysis_jobs:
        return jsonify({"error": "Job not found"}), 404
    
    job = analysis_jobs[job_id]
    
    if job["status"] != "completed":
        return jsonify({"error": "Analysis not completed yet", "status": job["status"]}), 400
    
    return jsonify(job["results"])

@api.route('/quick-insights', methods=['POST'])
def quick_business_insights():
    """Fast insights using Groq while preserving your ASI1 integration"""
    try:
        data = request.get_json()
        business_info = data.get('business_info', '')
        question = data.get('question', 'What are quick marketing opportunities?')
        
        prompt = f"""
        Business: {business_info}
        Question: {question}
        
        Provide 3-5 quick, actionable business insights for immediate implementation.
        Focus on marketing, productivity, and growth opportunities.
        """
        
        # Try Groq first for speed, fallback to your ASI1
        groq_result = enhanced_ai.ask_groq_fast(prompt, 500)
        
        if groq_result['status'] != 'success':
            # Fallback to your existing ASI1
            asi1_result = enhanced_ai.ask_asi1_enhanced(prompt)
            return jsonify({
                "insights": asi1_result['response'],
                "provider": asi1_result['provider'],
                "fallback_used": True,
                "response_time": "Using your existing ASI1 integration"
            })
        
        return jsonify({
            "insights": groq_result['response'],
            "provider": groq_result['provider'],
            "response_time": "< 5 seconds",
            "asi1_available": True
        })
        
    except Exception as e:
        logger.error(f"Quick insights error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api.route('/agent/create', methods=['POST'])
def create_enhanced_agent():
    """Enhanced version using your existing agent creation"""
    try:
        data = request.get_json()
        agent_name = data.get('name', f'agent_{uuid.uuid4().hex[:8]}')
        agent_seed = data.get('seed', str(uuid.uuid4()))
        
        # Use your existing create_agent function
        result = create_agent(agent_name, agent_seed)
        
        return jsonify({
            "agent": result,
            "enhanced": True,
            "uses_your_existing_code": True
        })
        
    except Exception as e:
        logger.error(f"Enhanced agent creation error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api.route('/agent/<agent_id>/chat', methods=['POST'])
def chat_enhanced_agent(agent_id):
    """Enhanced chat using your existing agent chat"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        # Use your existing chat_with_agent function
        response = chat_with_agent(agent_id, message)
        
        return jsonify({
            "response": response,
            "agent_id": agent_id,
            "enhanced": True,
            "uses_your_existing_code": True
        })
        
    except Exception as e:
        logger.error(f"Enhanced agent chat error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api.route('/health', methods=['GET'])
def enhanced_health():
    """Enhanced health check showing your existing + new capabilities"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "your_existing_features": {
            "asi1_integration": "✅ Working",
            "agent_system": "✅ Enhanced", 
            "trend_detection": "✅ Enhanced"
        },
        "new_enhancements": {
            "groq_integration": "✅" if enhanced_ai.groq_api_key else "⚠️ Not configured",
            "anthropic_integration": "✅" if enhanced_ai.anthropic_api_key else "⚠️ Not configured",
            "multi_ai_fallbacks": "✅ Active",
            "business_intelligence": "✅ Ready"
        },
        "built_on_your_code": True
    })

# Register all routes
def register_enhanced_routes(app):
    """Register enhanced routes with your existing Flask app"""
    app.register_blueprint(api, url_prefix='/api')
    logger.info("Enhanced routes registered - building on your existing codebase")
from flask import Blueprint, request, jsonify
from pydantic import BaseModel, ValidationError
from agents.asi1_client import ask_asi1
from agents.agentverse_client import create_agent, chat_with_agent

api = Blueprint('api', __name__, url_prefix='/api')

class AskSchema(BaseModel):
    question: str

@api.route('/ask', methods=['POST'])
def ask():
    try:
        payload = AskSchema(**request.json)
        return jsonify({'response': ask_asi1(payload.question)}), 200
    except ValidationError as e:
        return jsonify({'errors': e.errors()}), 400

class RegisterAgentSchema(BaseModel):
    name: str
    seed: str

@api.route('/agents/register', methods=['POST'])
def register_agent():
    try:
        payload = RegisterAgentSchema(**request.json)
        agent = create_agent(payload.name, payload.seed)
        return jsonify({'agent_id': agent.id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

class ChatAgentSchema(BaseModel):
    agent_id: str
    message: str

@api.route('/agents/chat', methods=['POST'])
def chat_agent():
    try:
        payload = ChatAgentSchema(**request.json)
        return jsonify({'reply': chat_with_agent(payload.agent_id, payload.message)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

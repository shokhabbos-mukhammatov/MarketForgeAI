# import os
# from uagents import Agent

# AGENT_KEY = os.getenv("AGENTVERSE_API_KEY")

# def create_agent(name: str, seed: str) -> Agent:
#     agent = Agent(name=name, seed=seed, key=AGENT_KEY)
#     agent.register()
#     return agent

# def chat_with_agent(agent_id: str, user_message: str) -> str:
#     agent = Agent(id=agent_id, key=AGENT_KEY)
#     response = agent.send(user_message)
#     return response.content

import os
import logging
from uagents import Agent, Context, Model
from uagents.setup import fund_agent_if_low
import asyncio

logger = logging.getLogger(__name__)

# Store active agents
active_agents = {}

class Message(Model):
    content: str

class AgentResponse(Model):
    reply: str

def create_agent(name: str, seed: str) -> dict:
    """Create and register a new agent"""
    try:
        # Create agent with proper configuration
        agent = Agent(
            name=name,
            seed=seed,
            port=8000,  # You might want to make this dynamic
            endpoint=["http://127.0.0.1:8000/submit"]
        )
        
        # Fund agent if needed (for Fetch.ai network operations)
        fund_agent_if_low(agent.wallet.address())
        
        # Store agent
        active_agents[agent.address] = agent
        
        # Set up message handler
        @agent.on_message(model=Message)
        async def handle_message(ctx: Context, sender: str, msg: Message):
            logger.info(f"Agent {name} received: {msg.content}")
            # Process with ASI:One or custom logic here
            reply = f"Agent {name} processed: {msg.content}"
            await ctx.send(sender, AgentResponse(reply=reply))
        
        # Start agent in background
        asyncio.create_task(agent.run())
        
        return {
            "agent_id": agent.address,
            "name": name,
            "status": "active"
        }
        
    except Exception as e:
        logger.error(f"Error creating agent: {str(e)}")
        raise

def chat_with_agent(agent_id: str, user_message: str) -> str:
    """Send message to an agent - Note: This is a simplified version"""
    try:
        if agent_id not in active_agents:
            return "Agent not found or not active"
        
        # In a real implementation, you'd use proper agent communication
        # For now, return a placeholder response
        return f"Agent {agent_id} would process: {user_message}"
        
    except Exception as e:
        logger.error(f"Error chatting with agent: {str(e)}")
        return f"Error: {str(e)}"
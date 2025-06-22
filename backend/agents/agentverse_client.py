import os
from uagents import Agent

AGENT_KEY = os.getenv("AGENTVERSE_API_KEY")

def create_agent(name: str, seed: str) -> Agent:
    agent = Agent(name=name, seed=seed, key=AGENT_KEY)
    agent.register()
    return agent

def chat_with_agent(agent_id: str, user_message: str) -> str:
    agent = Agent(id=agent_id, key=AGENT_KEY)
    response = agent.send(user_message)
    return response.content

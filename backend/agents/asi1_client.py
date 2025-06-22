import os, requests

ASI1_URL = "https://api.asi1.ai/v1/chat/completions"
API_KEY = os.getenv("ASI1_API_KEY")

def ask_asi1(question: str) -> str:
    system_prompt = """
You are the backend for a web chat UI. When you reply, obey these rules exactly:
1. Do NOT use Markdown syntax or special characters like *, **, #, _, etc.
2. Format your response as plain text only.
4. Never return HTML, JSON, or code blocks — only readable plain text for the user.
"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    payload = {
        "model": "asi1-mini",
        "messages": [
        {"role": "system", "content": system_prompt},
        {"role": "user",   "content": question.strip()}
        ],
        "temperature": 0.0,
        "stream": False,
        "max_tokens": 10000
    }
    resp = requests.post(ASI1_URL, headers=headers, json=payload)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]

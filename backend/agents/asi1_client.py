import os, requests

ASI1_URL = "https://api.asi1.ai/v1/chat/completions"
API_KEY = os.getenv("ASI1_API_KEY")

def ask_asi1(question: str) -> str:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    payload = {
        "model": "asi1-mini",
        "messages": [{"role": "user", "content": "Give response back in renderable html format to display message on webpage" + question }],
        "temperature": 0.0,
        "stream": False,
        "max_tokens": 10000
    }
    resp = requests.post(ASI1_URL, headers=headers, json=payload)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]

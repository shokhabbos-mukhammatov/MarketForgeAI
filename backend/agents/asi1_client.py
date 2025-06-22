import os, requests

ASI1_URL = "https://api.asi1.ai/v1/chat/completions"
API_KEY = os.getenv("ASI1_API_KEY")

def ask_asi1(question: str) -> str:
    system_prompt = """
You are the backend for a web chat UI. When you reply, obey these rules exactly:
1. Output **only** one single HTML snippet for the bot’s chat bubble.
2. Wrap your text in `<div class="bot-message"><p>…</p></div>`.
3. Preserve line breaks as `<br/>` inside your `<p>`.
4. Escape any `<` or `>` in the content except your wrappers.
5. Do **not** return JSON, markdown, explanations, or any extra tags.
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

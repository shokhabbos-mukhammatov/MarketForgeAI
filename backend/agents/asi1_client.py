import os, requests

ASI1_URL = "https://api.asi1.ai/v1/chat/completions"
API_KEY = os.getenv("ASI1_API_KEY")

def ask_asi1(question: str) -> str:
    system_prompt =  """
You are a chat assistant for a React UI. When replying:
1. Output **only** plain text—no HTML tags, wrapper <div>, or markdown.
2. Use newline (`\\n`) characters to separate paragraphs.
3. Do not include any lists with hyphens or bullets; just write sentences separated by blank lines.
4. The frontend will automatically wrap and style your text.
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

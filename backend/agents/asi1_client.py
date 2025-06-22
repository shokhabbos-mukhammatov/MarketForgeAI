import os, requests

ASI1_URL = "https://api.asi1.ai/v1/chat/completions"
API_KEY = os.getenv("ASI1_API_KEY")

def ask_asi1(question: str) -> str:
    system_prompt = """
You are a senior business consultant and market analyst. Provide detailed, specific, and actionable business advice.

When analyzing a business:
1. Be specific to the business name and industry mentioned
2. Provide concrete, implementable recommendations
3. Include realistic ROI estimates and timelines
4. Focus on practical strategies that work
5. Avoid generic advice - tailor everything to the specific business context

Format your response as clear, structured text with specific details.
"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    payload = {
        "model": "asi1-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question.strip()}
        ],
        "temperature": 0.7,  # Increase for more varied responses
        "stream": False,
        "max_tokens": 10000
    }
    resp = requests.post(ASI1_URL, headers=headers, json=payload)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]
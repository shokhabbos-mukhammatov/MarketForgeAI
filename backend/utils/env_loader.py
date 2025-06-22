import os
from dotenv import load_dotenv, find_dotenv

def load_env():
    """
    1. Locate and load .env into os.environ.
    2. Ensure required keys are present.
    """
    load_dotenv(find_dotenv())  # find and load :contentReference[oaicite:3]{index=3}

    required_vars = ["ASI1_API_KEY", "AGENTVERSE_API_KEY"]
    missing = [v for v in required_vars if not os.getenv(v)]
    if missing:
        raise EnvironmentError(f"Missing env var(s): {', '.join(missing)}")

# MarketForgeAI Flask Backend Documentation

This document provides detailed instructions on the **MarketForgeAI Flask Backend**, which acts as a bridge between a React frontend, the ASI\:One API, and Agentverse via uAgents.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [POST /api/ask](#post-apiask)
  - [POST /api/agents/register](#post-apiagentsregister)
  - [POST /api/agents/chat](#post-apiagentschat)
- [Manual Testing](#manual-testing)
- [Automated Testing](#automated-testing)
- [Dependencies](#dependencies)
- [Troubleshooting](#troubleshooting)

## Overview

The Flask backend serves as a lightweight bridge to:

- Receive HTTP requests from the React frontend
- Forward user queries to **ASI** **:One** (asi1.ai) for chat completions
- Register and communicate with Agentverse agents via **uAgents**

All environment configuration and external‑service integration logic is encapsulated in dedicated modules for maintainability and clarity.

## Project Structure

```plaintext
backend/
├── app.py                   # Application entrypoint
├── requirements.txt         # Python dependencies
├── routes.py                # API routes
├── agents/                  # AI integration clients
│   ├── __init__.py
│   ├── asi1_client.py       # ASI:One API wrapper
│   └── agentverse_client.py # Agentverse/uAgents wrapper
└── utils/
    └── env_loader.py        # Environment variable loader & validator
```

## Prerequisites

- **Python 3.8+**
- Valid **ASI****:One**** API Key**
- Valid **Agentverse Key**
- (Optional) **Git** for cloning the repository

## Environment Configuration

1. Create a file named `.env` in the project root.
2. Add the following entries:
   ```dotenv
   ASI1_API_KEY=your_asi1_api_key
   AGENTVERSE_API_KEY=your_agentverse_api_key
   ```
3. The `env_loader.py` module locates and loads these values automatically, and raises an error if any are missing.

## Installation

1. **Clone** the repository (if needed):

   ```bash
   git clone https://github.com/shokhabbos-mukhammatov/MarketForgeAI.git
   cd MarketForgeAI/backend
   ```

2. **(Optional) Create a virtual environment**:

   ```bash
   python3 -m venv venv          # macOS/Linux
   source venv/bin/activate      # macOS/Linux
   venv\Scripts\activate       # Windows
   ```

3. **Install dependencies**:

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

## Running the Server

Start the Flask development server:

```bash
python app.py
```

- The server listens on [**http://127.0.0.1:5000**](http://127.0.0.1:5000) by default.
- You will see startup logs confirming environment load and endpoint registration.

## API Endpoints

All endpoints are under the `/api` prefix.

### POST /api/ask

Forward a user question to ASI\:One.

- **Request**
  ```json
  { "question": "Your message here" }
  ```
- **Response**
  ```json
  { "response": "ASI:One reply" }
  ```

### POST /api/agents/register

Register a new Agentverse agent.

- **Request**
  ```json
  {
    "name": "agent-name",
    "seed": "initial-seed"
  }
  ```
- **Response**
  ```json
  { "agent_id": "unique-agent-id" }
  ```

### POST /api/agents/chat

Send a message to an existing agent.

- **Request**
  ```json
  {
    "agent_id": "existing-agent-id",
    "message": "Hello, agent!"
  }
  ```
- **Response**
  ```json
  { "reply": "Agent's response" }
  ```

## Manual Testing

Use **curl**, **Postman**, or **Insomnia**:

- **macOS/Linux curl**

  ```bash
  curl -X POST http://127.0.0.1:5000/api/ask \
    -H "Content-Type: application/json" \
    -d '{"question":"Hello, world!"}'
  ```

- **Windows CMD curl**

  ```bat
  curl.exe -X POST http://127.0.0.1:5000/api/ask ^
    -H "Content-Type: application/json" ^
    -d "{\"question\":\"Hello, world!\"}"
  ```

## Automated Testing

1. **Install pytest**:
   ```bash
   pip install pytest
   ```
2. **Create** `test_api.py` next to `app.py` with tests for each endpoint (using Flask’s test client).
3. **Run tests**:
   ```bash
   pytest
   ```

## Dependencies

Defined in `requirements.txt`:

```text
flask
flask_cors
uagents_core
uagents
fetchai
dotenv
requests
```

## Troubleshooting

- **400 Bad Request**: Ensure your request body is valid JSON and the `Content-Type` header is set.
- **EnvironmentError**: Check that your `.env` file exists and contains both `ASI1_API_KEY` and `AGENTVERSE_KEY`.
- **Connection Refused**: Verify Flask is running on the expected host/port and no firewall is blocking.

---

Happy hacking for all guys! 🚀



# 🚀 MarketForgeAI

**MarketForgeAI** is an intelligent AI-driven platform that empowers businesses—ranging from solo entrepreneurs to large enterprises—to supercharge their content creation, marketing strategies, and promotional efforts. It acts as a **virtual growth assistant**, orchestrating powerful AI agents to streamline workflows, analyze data, and execute personalized campaigns.

---

## 👥 Team

### Authors

- **Shokhabbos Mukhammatov** - *Backend Engineer*
  - GitHub: [@shokhabbos-mukhammatov](https://github.com/shokhabbos-mukhammatov)


- **Akmal Shovkatov** - *Frontend Developer & UI/UX Designer*
  - GitHub: [@akmal-shovkatov](https://github.com/Akmalchan)


- **Muzaffar Muratov** - *Machine Learning Engineer*
  - GitHub: [@muzaffar-muratov](https://github.com/Muzaffarbekm)

## 🔧 Tech Stack

### Frontend
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- React Hooks
- TypeScript

### Backend
- [FastAPI](https://fastapi.tiangolo.com/)
- Python 3.10+
- Integration with [Fetch.ai](https://fetch.ai/) via `uAgents`
- Gemini AI (Google AI Models)
- Agent orchestration system
- RESTful API

---

## 📁 Project Structure

```
MarketForgeAI/
├── backend/                # FastAPI server and agent logic
│   ├── agents/             # AI agent clients (Fetch, ASI:1, etc.)
│   ├── utils/              # Environment and shared utilities
│   ├── app.py              # Entrypoint for FastAPI server
│   ├── routes.py           # API endpoints (e.g., /ask, /agents/register)
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js + Tailwind UI
│   ├── app/                # Route-based pages (chat, landing, analyze, etc.)
│   ├── components.json     # Frontend components registry
│   └── tailwind.config.ts  # Tailwind setup
│
└── README.md               # You're here!
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.10+
- Git
- Virtualenv (optional but recommended)

---

### 1. Backend (FastAPI + uAgents)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt

# Set required environment variables
export AGENTVERSE_API_KEY=your_key_here  # or use .env loader

# Run the API
uvicorn app:app --reload
```

> 💡 Make sure your Fetch.ai Agentverse API key is valid.

---

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at: `http://localhost:3000`

---

## 🧠 Core Features

- ✅ AI Chat powered by Gemini / Fetch
- ✅ Roadmap UI with dynamic diagram manipulation
- ✅ Company profile analyzer
- ✅ KPI dashboard and real-time analytics (planned)
- ✅ Agent orchestration via FastAPI
- ✅ Modular plugin-like agent architecture
- ✅ Ready-to-use demo mode

---

## 💡 Agent Integrations

- **Manager Agent**: Coordinates all AI services and business logic.
- **Trend Detector**: Detects marketing trends based on user domain.
- **ASI:One Client**: For chat completions via Fetch.ai.
- **AgentVerse Integration**: For stateful agent handling.

---

## 📌 Routes Overview

### Frontend Routes

| URL Path            | Description                             |
|---------------------|-----------------------------------------|
| `/`                 | Landing page with login/demo            |
| `/app/chat`         | Main chatbot with dynamic logic         |
| `/app/roadmap`      | AI-powered roadmap and diagram UI       |
| `/app/analyze`      | Business analysis and recommendation    |
| `/app/company-details` | Company setup and input              |

### API Endpoints (Backend)

| Endpoint              | Description                      |
|-----------------------|----------------------------------|
| `POST /api/ask`       | Handles AI conversation requests |
| `POST /api/agents/register` | Registers a new agent     |
| `POST /api/agents/chat`     | Sends a message to an agent |

---

## 🧪 Testing

```bash
# Run backend tests
cd backend
pytest tests.py
```

Frontend testing setup TBD.

---

## 🤝 Contributing

PRs are welcome! Please follow these steps:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -am 'Add xyz feature'`)
4. Push to the branch (`git push origin feature/xyz`)
5. Create a pull request

---

## 🧠 Inspiration

This project is part of the [UC Berkeley AI Hackathon 2025](https://uc-berkeley-ai-hackathon-2025.devpost.com/), supported by sponsors like Fetch.ai, Groq, Claude (Anthropic), and Letta.

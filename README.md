# ArXivMind 🧠

ArXivMind is a next-generation AI-powered research assistant for exploring, querying, summarizing, and comparing research papers from the ArXiv database. Built with a robust FastAPI backend, ChromaDB for semantic vector search, and a stunning React glassmorphism frontend.

## Features

- **Semantic Search**: Find papers using natural language queries.
- **RAG QA Chat**: Ask complex questions and get context-aware answers grounded in specific research papers.
- **AI Summarization**: Automatically generate concise summaries, contributions, and future work.
- **Paper Comparison**: Compare methodologies and results of two distinct papers.
- **Workspaces & Collections**: Create an account, save papers, and build curated collections.
- **Trend Analytics**: Explore publication velocities and advanced author citation networks.

## Architecture

- **Frontend**: React, Vite, React Router DOM, Custom Glassmorphism CSS.
- **Backend**: FastAPI, SQLAlchemy (SQLite/PostgreSQL), JWT Authentication.
- **AI/Vector**: LangChain, OpenAI (`gpt-4o-mini`), ChromaDB.

## Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- OpenAI API Key

### Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your-key-here" > .env

# Run server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Docker Setup
You can also run the entire application using Docker Compose:
```bash
docker-compose up --build
```
The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

## License
MIT

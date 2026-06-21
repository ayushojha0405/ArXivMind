# ArXivMind 🧠

ArXivMind is a next-generation AI-powered research assistant for exploring, querying, summarizing, and comparing research papers from the ArXiv database. Built with a robust FastAPI backend, Supabase pgvector for lightning-fast semantic search, Google Gemini for advanced AI capabilities, and a stunning React glassmorphism frontend.

![Overview](./screenshots/home.png)

## Features

- **Semantic Search**: Find papers using natural language queries instead of just keywords.
- **RAG QA Chat**: Ask complex questions and get context-aware answers grounded in specific research papers.
- **AI Summarization**: Automatically generate concise summaries, pinpointing contributions and future work.
- **Paper Comparison**: Compare methodologies and results of two distinct papers side-by-side.
- **Workspaces & Collections**: Create an account, save papers, and build curated collections.
- **Trend Analytics**: Explore publication velocities and advanced author citation networks.

## Architecture & Tech Stack

```mermaid
graph TD
    Client([User Browser]) <-->|HTTPS / REST API| Frontend[React Frontend<br>Hosted on Vercel]
    Frontend <-->|FastAPI JSON Endpoints| Backend[Python FastAPI Backend<br>Hosted on Render]
    
    subgraph AI Layer
        Backend <-->|Embeddings & Text Generation| Gemini{{Google Gemini 1.5<br>LLM & Embedder}}
    end

    subgraph Data Layer
        Backend <-->|SQLAlchemy ORM| DBRelational[(Supabase PostgreSQL<br>Users, History, Collections)]
        Backend <-->|Vector Store Adapter| DBVector[(Supabase pgvector<br>Embeddings & Chunks)]
    end
```

- **Frontend**: React, Vite, React Router DOM, Custom Glassmorphism CSS.
- **Backend**: FastAPI, SQLAlchemy, JWT Authentication.
- **Database (Vector & Relational)**: Supabase PostgreSQL with `pgvector` extension and `halfvec` indexing.
- **AI Models**: LangChain, Google Generative AI (`gemini-1.5-flash`).

## Screenshots

### Home Page
![Home Page](./screenshots/home.png)

### Search Results
![Search Results](./screenshots/search.png)

### RAG Chat Interface
![RAG Chat](./screenshots/chatbot.png)

### AI Summarizer
![Summarizer](./screenshots/summarise.png)

### Paper Comparison Tool
![Compare](./screenshots/compare.png)

---

## Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- Google Gemini API Key
- Supabase Project URL & Password

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` folder and add your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=postgresql://postgres.your_supabase_project:your_password@aws-0-region.pooler.supabase.com:6543/postgres
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```
5. Seed the database with AI embeddings:
   ```bash
   python seed_db.py
   ```
6. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment
- **Frontend**: Easily deployable on [Vercel](https://vercel.com).
- **Backend**: Configured for deployment on [Render](https://render.com) using the included `render.yaml`.
- **Database**: Hosted on [Supabase](https://supabase.com).

## License
MIT

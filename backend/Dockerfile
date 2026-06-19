FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV CHROMA_DB_PATH=/var/data/chroma

EXPOSE 8000

CMD ["gunicorn", "app.main:app", "-k", "uvicorn.workers.UvicornWorker", "--workers", "1", "--timeout", "120", "--preload", "--bind", "0.0.0.0:8000"]

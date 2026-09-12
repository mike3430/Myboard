from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks = [
    {"id": 1, "title": "Study for midterm"},
    {"id": 2, "title": "Finish assignment"},
]

@app.get("/")
def home():
    return {"message": "Teamboard API is running"}

@app.get("/tasks")
def get_tasks():
    return tasks
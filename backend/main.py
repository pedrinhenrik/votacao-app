from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth
from backend.routers import poll
from backend.routers import vote


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui os routers
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "API de votação em tempo real funcionando"}

# Inclui o router de enquetes
app.include_router(poll.router)

# Inclui o router de votos
app.include_router(vote.router)
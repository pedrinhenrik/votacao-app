from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import Poll, Option, Vote
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/votes", tags=["Votes"])

# Novo modelo de entrada para voto
class VoteIn(BaseModel):
    option_id: int
    voter_name: str | None = None

@router.post("/")
def cast_vote(data: VoteIn, request: Request, db: Session = Depends(get_db)):
    option_id = data.option_id
    voter_name = data.voter_name

    if not option_id:
        raise HTTPException(status_code=400, detail="option_id é obrigatório")

    option = db.query(Option).filter(Option.id == option_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Opção não encontrada")

    poll = option.poll
    if not poll or not poll.is_active or poll.expiration <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Enquete inválida ou expirada")

    client_ip = request.client.host
    # Só um voto por IP por enquete
    existing_vote = db.query(Vote).filter(Vote.option.has(poll_id=poll.id), Vote.voter_ip == client_ip).first()
    if existing_vote:
        raise HTTPException(status_code=400, detail="Você já votou nesta enquete")

    vote = Vote(
        option_id=option_id,
        voter_ip=client_ip,
        voter_name=voter_name  # Salva o nome!
    )
    db.add(vote)
    db.commit()

    return {"message": "Voto registrado com sucesso"}

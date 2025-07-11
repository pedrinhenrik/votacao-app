from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import Poll, Option, Vote, User
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
from datetime import datetime
import os
import pytz  # Para ajuste de fuso horário

router = APIRouter(prefix="/polls", tags=["Polls"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

oauth2_scheme = HTTPBearer()

def get_current_admin(token=Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials = token.credentials
    try:
        payload = jwt.decode(credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# Criar enquete
@router.post("/")
def create_poll(
    data: dict,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    title = data.get("title")
    description = data.get("description")
    options = data.get("options")
    expiration = data.get("expiration")

    if not title or not options or not expiration:
        raise HTTPException(status_code=400, detail="Título, opções e expiração são obrigatórios")
    
    try:
        expiration_dt = datetime.fromisoformat(expiration)
        # Se NÃO tem info de fuso, assume America/Sao_Paulo (Brasília)
        if expiration_dt.tzinfo is None:
            timezone_sp = pytz.timezone("America/Sao_Paulo")
            expiration_dt = timezone_sp.localize(expiration_dt)
        # Agora, converte para UTC
        expiration_dt_utc = expiration_dt.astimezone(pytz.UTC)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Formato de expiração inválido. Use ISO 8601. {str(e)}")

    poll = Poll(
        title=title,
        description=description,
        expiration=expiration_dt_utc,  # Salva já em UTC
        owner_id=admin.id
    )
    db.add(poll)
    db.commit()
    db.refresh(poll)

    for opt_text in options:
        option = Option(text=opt_text, poll_id=poll.id)
        db.add(option)

    db.commit()

    return {
        "id": poll.id,
        "title": poll.title,
        "link": f"/polls/{poll.id}",
        "expires_at": poll.expiration.isoformat()
    }

# Listar enquetes ativas (GET /polls/)
@router.get("/")
def list_active_polls(db: Session = Depends(get_db)):
    polls = db.query(Poll).filter(
        Poll.is_active == True,
        Poll.expiration > datetime.utcnow()
    ).all()

    response = []
    for poll in polls:
        response.append({
            "id": poll.id,
            "title": poll.title,
            "description": poll.description,
            "expiration": poll.expiration.isoformat(),
            "options": [{"id": opt.id, "text": opt.text} for opt in poll.options]
        })
    return response

# Resultados (GET /polls/{poll_id}/results)
@router.get("/{poll_id}/results")
def get_poll_results(poll_id: int, db: Session = Depends(get_db)):
    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Enquete não encontrada")

    results = []
    for option in poll.options:
        vote_count = db.query(Vote).filter(Vote.option_id == option.id).count()
        results.append({
            "option_id": option.id,
            "text": option.text,
            "votes": vote_count
        })

    return {
        "poll_id": poll.id,
        "title": poll.title,
        "description": poll.description,
        "results": results
    }

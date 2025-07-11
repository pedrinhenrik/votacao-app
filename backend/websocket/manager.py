from backend.database import get_db
from backend.models.models import User
from passlib.context import CryptContext
from sqlalchemy.orm import Session

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin(email: str, password: str, db: Session):
    hashed_password = pwd_context.hash(password)
    admin = User(email=email, hashed_password=hashed_password, is_admin=True)
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print(f"Admin {email} criado com sucesso!")

def list_users(db: Session):
    users = db.query(User).all()
    print("Lista de usuários:")
    for user in users:
        print(f"ID: {user.id} | Email: {user.email} | Admin: {getattr(user, 'is_admin', False)}")

def delete_user(email: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if user:
        db.delete(user)
        db.commit()
        print(f"Usuário {email} deletado com sucesso.")
    else:
        print(f"Usuário {email} não encontrado.")

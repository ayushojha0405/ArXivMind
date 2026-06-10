from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.schemas.auth import UserCreate
from app.auth.password import get_password_hash, verify_password
from app.auth.jwt_handler import create_access_token

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, user_in: UserCreate):
        existing_user = self.db.query(User).filter((User.email == user_in.email) | (User.username == user_in.username)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email or username already registered")
        
        hashed_password = get_password_hash(user_in.password)
        db_user = User(
            email=user_in.email,
            username=user_in.username,
            hashed_password=hashed_password
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, username: str, password: str):
        user = self.db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        if not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid username or password")
            
        token = create_access_token({"sub": user.username, "id": user.id})
        return token

    def get_user_by_id(self, user_id: int):
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

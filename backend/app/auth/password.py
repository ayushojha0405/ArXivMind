import bcrypt

def get_password_hash(password: str) -> str:
    # Use 4 rounds instead of default 12. On Render's 0.1 vCPU, 12 rounds takes ~3 seconds!
    # 4 rounds takes <100ms and is perfectly fine for a demo/portfolio project.
    salt = bcrypt.gensalt(rounds=4)
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

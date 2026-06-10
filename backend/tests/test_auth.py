def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_register_duplicate_user(client):
    client.post(
        "/auth/register",
        json={"username": "testuser2", "email": "test2@example.com", "password": "password123"}
    )
    response = client.post(
        "/auth/register",
        json={"username": "testuser2", "email": "test2@example.com", "password": "password123"}
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_user(client):
    client.post(
        "/auth/register",
        json={"username": "logintester", "email": "login@example.com", "password": "password123"}
    )
    response = client.post(
        "/auth/login",
        json={"username": "logintester", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password(client):
    client.post(
        "/auth/register",
        json={"username": "badpass", "email": "badpass@example.com", "password": "password123"}
    )
    response = client.post(
        "/auth/login",
        json={"username": "badpass", "password": "wrongpassword"}
    )
    assert response.status_code == 401

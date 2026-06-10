import pytest

@pytest.fixture
def auth_token(client):
    client.post(
        "/auth/register",
        json={"username": "colltester", "email": "coll@example.com", "password": "password123"}
    )
    res = client.post(
        "/auth/login",
        json={"username": "colltester", "password": "password123"}
    )
    return res.json()["access_token"]

def test_create_and_get_collection(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Create
    res = client.post("/collections/collections", json={"name": "My NLP Papers"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["name"] == "My NLP Papers"
    
    # Get
    res = client.get("/collections/collections", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    assert res.json()[0]["name"] == "My NLP Papers"

def test_save_and_get_paper(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    # Save
    res = client.post(
        "/collections/saved", 
        json={"paper_id": "2305.14314", "title": "Test Paper"}, 
        headers=headers
    )
    assert res.status_code == 200
    assert res.json()["paper_id"] == "2305.14314"
    
    # Get
    res = client.get("/collections/saved", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    assert res.json()[0]["paper_id"] == "2305.14314"

def test_delete_collection(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    
    res = client.post("/collections/collections", json={"name": "To Delete"}, headers=headers)
    col_id = res.json()["id"]
    
    del_res = client.delete(f"/collections/collections/{col_id}", headers=headers)
    assert del_res.status_code == 200
    
    # Verify deletion
    get_res = client.get("/collections/collections", headers=headers)
    assert not any(c["id"] == col_id for c in get_res.json())

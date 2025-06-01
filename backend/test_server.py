import pytest
from server import app, SessionLocal, Transcription
import datetime
import io

# --- Set Up ---
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        # Setup: clear and seed the database
        session = SessionLocal()
        session.query(Transcription).delete()
        session.add_all([
            Transcription(filename="audio1.mp3", text="hello world", timestamp=datetime.datetime.now(datetime.timezone.utc)),
            Transcription(filename="audio3.mp3", text="number three", timestamp=datetime.datetime.now(datetime.timezone.utc)),
            Transcription(filename="song.mp3", text="music", timestamp=datetime.datetime.now(datetime.timezone.utc)),
        ])
        session.commit()
        session.close()
        yield client
        # Teardown: clear the database
        session = SessionLocal()
        session.query(Transcription).delete()
        session.commit()
        session.close()

# --- Test for /health endpoint ---
def test_health_endpoint(client):
    resp = client.get("/health")
    data = resp.get_json()
    assert resp.status_code == 200
    assert data == {"status": "ok"}

# --- Tests for /transcribe endpoint ---
def test_transcribe_endpoint(client, monkeypatch):
    # Mock the whisper pipeline to avoid running actual transcription
    def fake_pipe(filepath):
        return {"text": "mocked transcription"}
    monkeypatch.setattr("server.pipe", fake_pipe)

    data = {
        'file': (io.BytesIO(b"fake audio data"), "testaudio.mp3")
    }
    resp = client.post("/transcribe", data=data, content_type='multipart/form-data')
    result = resp.get_json()
    assert resp.status_code == 200
    assert result["filename"] == "testaudio.mp3"
    assert result["text"] == "mocked transcription"

def test_transcribe_no_file(client):
    resp = client.post("/transcribe", data={}, content_type='multipart/form-data')
    data = resp.get_json()
    assert resp.status_code == 400
    assert "error" in data

# --- Test for /transcriptions endpoint ---
def test_transcriptions_endpoint(client):
    resp = client.get("/transcriptions")
    data = resp.get_json()
    assert resp.status_code == 200
    assert isinstance(data, list)
    # Should return all seeded transcriptions, sorted by timestamp desc
    assert len(data) == 3
    filenames = [d['filename'] for d in data]
    assert set(filenames) == {"audio1.mp3", "audio3.mp3", "song.mp3"}

# --- Tests for /search endpoint ---
def test_search_exact_match(client):
    resp = client.get("/search?filename=audio1")
    data = resp.get_json()
    assert resp.status_code == 200
    assert len(data) == 1
    assert data[0]['filename'] == "audio1.mp3"

def test_search_partial_match(client):
    resp = client.get("/search?filename=audio")
    data = resp.get_json()
    assert resp.status_code == 200
    assert len(data) == 2
    filenames = [d['filename'] for d in data]
    assert "audio1.mp3" in filenames
    assert "audio3.mp3" in filenames

def test_search_does_not_match_extension(client):
    resp = client.get("/search?filename=3")
    data = resp.get_json()
    assert resp.status_code == 200
    # Should only match 'audio3.mp3', not 'audio1.mp3' or 'song.mp3'
    assert len(data) == 1
    assert data[0]['filename'] == "audio3.mp3"

def test_search_no_results(client):
    resp = client.get("/search?filename=xyz")
    data = resp.get_json()
    assert resp.status_code == 200
    assert data == []

def test_search_missing_param(client):
    resp = client.get("/search")
    data = resp.get_json()
    assert resp.status_code == 400
    assert "error" in data
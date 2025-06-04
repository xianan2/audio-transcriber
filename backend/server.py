from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import os
import datetime
from database import SessionLocal, Transcription
from sqlalchemy import func

# Initialize Flask app and enable CORS (for frontend access)
app = Flask(__name__)
CORS(app)

# Load Whisper-tiny model using Hugging Face Transformers
pipe = pipeline("automatic-speech-recognition", model="openai/whisper-tiny")

# Folder to store uploaded audio files
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load FFmpeg to environment path
directory = os.path.dirname(os.path.abspath(__file__))
ffmpeg_bin = os.path.join(directory, "ffmpeg", "bin")
os.environ["PATH"] += os.pathsep + ffmpeg_bin

# --- Health Check Endpoint ---
@app.route("/health", methods=["GET"])
def health():
    """Simple health check endpoint to confirm server is running."""
    return jsonify({"status": "ok"})

# --- Transcription Endpoint ---
@app.route("/transcribe", methods=["POST"])
def transcribe():
    """
    Accepts an audio file via POST request,
    runs Whisper transcription, stores result in DB, and returns transcription.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    # Save the uploaded file
    file = request.files["file"]
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        # Run Whisper transcription
        result = pipe(filepath)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Store transcription in database
    session = SessionLocal()
    transcription = Transcription(
        filename=file.filename,
        text=result["text"],
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    session.add(transcription)
    session.commit()
    timestamp = transcription.timestamp.isoformat()
    session.close()

    return jsonify({"filename": file.filename, "text": result["text"], "timestamp": timestamp})

# --- Retrieve All Transcriptions ---
@app.route("/transcriptions", methods=["GET"])
def get_transcriptions():
    """
    Returns a list of all transcriptions in the database,
    sorted by most recent first.
    """
    session = SessionLocal()
    records = session.query(Transcription).order_by(Transcription.timestamp.desc()).all()
    session.close()

    return jsonify([
        {
            "id": t.id,
            "filename": t.filename,
            "text": t.text,
            "timestamp": t.timestamp.isoformat()
        } for t in records
    ])

# --- Search Transcriptions by Filename ---
@app.route("/search", methods=["GET"])
def search_transcriptions():
    """
    Searches the database for transcriptions with file names
    that partially match the given 'filename' query parameter,
    matching only up to the '.' character (excluding extension).
    """
    query = request.args.get("filename")
    if not query:
        return jsonify({"error": "Missing 'filename' query parameter"}), 400
    
    # Preprocess query: remove everything after the first dot
    query_base = query.split('.', 1)[0]

    # Query the database for matching filenames
    session = SessionLocal()
    results = session.query(Transcription).filter(
        func.substr(
            Transcription.filename,
            1,
            func.instr(Transcription.filename, '.') - 1
        ).ilike(f"%{query_base}%")
    ).order_by(Transcription.timestamp.desc()).all()
    session.close()

    return jsonify([
        {
            "id": t.id,
            "filename": t.filename,
            "text": t.text,
            "timestamp": t.timestamp.isoformat()
        } for t in results
    ])

if __name__ == "__main__":
    app.run(debug=True)
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# SQLite database URL (stored in local file)
DATABASE_URL = "sqlite:///transcriptions.db"

# Create SQLAlchemy engine and session factory
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

# Base class for model declarations
Base = declarative_base()

# Define the Transcription table model
class Transcription(Base):
    __tablename__ = "transcriptions"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)  # audio file name
    text = Column(Text)                    # transcription result
    timestamp = Column(DateTime, default=datetime.now(datetime.timezone.utc))

# Create the table in the database (if it doesn't exist yet)
Base.metadata.create_all(bind=engine)
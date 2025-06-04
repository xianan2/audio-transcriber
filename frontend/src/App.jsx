import React, { useState } from 'react';
import axios from 'axios';

import FileUpload from './components/FileUpload';
import TranscriptionList from './components/TranscriptionList';
import SearchBox from './components/SearchBox';

/**
 * Main application component for the Audio Transcriber.
 * Handles file uploads, searching, and displaying transcriptions.
 */
const App = () => {
  // State to store the list of transcriptions
  const [transcriptions, setTranscriptions] = useState([]);
  // State to control transcription list visibility
  const [showList, setShowList] = useState(false); 

  /**
   * Callback for when new transcriptions are uploaded.
   * Updates the transcriptions state and shows the list.
   */
  const handleUploadResults = (newTranscriptions) => {
    setTranscriptions(newTranscriptions);
    setShowList(true);
  };

  /**
   * Fetches all transcriptions from the backend and toggles the list visibility.
   */
  const toggleAllTranscriptions = async () => {
    if (!showList) {
      try {
        const res = await axios.get('http://localhost:5000/transcriptions');
        setTranscriptions(res.data);
      } catch (err) {
        console.error("Error fetching all transcriptions:", err);
      }
    }
    setShowList(!showList);
  };

  /**
   * Searches for transcriptions by filename using the backend API.
   * Updates the transcriptions state and shows the list.
   */
  const handleSearch = async (filename) => {
    try {
      const res = await axios.get(`http://localhost:5000/search?filename=${filename}`);
      setTranscriptions(res.data);
      setShowList(true);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Audio Transcription App</h1>

      <FileUpload onUploadResults={handleUploadResults} />

      <SearchBox onSearch={handleSearch} />

      <button onClick={toggleAllTranscriptions} style={{ margin: '1rem 0' }}>
        {showList ? 'Hide Transcriptions' : 'Show All Transcriptions'}
      </button>

      {showList && (
        transcriptions.length > 0 ? (
          <TranscriptionList transcriptions={transcriptions} />
        ) : (
          <div style={{ marginTop: '1rem', color: '#888' }}>No search result</div>
        )
      )}
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import axios from 'axios';

import FileUpload from './components/FileUpload';
import TranscriptionList from './components/TranscriptionList';
import SearchBox from './components/SearchBox';

/**
 * Main application component
 * - Handles loading and displaying transcriptions
 * - Manages search input and result state
 */
const App = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [showList, setShowList] = useState(false); // Controls visibility

  /**
  * Handle results returned directly from the FileUpload component.
  * Show only uploaded transcriptions.
  */
  const handleUploadResults = (newTranscriptions) => {
    setTranscriptions(newTranscriptions);
    setShowList(true);
  };

  /**
   * Fetch and show all transcriptions from the backend.
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
   * Search for transcriptions by filename.
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
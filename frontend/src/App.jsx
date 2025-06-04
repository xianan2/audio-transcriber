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
  // State to indicate loading
  const [loading, setLoading] = useState(false);

  /**
   * Callback for when new transcriptions are uploaded.
   * Updates the transcriptions state and shows the list.
   */
  const handleUploadResults = (newTranscriptions) => {
    setLoading(true);
    setTranscriptions(newTranscriptions);
    // Wait for state to update, then show the list
    setTimeout(() => {
      setShowList(true);
      setLoading(false);
    }, 300); // 300ms delay for effect
  };

  /**
   * Fetches all transcriptions from the backend and toggles the list visibility.
   */
  const toggleAllTranscriptions = async () => {
    if (!showList) {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/transcriptions');
        setTranscriptions(res.data);
      } catch (err) {
        console.error("Error fetching all transcriptions:", err);
      }
      setLoading(false);
    }
    setShowList(!showList);
  };

  /**
   * Searches for transcriptions by filename using the backend API.
   * Updates the transcriptions state and shows the list.
   */
  const handleSearch = async (filename) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/search?filename=${filename}`);
      setTranscriptions(res.data);
      setShowList(true);
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Audio Transcription App</h1>

      <FileUpload onUploadResults={handleUploadResults} />

      <SearchBox onSearch={handleSearch} />

      <button onClick={toggleAllTranscriptions} style={{ margin: '1rem 0' }}>
        {showList ? 'Hide Transcriptions' : 'Show All Transcriptions'}
      </button>

      {loading && <div style={{ marginTop: '1rem', color: '#888' }}>Loading...</div>}

      {!loading && showList && (
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
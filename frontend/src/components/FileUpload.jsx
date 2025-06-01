import React, { useState } from 'react';
import axios from 'axios';

/**
 * Component for uploading and transcribing one or more audio files.
 * Displays per-file upload progress.
 */
const FileUpload = ({ onUploadResults }) => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setProgress({}); // Reset progress
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return;

    setUploading(true);

    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);

        return axios.post('http://localhost:5000/transcribe', formData, {
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(prev => ({ ...prev, [file.name]: percent }));
          }
        });
      });

      const responses = await Promise.allSettled(uploadPromises);
      const newTranscriptions = responses
        .filter(res => res.status === 'fulfilled')
        .map(res => res.value.data);

      // Log any failed uploads
      responses
        .filter(res => res.status === 'rejected')
        .forEach(res => {
          console.error("Upload failed:", res.reason);
        });

      onUploadResults(newTranscriptions); // Pass only new and successful uploads
      setFiles([]);
      setProgress({});
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="file-upload" style={{ marginBottom: 4, display: 'block' }}>Upload File</label>
        <div>
          <input
            id="file-upload"
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            type="submit"
            disabled={uploading || !files.length}
          >
            {uploading ? 'Uploading...' : 'Upload & Transcribe'}
          </button>
        </div>
      </div>

      <ul>
        {files.map(file => (
          <li key={file.name}>
            {file.name}
            {progress[file.name] !== undefined && (
              <div style={{ width: '100%', background: '#ddd', marginTop: 4 }}>
                <div
                  style={{
                    width: `${progress[file.name]}%`,
                    background: '#4caf50',
                    height: '8px',
                    transition: 'width 0.2s'
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default FileUpload;
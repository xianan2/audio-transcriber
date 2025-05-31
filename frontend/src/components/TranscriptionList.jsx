import React from 'react';

/**
 * Displays a list of transcriptions, including filename, timestamp, and text.
 */
const TranscriptionList = ({ transcriptions }) => {
  return (
    <div>
      <h2>Transcriptions</h2>
      <ul>
        {transcriptions.map((t, idx) => (
          <li key={idx}>
            <strong>{t.filename}</strong><br />
            <em>
              {t.timestamp && !isNaN(new Date(t.timestamp))
                ? new Date(t.timestamp).toLocaleString()
                : 'Just now'}
            </em><br />
            {t.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TranscriptionList;
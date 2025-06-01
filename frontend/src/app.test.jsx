import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mock axios for all tests
jest.mock('axios');

describe('App integration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Test: Simulate file upload and display transcriptions ---
  it('simulates a successful file upload and displays transcriptions', async () => {
    const mockTranscriptions = [
      { id: 1, filename: 'audio1.mp3', text: 'hello world', timestamp: new Date().toISOString() }
    ];
    // Simulate backend response for upload
    axios.post.mockResolvedValueOnce({ data: mockTranscriptions[0] });

    render(<App />);
    // Simulate file selection
    const fileInput = screen.getByLabelText(/upload/i);
    const file = new File(['audio content'], 'audio1.mp3', { type: 'audio/mp3' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Simulate upload button click (adjust selector if needed)
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    // Wait for transcription to appear
    await waitFor(() => {
      expect(screen.queryAllByText(/audio1\.mp3/)).not.toHaveLength(0);
      expect(screen.getByText((content) => content.includes('hello world'))).toBeInTheDocument();
    });
  });

  // --- Test: Simulate search and display results ---
  it('simulates a search and displays results', async () => {
    const mockSearchResults = [
      { id: 2, filename: 'meeting.mp3', text: 'meeting notes', timestamp: new Date().toISOString() }
    ];
    axios.get.mockResolvedValueOnce({ data: mockSearchResults });

    render(<App />);
    // Simulate entering search text
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'meeting' } });

    // Simulate search button click
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    // Wait for search result to appear
    await waitFor(() => {
      expect(screen.getByText('meeting.mp3')).toBeInTheDocument();
      expect(screen.getByText('meeting notes')).toBeInTheDocument();
    });
  });

  // --- Test: Show "No search result" when search returns empty ---
  it('shows "No search result" when search returns empty', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'notfound' } });
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/no search result/i)).toBeInTheDocument();
    });
  });

  // --- Test: Toggle all transcriptions ---
  it('fetches and displays all transcriptions when "Show All Transcriptions" is clicked', async () => {
    const mockTranscriptions = [
      { id: 1, filename: 'audio1.mp3', text: 'hello world', timestamp: new Date().toISOString() },
      { id: 2, filename: 'meeting.mp3', text: 'meeting notes', timestamp: new Date().toISOString() }
    ];
    axios.get.mockResolvedValueOnce({ data: mockTranscriptions });

    render(<App />);
    const showAllBtn = screen.getByRole('button', { name: /show all transcriptions/i });
    fireEvent.click(showAllBtn);

    await waitFor(() => {
      expect(screen.getByText('audio1.mp3')).toBeInTheDocument();
      expect(screen.getByText('meeting.mp3')).toBeInTheDocument();
    });

    // Clicking again should hide the list
    fireEvent.click(showAllBtn);
    await waitFor(() => {
      expect(screen.queryByText('audio1.mp3')).not.toBeInTheDocument();
      expect(screen.queryByText('meeting.mp3')).not.toBeInTheDocument();
    });
  });
});
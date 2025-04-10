import React, { useState } from 'react';
import './App.css';
import MoodSelector from './components/MoodSelector';

function App() {
  const [selectedMood, setSelectedMood] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSongs = async (mood) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(mood)}&media=music&limit=10`
      );
      const data = await response.json();
      setPlaylist(data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching songs:', error);
      setLoading(false);
    }
  };

  const handleMoodChange = (mood) => {
    setSelectedMood(mood);
    fetchSongs(mood);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mood-Based Music Finder</h1>
        <MoodSelector onSelect={handleMoodChange} />
        <div className="playlist">
          <h2>{selectedMood ? `${selectedMood} Playlist` : 'Select a Mood'}</h2>
          {loading ? (
            <p>Loading songs...</p>
          ) : (
            <ul className="playlist-list">
              {playlist.map((track) => (
                <li key={track.trackId} className="track-item">
                  <p className="track-title">
                    🎵 <strong>{track.trackName}</strong> by {track.artistName}
                  </p>
                  {track.previewUrl && (
                    <audio controls src={track.previewUrl}>
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
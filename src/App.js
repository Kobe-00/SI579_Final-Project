/**
 * App.js - Main React component for Mood-Based Music Finder
 * Handles mood selection, music fetching from iTunes API, state management,
 * and rendering the user interface for both playlists and favorites.
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import MoodSelector from './components/MoodSelector';

function App() {
  /** 
   * @type {[string, Function]} 
   */
  const [selectedMood, setSelectedMood] = useState('');

  /** 
   * @type {[Array<Object>, Function]} 
   */
  const [playlist, setPlaylist] = useState([]);

  /** 
   * @type {[boolean, Function]} 
   */
  const [isLoading, setIsLoading] = useState(false);

  /** 
   * @type {[string|null, Function]} 
   */
  const [error, setError] = useState(null);

  /**
   * Retrieves saved favorites from localStorage on initial load.
   * @returns {Array<Object>} Array of favorite tracks
   */
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteSongs');
    return saved ? JSON.parse(saved) : [];
  });

  /** 
   * @type {[boolean, Function]} 
   */
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  /**
   * Keywords used to represent different moods for music search.
   */
  const moodKeywords = {
    Happy: 'feel good upbeat pop',
    Sad: 'melancholy piano ballad',
    Energetic: 'dance workout edm',
    Chill: 'lofi chillhop acoustic',
    Focus: 'instrumental study beats'
  };

  /**
   * Persist favorites to localStorage whenever the list updates.
   */
  useEffect(() => {
    localStorage.setItem('favoriteSongs', JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Fetches music data from iTunes API based on selected mood.
   * @param {string} mood - The selected mood keyword
   */
  const fetchSongs = async (mood) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchTerm = moodKeywords[mood] || mood;
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=12`
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPlaylist(data.results);
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Something went wrong while fetching songs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles a mood button click and triggers music fetch.
   * @param {string} mood - Selected mood value from MoodSelector
   */
  const handleMoodChange = (mood) => {
    setSelectedMood(mood);
    setShowFavoritesOnly(false);
    fetchSongs(mood);
  };

  /**
   * Toggles a track's presence in the favorites list.
   * @param {Object} track - The track object from iTunes API
   */
  const toggleFavorite = (track) => {
    const exists = favorites.some((fav) => fav.trackId === track.trackId);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.trackId !== track.trackId));
    } else {
      setFavorites([...favorites, track]);
    }
  };

  /**
   * Checks whether a track is already in the favorites.
   * @param {Object} track
   * @returns {boolean} True if track is favorite
   */
  const isFavorite = (track) => favorites.some((fav) => fav.trackId === track.trackId);

  /**
   * Shuffles the current playlist randomly.
   */
  const shuffleSongs = () => {
    const shuffled = [...playlist].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
  };

  const tracksToDisplay = showFavoritesOnly ? favorites : playlist;

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎧 Mood-Based Music Finder</h1>
        <MoodSelector onSelect={handleMoodChange} />

        <div className="top-buttons">
          <button
            className="toggle-favorites"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            {showFavoritesOnly ? '🎵 Back to Playlist' : '⭐ View Favorites'}
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {isLoading && <div className="spinner"></div>}

        <div className="playlist-header">
          <h2>
            {showFavoritesOnly
              ? '⭐ Your Favorite Songs'
              : selectedMood
              ? `${selectedMood} Playlist`
              : 'Select a Mood'}
          </h2>

          {!showFavoritesOnly && selectedMood && (
            <button className="shuffle-btn-inline" onClick={shuffleSongs}>
              🔀 Shuffle
            </button>
          )}
        </div>

        <div className="track-grid">
          {tracksToDisplay.map((track) => (
            <div
              key={track.trackId}
              className="track-card fade-in"
              onMouseEnter={(e) => {
                const audio = e.currentTarget.querySelector('audio');
                if (audio) {
                  audio.muted = true;
                  audio.play().catch(() => {});
                }
              }}
              onMouseLeave={(e) => {
                const audio = e.currentTarget.querySelector('audio');
                if (audio) {
                  audio.pause();
                  audio.currentTime = 0;
                }
              }}
            >
              <img
                src={track.artworkUrl100}
                alt={`Artwork for ${track.trackName || 'Track'}`}
                className="track-artwork"
              />
              <div className="track-details">
                <div className="track-title">🎵 {track.trackName || 'Untitled Track'}</div>
                <div className="track-artist">by {track.artistName}</div>
                {track.primaryGenreName && (
                  <div className="track-genre">{track.primaryGenreName}</div>
                )}
                {track.previewUrl && (
                  <audio
                    controls
                    src={track.previewUrl}
                    className="track-audio"
                  >
                    Your browser does not support the audio element.
                  </audio>
                )}
                <button className="favorite-btn" onClick={() => toggleFavorite(track)}>
                  {isFavorite(track) ? '💖 Remove Favorite' : '🤍 Add to Favorites'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
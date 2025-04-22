/**
 * App.js - Main React component for Mood-Based Music Finder
 * 
 * Renders the complete application interface and handles:
 * - Mood selection via MoodSelector
 * - Music search from the iTunes API
 * - Favorite song tracking and persistence
 * - State management and conditional UI rendering
 *
 * @component
 * @returns {JSX.Element}
 */

import React, { useState, useEffect } from 'react';
import './App.css';
import MoodSelector from './components/MoodSelector';

/**
 * @typedef {Object} Track
 * @property {string} trackName
 * @property {string} artistName
 * @property {string} artworkUrl100
 * @property {string} previewUrl
 * @property {string} primaryGenreName
 * @property {number} trackId
 */

function App() {
  /** 
   * Currently selected mood from the MoodSelector.
   * @type {[string, Function]} 
   */
  const [selectedMood, setSelectedMood] = useState('');

  /** 
   * Songs fetched from the iTunes API based on the selected mood.
   * @type {[Array<Track>, Function]} 
   */
  const [playlist, setPlaylist] = useState([]);

  /** 
   * Loading state for music fetching. Used to show loading spinner.
   * @type {[boolean, Function]} 
   */
  const [isLoading, setIsLoading] = useState(false);

  /** 
   * Error message to display when API request fails.
   * @type {[string|null, Function]} 
   */
  const [error, setError] = useState(null);

  /**
   * Array of user favorite songs, persisted in localStorage.
   * Initializes from saved localStorage value on first render.
   * @type {[Array<Track>, Function]}
   */
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteSongs');
    return saved ? JSON.parse(saved) : [];
  });

  /** 
   * If true, displays only favorite songs instead of current mood playlist.
   * @type {[boolean, Function]} 
   */
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  /**
   * Preset search phrases associated with each mood to improve iTunes query relevance.
   */
  const moodKeywords = {
    Happy: 'feel good upbeat pop',
    Sad: 'melancholy piano ballad',
    Energetic: 'dance workout edm',
    Chill: 'lofi chillhop acoustic',
    Focus: 'instrumental study beats'
  };

  /**
   * Sync favorites to localStorage every time the favorites list changes.
   */
  useEffect(() => {
    localStorage.setItem('favoriteSongs', JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Fetches music data from the iTunes API using a mood keyword.
   * Updates the playlist and handles loading and error UI states.
   * @param {string} mood - The selected mood triggering the search.
   * @returns {Promise<void>}
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
   * Called when a user selects a mood from MoodSelector.
   * Sets the selected mood, disables "favorites only" view,
   * and fetches the matching music playlist.
   * @param {string} mood - Selected mood value from MoodSelector
   * @returns {void}
   */
  const handleMoodChange = (mood) => {
    setSelectedMood(mood);
    setShowFavoritesOnly(false);
    fetchSongs(mood);
  };

  /**
   * Adds or removes a track from the user's favorites list.
   * Uses the unique track ID to determine existence.
   * @param {Track} track - The track object from iTunes API
   * @returns {void}
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
   * @param {Track} track
   * @returns {boolean} True if track is favorite
   */
  const isFavorite = (track) => favorites.some((fav) => fav.trackId === track.trackId);

  /**
   * Randomly shuffles the current playlist.
   * Called only when a mood playlist is shown (not in favorites view).
   * @returns {void}
   */
  const shuffleSongs = () => {
    const shuffled = [...playlist].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
  };

  /**
   * Track list to render: either all favorites or the current mood playlist.
   * @type {Array<Track>}
   */
  const tracksToDisplay = showFavoritesOnly ? favorites : playlist;

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎧 Mood-Based Music Finder</h1>

        {/* Mood selection interface */}
        <MoodSelector onSelect={handleMoodChange} />

        {/* Toggle between showing favorites and mood playlist */}
        <div className="top-buttons">
          <button
            className="toggle-favorites"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            {showFavoritesOnly ? '🎵 Back to Playlist' : '⭐ View Favorites'}
          </button>
        </div>

        {/* Display error or loading state */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {isLoading && <div className="spinner"></div>}

        {/* Playlist header section */}
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

        {/* Track cards rendering */}
        <div className="track-grid">
          {tracksToDisplay.map((track) => (
            <div
              key={track.trackId}
              className="track-card fade-in"
              onMouseEnter={(e) => {
                const audio = e.currentTarget.querySelector('audio');
                if (audio) {
                  // Play preview audio on hover (muted)
                  audio.muted = true;
                  audio.play().catch(() => {});
                }
              }}
              onMouseLeave={(e) => {
                const audio = e.currentTarget.querySelector('audio');
                if (audio) {
                  // Pause and reset audio when mouse leaves
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
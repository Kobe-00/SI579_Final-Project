/**
 * MoodSelector.js - Component for selecting a mood
 *
 * Displays a set of buttons representing different mood categories.
 * When a mood is selected, the parent component is notified via callback.
 *
 * @component
 * @param {Object} props - React props
 * @param {Function} props.onSelect - Callback triggered with the selected mood string
 * @returns {JSX.Element} The rendered mood selector interface
 */

import React from 'react';

/**
 * Predefined list of mood options.
 * Each mood has a user-facing label (emoji + text) and an internal value.
 *
 * @constant {Array<{label: string, value: string}>}
 */
const moods = [
  { label: '😊 Happy', value: 'Happy' },
  { label: '😢 Sad', value: 'Sad' },
  { label: '💃 Energetic', value: 'Energetic' },
  { label: '😌 Chill', value: 'Chill' },
  { label: '🎯 Focus', value: 'Focus' },
];

function MoodSelector({ onSelect }) {
  return (
    <div className="mood-selector">
      {moods.map((mood) => (
        <button 
          key={mood.value} 
          onClick={() => onSelect(mood.value)}
        >
          {mood.label}
        </button>
      ))}
    </div>
  );
}

export default MoodSelector;
/**
 * MoodSelector.js - Component for selecting a mood
 * Renders a group of buttons for the user to select a mood category.
 * Invokes callback with the selected mood value.
 */

import React from 'react';

/**
 * Array of mood options displayed to the user.
 * Each option has a label (with emoji) and a corresponding value string.
 */
const moods = [
  { label: '😊 Happy', value: 'Happy' },
  { label: '😢 Sad', value: 'Sad' },
  { label: '💃 Energetic', value: 'Energetic' },
  { label: '😌 Chill', value: 'Chill' },
  { label: '🎯 Focus', value: 'Focus' },
];

/**
 * MoodSelector Component
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onSelect - Callback function triggered when a mood is selected.
 * @returns {JSX.Element}
 */
function MoodSelector({ onSelect }) {
  return (
    <div className="mood-selector">
      {moods.map((mood) => (
        <button key={mood.value} onClick={() => onSelect(mood.value)}>
          {mood.label}
        </button>
      ))}
    </div>
  );
}

export default MoodSelector;
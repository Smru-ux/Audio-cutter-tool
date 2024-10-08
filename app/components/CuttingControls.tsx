"use client";

import React, { useState } from 'react';
import Waveform from './Waveform';

interface CuttingControlsProps {
  waveformData: number[];
  audioFile: string; // Pass the audio file as a prop
}

const CuttingControls: React.FC<CuttingControlsProps> = ({ waveformData, audioFile }) => {
  const [startCut, setStartCut] = useState<number | null>(null);
  const [endCut, setEndCut] = useState<number | null>(null);

  // Example function to handle start cut
  const handleStartCut = () => {
    // Logic for setting the start cut point
    const currentTime = 0; // Replace with actual logic to get the current time
    setStartCut(currentTime);
  };

  // Example function to handle end cut
  const handleEndCut = () => {
    // Logic for setting the end cut point
    const currentTime = 10; // Replace with actual logic to get the current time
    setEndCut(currentTime);
  };

  // Example function to handle cutting the audio
  const handleCutAudio = () => {
    if (startCut !== null && endCut !== null) {
      console.log(`Cutting audio from ${startCut} to ${endCut}`);
      // Implement your cutting logic here
    } else {
      console.error('Please set both start and end cut points.');
    }
  };

  return (
    <div>
      <h2>Audio Cutting Controls</h2>
      <div>
        <button onClick={handleStartCut}>Set Start Cut</button>
        <button onClick={handleEndCut}>Set End Cut</button>
        <button onClick={handleCutAudio}>Cut Audio</button>
      </div>
      <Waveform waveformData={waveformData} audioFile={audioFile} />
    </div>
  );
};

export default CuttingControls;


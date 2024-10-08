import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformProps {
  waveformData: number[];
  audioFile: string; // Ensure this is defined here
}

const Waveform: React.FC<WaveformProps> = ({ waveformData, audioFile }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#ff2200',
        backend: 'MediaElement', // Ensure compatibility
      });

      // Load the audio file
      wavesurferRef.current.load(audioFile);

      // Clean up on component unmount
      return () => {
        wavesurferRef.current?.destroy();
      };
    }
  }, [audioFile]); // Reinitialize if audioFile changes

  // Update the waveform data when the waveformData prop changes
  useEffect(() => {
    if (wavesurferRef.current) {
      // If loadDecodedBuffer is not available, you may use load
      wavesurferRef.current.load(audioFile); // Reload the audio file if needed
    }
  }, [waveformData]);

  return (
    <div>
      <div ref={waveformRef} />
    </div>
  );
};

export default Waveform;




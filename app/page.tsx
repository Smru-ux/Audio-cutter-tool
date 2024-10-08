"use client";

import React, { useState, useRef } from "react";
import { Button, Container, Slider, Text } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";

export default function AudioCutter() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAudioFile(file);
      const audioUrl = URL.createObjectURL(file);
      setAudioSrc(audioUrl);

      const audioContext = new AudioContext();
      const reader = new FileReader();

      reader.onload = async (event) => {
        if (event.target?.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          extractWaveform(audioBuffer);
          setEndTime(audioBuffer.duration);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const extractWaveform = (audioBuffer: AudioBuffer) => {
    const rawData = audioBuffer.getChannelData(0); // First audio channel
    const samples = 200; // Number of samples to visualize
    const blockSize = Math.floor(rawData.length / samples); // How many samples per block
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i;
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]);
      }
      filteredData.push(sum / blockSize);
    }
    setWaveformData(filteredData);
  };

  const handleCutAudio = async () => {
    if (!audioFile || !audioRef.current) return;

    const audioContext = new AudioContext();
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const sampleRate = audioBuffer.sampleRate;
    const startOffset = Math.floor(startTime * sampleRate);
    const endOffset = Math.floor(endTime * sampleRate);
    const length = endOffset - startOffset;

    // Adjust buffer size to the exact length of the audio slice
    let buffer = new ArrayBuffer(length * 4 * audioBuffer.numberOfChannels); // 4 bytes per sample per channel
    let view = new DataView(buffer);
    let channels = [];
    let i, sample, offset = 0;

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const cutData = channelData.slice(startOffset, endOffset);

      channels.push(cutData);
      for (i = 0; i < cutData.length; i++) {
        sample = Math.max(-1, Math.min(1, cutData[i])); // Clamp the value between -1 and 1

        // Safety check to avoid going out of bounds
        if (offset + 4 <= view.byteLength) {
          view.setFloat32(offset, sample, true); // Store as 32-bit float
          offset += 4; // Move by 4 bytes for next sample
        }
      }
    }

    const blob = new Blob([buffer], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cut-audio.wav";
    link.click();
  };

  return (
    <Container>
      <Text align="center" size="xl" mb="md">
        Audio Cutter
      </Text>

      <input type="file" accept="audio/*" onChange={handleAudioUpload} />

      {audioSrc && (
        <div>
          <audio ref={audioRef} controls src={audioSrc} />
          <div>
            <Text>Start Time: {startTime.toFixed(2)}s</Text>
            <Slider
              value={startTime}
              onChange={setStartTime}
              min={0}
              max={endTime}
              step={0.1}
            />
            <Text>End Time: {endTime.toFixed(2)}s</Text>
            <Slider
              value={endTime}
              onChange={setEndTime}
              min={startTime}
              max={audioRef.current?.duration || 100}
              step={0.1}
            />
          </div>
          <Button onClick={handleCutAudio} mt="md">
            Cut Audio
          </Button>

          <div>
            <Text>Waveform Visualization:</Text>
            <div style={{ display: "flex", height: "100px", backgroundColor: "#eee" }}>
              {waveformData.map((value, index) => (
                <div
                  key={index}
                  style={{
                    height: `${value * 100}%`,
                    width: "1px",
                    backgroundColor: "#000",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}







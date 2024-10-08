// app/components/AudioPlayer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Paper, Text, Slider, Group, Button } from "@mantine/core";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";

interface AudioPlayerProps {
  audioFile: File;
}

export default function AudioPlayer({ audioFile }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [audioFile]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSliderChange = (value: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value;
      setCurrentTime(value);
    }
  };

  return (
    <Paper shadow="xs" p="md" mb="md">
      <audio ref={audioRef} src={URL.createObjectURL(audioFile)} />

      <Group position="apart" mb="sm">
        <Text weight={500}>{audioFile.name}</Text>
        <Text>{formatTime(currentTime)} / {formatTime(duration)}</Text>
      </Group>

      <Group position="center" mb="sm">
        <Button onClick={togglePlay} leftIcon={isPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </Group>

      <Slider
        value={currentTime}
        onChange={handleSliderChange}
        min={0}
        max={duration}
        step={0.1}
        label={formatTime(currentTime)}
        mb="sm"
      />
    </Paper>
  );
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

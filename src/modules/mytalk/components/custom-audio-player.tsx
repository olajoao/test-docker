import { Pause, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type AudioPlayerProps = {
  audioUrl: string;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
    }

    const audio = audioRef.current;

    const updateProgress = () => setProgress(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Reset audio to start if it's already finished playing
      if (audio.ended) {
        audio.currentTime = 0;
      }

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => console.error("Error playing audio:", error));
      }
    }
  };

  return (
    <div className="flex items-center gap-2 pr-4 border rounded-lg shadow-md min-w-28">
      <button onClick={togglePlay} className="p-2">
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <span className="text-xs text-gray-600">{progress.toFixed(1)}s</span>
    </div>
  );
};

export default AudioPlayer;

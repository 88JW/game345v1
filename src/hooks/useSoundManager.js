import { useState, useEffect } from 'react';

export const useSoundManager = () => {
  const [isMuted, setIsMuted] = useState(() => {
    const savedMute = localStorage.getItem('isMuted');
    return savedMute ? JSON.parse(savedMute) : false;
  });

  useEffect(() => {
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  const playSound = (soundSrc) => {
    if (!isMuted) {
      const audio = new Audio(soundSrc);
      audio.play().catch(err => console.log("Błąd odtwarzania dźwięku:", err));
    }
  };

  const toggleMute = () => {
    setIsMuted(prevMuted => !prevMuted);
  };

  return {
    isMuted,
    playSound,
    toggleMute
  };
};

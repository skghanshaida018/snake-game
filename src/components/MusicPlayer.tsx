import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, TerminalSquare } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'DATA_STREAM_01', artist: 'SYS.AUDIO.GEN', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CORRUPTED_SECTOR', artist: 'SYS.AUDIO.GEN', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'VOID_RESONANCE', artist: 'SYS.AUDIO.GEN', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Autoplay prevented:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t-8 border-[#00ffff] p-4 z-50 font-digital tear-effect">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
      />
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Track Info */}
        <div className="flex items-center gap-4 w-full sm:w-1/3">
          <div className="w-16 h-16 bg-[#ff00ff] text-black flex items-center justify-center shrink-0 border-4 border-white animate-pulse">
            <TerminalSquare size={32} />
          </div>
          <div className="overflow-hidden flex flex-col">
            <span className="text-[#00ffff] text-lg uppercase bg-black px-1 border border-[#00ffff] inline-block w-max mb-1">AUDIO_STREAM_ACTIVE</span>
            <h3 className="text-white font-pixel text-xs truncate">{currentTrack.title}</h3>
            <p className="text-[#ff00ff] text-xl truncate">SRC: {currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button onClick={prevTrack} className="text-[#00ffff] hover:text-black hover:bg-[#00ffff] p-2 transition-colors border-2 border-transparent hover:border-white cursor-pointer">
            <SkipBack size={36} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-20 h-20 flex items-center justify-center bg-[#ff00ff] text-black border-4 border-white hover:bg-[#00ffff] transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
          </button>
          <button onClick={nextTrack} className="text-[#00ffff] hover:text-black hover:bg-[#00ffff] p-2 transition-colors border-2 border-transparent hover:border-white cursor-pointer">
            <SkipForward size={36} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-4 w-full sm:w-1/3 justify-end hidden sm:flex">
          <button onClick={() => setIsMuted(!isMuted)} className="text-[#ff00ff] hover:text-white transition-colors bg-black p-2 border-2 border-[#ff00ff] cursor-pointer">
            {isMuted || volume === 0 ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-40 h-4 bg-black border-2 border-[#00ffff] appearance-none cursor-pointer accent-[#ff00ff]"
          />
        </div>
      </div>
    </div>
  );
}

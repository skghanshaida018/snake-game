import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-digital flex flex-col relative overflow-hidden selection:bg-[#ff00ff] selection:text-[#00ffff]">
      {/* Noise & Scanlines */}
      <div className="absolute inset-0 bg-static z-50" />
      <div className="absolute inset-0 scanlines z-40" />

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 max-w-6xl mx-auto w-full border-b-8 border-[#ff00ff] tear-effect bg-black">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="p-2 bg-[#00ffff] text-black border-4 border-white">
            <Terminal size={40} />
          </div>
          <h1 className="text-3xl md:text-5xl font-pixel font-black tracking-widest text-white glitch-wrapper" data-text="SYS.SNAKE_">
            SYS.SNAKE_
          </h1>
        </div>

        <div className="flex gap-8 font-digital">
          <div className="flex flex-col items-end">
            <span className="text-2xl text-[#ff00ff] uppercase tracking-widest">DATA_YIELD</span>
            <span className="text-5xl font-bold text-[#00ffff] bg-[#ff00ff] px-3 border-2 border-[#00ffff]">{score}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl text-[#00ffff] uppercase tracking-widest">MAX_CAPACITY</span>
            <span className="text-5xl font-bold text-[#ff00ff] bg-[#00ffff] px-3 text-black border-2 border-[#ff00ff]">{highScore}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4 pb-40 tear-effect">
        <SnakeGame onScoreChange={handleScoreChange} />
      </main>

      {/* Footer / Music Player */}
      <MusicPlayer />
    </div>
  );
}

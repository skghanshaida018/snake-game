import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 60;

export function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(INITIAL_DIRECTION);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
    setHasStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prev => {
        directionRef.current = nextDirectionRef.current;
        const head = prev[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }

        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(intervalId);
  }, [gameOver, isPaused, hasStarted, food, score, onScoreChange, generateFood]);

  return (
    <div className="relative flex flex-col items-center font-digital">
      <div
        className="grid bg-black border-8 border-[#00ffff] relative shadow-[10px_10px_0px_#ff00ff]"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(90vw, 500px)',
          height: 'min(90vw, 500px)'
        }}
      >
        {(() => {
          const cellMap = new Map();
          snake.forEach((segment, idx) => cellMap.set(`${segment.x},${segment.y}`, idx));
          
          return Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const snakeIndex = cellMap.get(`${x},${y}`);
            const isSnake = snakeIndex !== undefined;
            const isHead = snakeIndex === 0;
            const isFood = food.x === x && food.y === y;

            return (
              <div key={i} className="w-full h-full border border-[#ff00ff]/30 flex items-center justify-center">
                {(isSnake || isFood) && (
                  <div 
                    className={`w-full h-full ${isFood ? 'bg-[#ff00ff] animate-pulse' : ''} ${isHead ? 'bg-white' : isSnake && !isHead ? 'bg-[#00ffff]' : ''}`} 
                    style={{
                      opacity: isSnake && !isHead ? Math.max(0.3, 1 - (snakeIndex / snake.length)) : 1,
                      transform: isSnake && !isHead ? `scale(${Math.max(0.5, 1 - (snakeIndex / snake.length) * 0.5)})` : 'scale(1)'
                    }}
                  />
                )}
              </div>
            );
          });
        })()}

        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-8 border-[#ff00ff] m-4">
            {gameOver ? (
              <>
                <h2 className="text-2xl md:text-4xl font-pixel text-white mb-4 text-center glitch-wrapper" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
                <p className="text-3xl text-[#00ffff] mb-8 bg-[#ff00ff] text-black px-4 py-2 font-bold">YIELD: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-4 bg-[#00ffff] text-black font-pixel text-sm md:text-base hover:bg-[#ff00ff] hover:text-white transition-colors uppercase border-4 border-white cursor-pointer"
                >
                  &gt; REBOOT_SYSTEM
                </button>
              </>
            ) : !hasStarted ? (
              <button
                onClick={resetGame}
                className="px-8 py-6 bg-[#ff00ff] text-white font-pixel text-xl hover:bg-[#00ffff] hover:text-black transition-colors uppercase border-4 border-white animate-pulse cursor-pointer"
              >
                &gt; INITIATE_SEQUENCE
              </button>
            ) : isPaused ? (
              <>
                <h2 className="text-3xl md:text-5xl font-pixel text-white mb-8 glitch-wrapper" data-text="SYSTEM_HALT">SYSTEM_HALT</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-4 bg-[#ff00ff] text-white font-pixel text-sm md:text-base hover:bg-[#00ffff] hover:text-black transition-colors uppercase border-4 border-white cursor-pointer"
                >
                  &gt; RESUME_PROCESS
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
      <div className="mt-8 text-[#ff00ff] font-pixel text-xs md:text-sm flex flex-col items-center gap-3 bg-black p-4 border-4 border-[#00ffff] shadow-[6px_6px_0px_#ff00ff]">
        <span>INPUT_VECTOR: [W,A,S,D] | [ARROWS]</span>
        <span>INTERRUPT: [SPACE]</span>
      </div>
    </div>
  );
}

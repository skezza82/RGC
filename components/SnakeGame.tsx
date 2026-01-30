
import React, { useEffect, useRef, useState } from 'react';

interface SnakeGameProps {
  onGameOver: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const GRID_SIZE = 20;
  const CELL_SIZE = 20;

  useEffect(() => {
    if (!hasStarted || isGameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let dx = 1;
    let dy = 0;
    let currentScore = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
        case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
        case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const generateFood = () => {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    };

    const gameLoop = setInterval(() => {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        clearInterval(gameLoop);
        setIsGameOver(true);
        onGameOver(currentScore);
        return;
      }

      // Self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameLoop);
        setIsGameOver(true);
        onGameOver(currentScore);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        currentScore += 10;
        setScore(currentScore);
        generateFood();
      } else {
        snake.pop();
      }

      // Render
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#1e293b';
      for(let i=0; i<GRID_SIZE; i++){
        ctx.beginPath();
        ctx.moveTo(i*CELL_SIZE, 0); ctx.lineTo(i*CELL_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i*CELL_SIZE); ctx.lineTo(canvas.width, i*CELL_SIZE);
        ctx.stroke();
      }

      // Food
      ctx.fillStyle = '#f43f5e';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f43f5e';
      ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

      // Snake
      ctx.fillStyle = '#22d3ee';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#22d3ee';
      snake.forEach((segment, i) => {
        ctx.globalAlpha = 1 - (i / snake.length) * 0.5;
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });
      ctx.globalAlpha = 1;

    }, 100);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasStarted, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-3xl border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
      
      <div className="mb-6 flex justify-between w-full items-end">
        <div>
          <h2 className="font-orbitron text-2xl font-black text-white tracking-tighter">NEON SNAKE</h2>
          <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">Cyber-Grid Protocol Active</p>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Link Score</span>
          <div className="text-3xl font-mono text-cyan-400 font-black">{score.toString().padStart(5, '0')}</div>
        </div>
      </div>

      <div className="relative border-4 border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <canvas 
          ref={canvasRef} 
          width={GRID_SIZE * CELL_SIZE} 
          height={GRID_SIZE * CELL_SIZE}
          className="bg-slate-950"
        />

        {!hasStarted && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
               <span className="text-slate-950 font-bold text-xs uppercase">READY</span>
            </div>
            <h3 className="text-white font-orbitron font-bold mb-2">INITIALIZE UPLINK?</h3>
            <p className="text-slate-400 text-xs mb-6 max-w-[200px]">Use Arrow Keys to navigate the data stream. Avoid grid walls.</p>
            <button 
              onClick={() => setHasStarted(true)}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black font-orbitron text-sm tracking-widest rounded-lg transition-all active:scale-95"
            >
              START SESSION
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
            <h3 className="text-rose-500 font-orbitron font-black text-4xl mb-2 tracking-tighter italic">CONNECTION LOST</h3>
            <p className="text-slate-100 font-mono text-xl mb-8">FINAL SCORE: {score}</p>
            <button 
              onClick={() => {
                setIsGameOver(false);
                setScore(0);
              }}
              className="px-8 py-3 bg-white text-slate-950 font-black font-orbitron text-sm tracking-widest rounded-lg transition-all active:scale-95"
            >
              RECONNECT
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span> Arrow Keys to Move</div>
        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Wall = Death</div>
      </div>
    </div>
  );
};

export default SnakeGame;

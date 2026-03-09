import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';

interface LevelThreeProps {
  onComplete: () => void;
}

interface Point {
  x: number;
  y: number;
}

const MAZE_SIZE = 25; // Must be odd
const TOTAL_ITEMS = 15;
const VISIBILITY_RADIUS = 4; // Fog of war radius

export const LevelThree: React.FC<LevelThreeProps> = ({ onComplete }) => {
  const [grid, setGrid] = useState<number[][]>([]); // 1 = Wall, 0 = Path
  const [playerPos, setPlayerPos] = useState<Point>({ x: 1, y: 1 });
  const [items, setItems] = useState<Point[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize Maze
  useEffect(() => {
    if (!gameStarted) return;

    // 1. Generate Grid (Recursive Backtracker)
    const newGrid = Array(MAZE_SIZE).fill(0).map(() => Array(MAZE_SIZE).fill(1));
    const stack: Point[] = [];
    const start: Point = { x: 1, y: 1 };
    
    newGrid[start.y][start.x] = 0;
    stack.push(start);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors: Point[] = [];
      const dirs = [[0, -2], [2, 0], [0, 2], [-2, 0]];

      for (const [dx, dy] of dirs) {
        const nx = current.x + dx;
        const ny = current.y + dy;
        if (nx > 0 && nx < MAZE_SIZE - 1 && ny > 0 && ny < MAZE_SIZE - 1 && newGrid[ny][nx] === 1) {
          neighbors.push({ x: nx, y: ny });
        }
      }

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        // Remove wall between
        newGrid[current.y + (next.y - current.y) / 2][current.x + (next.x - current.x) / 2] = 0;
        newGrid[next.y][next.x] = 0;
        stack.push(next);
      } else {
        stack.pop();
      }
    }

    // 2. Place Items
    const newItems: Point[] = [];
    let attempts = 0;
    while (newItems.length < TOTAL_ITEMS && attempts < 1000) {
      const x = Math.floor(Math.random() * (MAZE_SIZE - 2)) + 1;
      const y = Math.floor(Math.random() * (MAZE_SIZE - 2)) + 1;
      if (newGrid[y][x] === 0 && !(x === 1 && y === 1) && !newItems.some(i => i.x === x && i.y === y)) {
        newItems.push({ x, y });
      }
      attempts++;
    }

    setGrid(newGrid);
    setItems(newItems);
    setPlayerPos({ x: 1, y: 1 });
    setScore(0);
    setGameWon(false);

  }, [gameStarted]);

  // Handle Movement
  const movePlayer = (dx: number, dy: number) => {
    if (gameWon) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE && grid[newY][newX] === 0) {
      setPlayerPos({ x: newX, y: newY });
      
      // Check collision
      const itemIndex = items.findIndex(i => i.x === newX && i.y === newY);
      if (itemIndex !== -1) {
        const newItems = [...items];
        newItems.splice(itemIndex, 1);
        setItems(newItems);
        setScore(prev => prev + 1);
        if (newItems.length === 0) {
          handleWin();
        }
      }
    }
  };

  const handleWin = () => {
    setGameWon(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      switch(e.key) {
        case 'ArrowUp': case 'w': case 'W': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': case 'S': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': movePlayer(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, gameStarted, grid, items, gameWon]);

  // Helper for Fog of War
  const isVisible = (x: number, y: number) => {
    if (gameWon) return true;
    const dist = Math.sqrt(Math.pow(x - playerPos.x, 2) + Math.pow(y - playerPos.y, 2));
    return dist <= VISIBILITY_RADIUS;
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center w-full h-full p-2 pt-4 md:p-4 overflow-y-auto">
       
       {/* HUD */}
       <div className="w-full max-w-lg mb-2 md:mb-4 flex justify-between items-center font-['Courier_Prime'] shrink-0">
         <div className="flex items-center gap-2">
            <h2 className="text-base md:text-xl text-red-500 font-bold uppercase tracking-widest">Power Grid</h2>
         </div>
         <div className="flex items-center gap-2 text-base md:text-xl">
           <Zap className={`w-4 h-4 md:w-5 md:h-5 ${score === TOTAL_ITEMS ? 'text-green-400' : 'text-yellow-400'}`} />
           <span className={`${score === TOTAL_ITEMS ? 'text-green-400' : 'text-white'}`}>
             {score} / {TOTAL_ITEMS}
           </span>
         </div>
       </div>

       {/* Game Container */}
       <div className="relative bg-gray-900 border-2 md:border-4 border-gray-700 rounded-lg p-0.5 md:p-1 shadow-2xl overflow-hidden shrink-0">
         
         {!gameStarted ? (
           <div className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center p-6 text-center">
             <Lightbulb className="w-12 h-12 md:w-16 md:h-16 text-yellow-500 mb-4 animate-pulse" />
             <h3 className="text-xl md:text-2xl font-['Courier_Prime'] text-white mb-2 font-bold">DARKNESS FALLS</h3>
             <p className="text-gray-400 font-['Courier_Prime'] mb-6 text-xs md:text-sm max-w-xs leading-relaxed">
               Navigate the blackout.<br/>Find {TOTAL_ITEMS} power cells.<br/>Beware the dark.
             </p>
             <button 
               onClick={() => setGameStarted(true)}
               className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-['Courier_Prime'] font-bold rounded tracking-widest transition-colors shadow-lg active:scale-95 touch-manipulation"
             >
               ENTER MAZE
             </button>
           </div>
         ) : null}

         {gameWon && (
           <div className="absolute inset-0 z-30 bg-green-900/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
             <Zap className="w-16 h-16 md:w-20 md:h-20 text-yellow-400 mb-4 animate-bounce" />
             <h3 className="text-2xl md:text-3xl font-['Courier_Prime'] text-white mb-2 font-bold">RESTORED</h3>
             <p className="text-green-200 font-['Courier_Prime'] animate-pulse">
               System Online...
             </p>
           </div>
         )}

         {/* Grid */}
         {gameStarted && grid.length > 0 && (
            <div 
              className="grid gap-[1px] bg-gray-800"
              style={{ 
                gridTemplateColumns: `repeat(${MAZE_SIZE}, minmax(0, 1fr))`,
                width: 'min(94vw, 500px)',
                height: 'min(94vw, 500px)'
              }}
            >
              {grid.map((row, y) => (
                row.map((cell, x) => {
                  const visible = isVisible(x, y);
                  const isPlayer = playerPos.x === x && playerPos.y === y;
                  const hasItem = items.some(i => i.x === x && i.y === y);
                  
                  return (
                    <div 
                      key={`${x}-${y}`} 
                      className={`
                        relative w-full h-full flex items-center justify-center
                        ${cell === 1 ? 'bg-gray-800' : 'bg-black'}
                        ${!visible ? 'opacity-0' : 'opacity-100'}
                        transition-opacity duration-300
                      `}
                    >
                      {/* Wall Visuals */}
                      {cell === 1 && visible && (
                        <div className="w-full h-full bg-slate-800 border-[0.5px] border-slate-700" />
                      )}

                      {/* Item */}
                      {hasItem && visible && !isPlayer && (
                        <Zap className="w-[85%] h-[85%] text-cyan-400 animate-pulse drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                      )}

                      {/* Player */}
                      {isPlayer && (
                        <motion.div 
                          layoutId="player"
                          className="w-[85%] h-[85%] bg-red-500 rounded-full shadow-[0_0_10px_rgba(220,38,38,1)] z-10"
                        />
                      )}
                    </div>
                  );
                })
              ))}
            </div>
         )}
       </div>

       {/* Mobile Controls */}
       {gameStarted && !gameWon && (
         <div className="grid grid-cols-3 gap-3 mt-4 md:mt-6 shrink-0 pb-4">
            <div />
            <button 
              className="w-16 h-16 bg-gray-800/80 rounded-xl flex items-center justify-center active:bg-red-900 border border-gray-600 touch-none active:scale-90 transition-transform shadow-lg"
              onTouchStart={(e) => { e.preventDefault(); movePlayer(0, -1); }}
              onClick={() => movePlayer(0, -1)}
            >
              <ArrowUp className="w-8 h-8 text-white" />
            </button>
            <div />
            
            <button 
              className="w-16 h-16 bg-gray-800/80 rounded-xl flex items-center justify-center active:bg-red-900 border border-gray-600 touch-none active:scale-90 transition-transform shadow-lg"
              onTouchStart={(e) => { e.preventDefault(); movePlayer(-1, 0); }}
              onClick={() => movePlayer(-1, 0)}
            >
              <ArrowLeft className="w-8 h-8 text-white" />
            </button>
            <button 
              className="w-16 h-16 bg-gray-800/80 rounded-xl flex items-center justify-center active:bg-red-900 border border-gray-600 touch-none active:scale-90 transition-transform shadow-lg"
              onTouchStart={(e) => { e.preventDefault(); movePlayer(0, 1); }}
              onClick={() => movePlayer(0, 1)}
            >
              <ArrowDown className="w-8 h-8 text-white" />
            </button>
            <button 
              className="w-16 h-16 bg-gray-800/80 rounded-xl flex items-center justify-center active:bg-red-900 border border-gray-600 touch-none active:scale-90 transition-transform shadow-lg"
              onTouchStart={(e) => { e.preventDefault(); movePlayer(1, 0); }}
              onClick={() => movePlayer(1, 0)}
            >
              <ArrowRight className="w-8 h-8 text-white" />
            </button>
         </div>
       )}
    </div>
  );
};

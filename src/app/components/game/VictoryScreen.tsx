import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home } from 'lucide-react';

interface VictoryScreenProps {
  onRestart: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ onRestart }) => {
  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-['Creepster'] text-red-500 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] mb-4">
          HAWKINS SAVED
        </h1>
        <p className="text-xl md:text-2xl text-green-400 font-['Courier_Prime']">
          The Gate has been closed.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-4"
      >
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-gray-900 border-2 border-green-500 text-green-500 font-['Courier_Prime'] text-xl font-bold uppercase hover:bg-green-500 hover:text-black transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Play Again
        </button>
      </motion.div>
    </div>
  );
};

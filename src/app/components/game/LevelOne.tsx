import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';

interface LevelOneProps {
  onComplete: () => void;
}

const STAGES = [
  { 
    word: "HELP", 
    hint: "What is Will trying to say?", 
    scramble: false 
  },
  { 
    word: "DANGER", 
    hint: "SIGNAL CORRUPTED... It's coming closer...", 
    scramble: true 
  },
  { 
    word: "ELEVEN", 
    hint: "SIGNAL CRITICAL... Who can save us?", 
    scramble: true 
  }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const LETTER_STYLES: Record<string, string> = {
  A: 'text-yellow-500', B: 'text-blue-500', C: 'text-red-500', D: 'text-green-500',
  E: 'text-purple-500', F: 'text-pink-500', G: 'text-orange-500', H: 'text-cyan-500',
  I: 'text-yellow-400', J: 'text-blue-400', K: 'text-red-400', L: 'text-green-400',
  M: 'text-purple-400', N: 'text-pink-400', O: 'text-orange-400', P: 'text-cyan-400',
  Q: 'text-yellow-600', R: 'text-blue-600', S: 'text-red-600', T: 'text-green-600',
  U: 'text-purple-600', V: 'text-pink-600', W: 'text-orange-600', X: 'text-cyan-600',
  Y: 'text-yellow-300', Z: 'text-blue-300'
};

export const LevelOne: React.FC<LevelOneProps> = ({ onComplete }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentStage = STAGES[stageIndex];

  // Generate sequence (scrambled if needed)
  const sequence = useMemo(() => {
    const letters = currentStage.word.split('');
    if (currentStage.scramble) {
      // Fisher-Yates Shuffle
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
    }
    return letters;
  }, [stageIndex, currentStage.word, currentStage.scramble]);

  // Sequence player
  useEffect(() => {
    if (success) {
        setActiveLetter(null);
        return;
    }

    let currentIndex = 0;
    
    const interval = setInterval(() => {
      // Light off (Dim)
      setActiveLetter(null);

      setTimeout(() => {
        // Light on (Bright)
        if (currentIndex < sequence.length) {
            setActiveLetter(sequence[currentIndex]);
            currentIndex++;
        } else {
            // End of sequence, pause then restart
            currentIndex = 0;
        }
      }, 400); // Light off duration
      
    }, 1200); // Cycle duration

    return () => clearInterval(interval);
  }, [stageIndex, success, sequence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.toUpperCase().trim() === currentStage.word) {
      setSuccess(true);
      setTimeout(() => {
        if (stageIndex < STAGES.length - 1) {
            setStageIndex(prev => prev + 1);
            setInputValue('');
            setSuccess(false);
        } else {
            onComplete();
        }
      }, 1500);
    } else {
      setError(true);
      setInputValue('');
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-2 md:p-4">
      <div className="bg-black/60 backdrop-blur-md p-3 md:p-6 rounded-lg border border-white/10 w-full mb-4 md:mb-8 shadow-2xl relative overflow-hidden">
        
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-3xl font-['Creepster'] text-red-500 tracking-wider flex items-center gap-2 md:gap-3">
                Message {stageIndex + 1}/{STAGES.length}
                {currentStage.scramble && <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-yellow-500 animate-pulse" />}
            </h2>
            <div className="flex gap-1 md:gap-2">
                {STAGES.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${i <= stageIndex ? 'bg-red-500' : 'bg-gray-700'}`}
                    />
                ))}
            </div>
        </div>

        <AnimatePresence mode="wait">
            <motion.div 
                key={stageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center mb-4 md:mb-6"
            >
                <p className={`font-['Courier_Prime'] text-xs md:text-base ${currentStage.scramble ? 'text-red-400 font-bold' : 'text-gray-300'}`}>
                    {currentStage.hint}
                </p>
                {currentStage.scramble && (
                    <p className="text-[10px] md:text-xs text-yellow-500 font-['Courier_Prime'] mt-1 animate-pulse">
                        ⚠ WARNING: SIGNAL SEQUENCE UNSTABLE
                    </p>
                )}
            </motion.div>
        </AnimatePresence>
        
        {/* The Alphabet Wall - Optimized Grid */}
        <div className="relative grid grid-cols-6 md:grid-cols-8 gap-2 md:gap-6 mb-6 p-2 md:p-8 bg-black/40 rounded-xl shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] border-2 md:border-4 border-gray-900"
             style={{
                 backgroundImage: "url('https://images.unsplash.com/photo-1575156853840-48a904316e78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBsaWdodHMlMjB3YWxsJTIwbWVzc3l8ZW58MXx8fHwxNzY3ODAxOTk4fDA&ixlib=rb-4.1.0&q=80&w=1080')",
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundBlendMode: 'multiply'
             }}
        >
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-black/40 rounded-xl" />
          
          {ALPHABET.map((letter) => {
            const isActive = activeLetter === letter;
            const colorClass = LETTER_STYLES[letter];
            
            return (
              <div key={letter} className="relative z-10 flex flex-col items-center">
                
                {/* Light Bulb */}
                <div className={`
                  w-3 h-3 md:w-6 md:h-6 rounded-full mb-0.5 md:mb-1 transition-all duration-100 ease-in-out
                  ${colorClass}
                  bg-current
                  ${isActive 
                    ? 'scale-125 shadow-[0_0_20px_currentColor] md:shadow-[0_0_40px_currentColor] brightness-150 opacity-100 z-20' 
                    : 'scale-100 shadow-[0_0_5px_currentColor] md:shadow-[0_0_15px_currentColor] opacity-60' 
                  }
                `}>
                   {isActive && <div className="absolute inset-0 bg-white opacity-90 rounded-full animate-ping" />}
                   <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-white rounded-full opacity-70" />
                </div>
                
                {/* Painted Letter */}
                <span 
                    className="font-black text-xl md:text-4xl text-white tracking-tighter drop-shadow-md leading-none"
                    style={{ 
                        fontFamily: 'brush script mt, cursive',
                        WebkitTextStroke: '1px black',
                        textShadow: '1px 1px 0px black'
                    }}
                >
                  {letter}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input - Optimized for Mobile */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center max-w-md mx-auto relative z-20">
          <div className="relative w-full">
            <motion.input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentStage.scramble ? "UNSCRAMBLE..." : "DECODE..."}
                disabled={success}
                autoComplete="off"
                animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`
                w-full px-4 py-3 bg-black/80 border-2 text-center font-['Courier_Prime'] text-lg md:text-xl uppercase tracking-widest outline-none transition-all rounded
                ${error ? 'border-red-600 text-red-600' : success ? 'border-green-500 text-green-500' : 'border-gray-600 text-white focus:border-red-500'}
                `}
                autoFocus={false} /* Prevent auto-keyboard on mobile load */
            />
            {success && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 animate-bounce" />
                </div>
            )}
          </div>
          <button
            type="submit"
            disabled={success}
            className="w-full md:w-auto px-6 py-3 bg-gray-800 hover:bg-red-900 disabled:bg-green-900 border-2 border-gray-600 hover:border-red-600 text-white font-['Courier_Prime'] font-bold uppercase transition-colors flex items-center justify-center gap-2 rounded shadow-lg active:scale-95 touch-manipulation"
          >
            {success ? 'SENT' : 'SUBMIT'} <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

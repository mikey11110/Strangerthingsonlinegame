import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, FileText, ShieldAlert } from 'lucide-react';

interface LevelTwoProps {
  onComplete: () => void;
}

const STAGES = [
  { 
    code: "6626", 
    hint: "The key is in the constant. Planck knows the way.", 
    title: "SECURITY LAYER 1" 
  },
  { 
    code: "1983", 
    hint: "The year the world turned upside down.", 
    title: "SECURITY LAYER 2" 
  },
  { 
    code: "0011", 
    hint: "She is the weapon. Her number.", 
    title: "FINAL OVERRIDE" 
  }
];

export const LevelTwo: React.FC<LevelTwoProps> = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'LOCKED' | 'SUCCESS' | 'ERROR'>('LOCKED');
  const [showClue, setShowClue] = useState(false);

  // Reset state when stage changes
  useEffect(() => {
    setCode('');
    setStatus('LOCKED');
    setShowClue(false);
  }, [currentStage]);

  const handleKeyPress = (num: string) => {
    if (code.length < 4 && status !== 'SUCCESS') {
      const newCode = code + num;
      setCode(newCode);
      if (newCode.length === 4) {
        checkCode(newCode);
      }
    }
  };

  const checkCode = (inputCode: string) => {
    if (inputCode === STAGES[currentStage].code) {
      setStatus('SUCCESS');
      
      setTimeout(() => {
        if (currentStage < STAGES.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setStatus('ERROR');
      setTimeout(() => {
        setCode('');
        setStatus('LOCKED');
      }, 800);
    }
  };

  const handleClear = () => {
    if (status !== 'SUCCESS') {
      setCode('');
      setStatus('LOCKED');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 h-full">
      <div className="bg-gray-900 p-8 rounded-xl border-4 border-gray-700 shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] opacity-20" />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 relative z-30">
          <h2 className="text-xl font-['Courier_Prime'] text-green-500 tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" /> 
            {STAGES[currentStage].title}
          </h2>
          <span className="text-xs font-['Courier_Prime'] text-gray-500 border border-gray-700 px-2 py-1 rounded">
             {currentStage + 1}/{STAGES.length}
          </span>
        </div>

        {/* Clue Button */}
        <div className="relative z-30 mb-4 flex justify-end">
            <button 
                onClick={() => setShowClue(!showClue)}
                className="text-yellow-500 hover:text-yellow-400 font-['Courier_Prime'] text-xs flex items-center gap-1 transition-colors uppercase tracking-wider"
            >
                <FileText className="w-3 h-3" /> {showClue ? "HIDE CLUE" : "DECRYPT CLUE"}
            </button>
        </div>

        {/* Clue Panel */}
        <AnimatePresence>
            {showClue && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 bg-yellow-100/90 p-4 rotate-1 text-black font-['Courier_Prime'] shadow-lg border-l-4 border-red-500 overflow-hidden"
            >
                <p className="font-bold underline mb-1 text-xs">INTERCEPTED DATA:</p>
                <p className="text-sm font-bold">"{STAGES[currentStage].hint}"</p>
            </motion.div>
            )}
        </AnimatePresence>

        {/* Screen */}
        <div className={`
            border-4 rounded-lg p-6 mb-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] transition-colors duration-300
            ${status === 'ERROR' ? 'bg-red-950/50 border-red-800' : 'bg-black border-gray-600'}
            ${status === 'SUCCESS' ? 'bg-green-950/50 border-green-800' : ''}
        `}>
          <div className="flex justify-center gap-4 mb-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`
                w-10 h-14 border-b-4 flex items-center justify-center transition-colors
                ${status === 'ERROR' ? 'border-red-500' : status === 'SUCCESS' ? 'border-green-500' : 'border-green-500/50'}
              `}>
                <span className={`
                    text-4xl font-['Courier_Prime'] font-bold
                    ${status === 'ERROR' ? 'text-red-500' : 'text-green-400'}
                `}>
                  {code[i] ? '*' : ''}
                </span>
              </div>
            ))}
          </div>
          <p className={`
            text-center mt-4 font-['Courier_Prime'] text-xs uppercase animate-pulse
            ${status === 'ERROR' ? 'text-red-500' : 'text-green-600'}
          `}>
            {status === 'SUCCESS' ? "ACCESS GRANTED - DECRYPTING..." : status === 'ERROR' ? "ACCESS DENIED" : "AWAITING INPUT"}
          </p>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto relative z-30">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              disabled={status === 'SUCCESS'}
              className="h-14 bg-gray-800 border-2 border-gray-600 rounded shadow-[0_4px_0_rgb(31,41,55)] active:shadow-none active:translate-y-1 text-white font-['Courier_Prime'] text-xl font-bold hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={status === 'SUCCESS'}
            className="h-14 bg-red-900/50 border-2 border-red-800 rounded shadow-[0_4px_0_rgb(69,10,10)] active:shadow-none active:translate-y-1 text-red-200 font-['Courier_Prime'] text-base font-bold hover:bg-red-900 transition-all flex items-center justify-center disabled:opacity-50"
          >
            CLR
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            disabled={status === 'SUCCESS'}
            className="h-14 bg-gray-800 border-2 border-gray-600 rounded shadow-[0_4px_0_rgb(31,41,55)] active:shadow-none active:translate-y-1 text-white font-['Courier_Prime'] text-xl font-bold hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            0
          </button>
          <div className="h-14 flex items-center justify-center">
            {status === 'SUCCESS' ? (
                <Unlock className="text-green-500 w-6 h-6 animate-bounce" />
            ) : (
                <Lock className={`w-6 h-6 ${status === 'ERROR' ? 'text-red-500 animate-pulse' : 'text-red-800'}`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

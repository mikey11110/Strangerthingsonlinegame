import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import titleImage from 'figma:asset/bb1d4f71abc447f3292f0a8f82e8e46ff65fb26a.png';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-end min-h-screen text-center overflow-hidden font-sans">
      
      {/* Background Image - Fixed Full Screen */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{ 
            backgroundImage: `url(${titleImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Global Vignette/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 z-0 pointer-events-none" />

      {/* Bottom Footer Area - Full Width Overlay */}
      <div className="fixed bottom-0 left-0 right-0 w-full z-20">
        
        {/* Gradient Overlay extending full width */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent h-[150%] -top-[50%]" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center pb-16 pt-12 px-4">
            
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="mb-8 text-red-500 font-['Courier_Prime'] text-sm md:text-base font-bold tracking-[0.2em] drop-shadow-lg"
            >
                DON'T LET THE LIGHTS GO OUT
            </motion.p>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            >
                <button
                    onClick={onStart}
                    className="
                        group relative
                        px-12 py-4
                        bg-red-700 hover:bg-red-600
                        text-white
                        font-['Courier_Prime'] text-xl font-bold uppercase tracking-widest
                        rounded-md
                        shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)]
                        transition-all duration-300
                        flex items-center gap-3
                        cursor-pointer
                        border border-red-500
                    "
                >
                    <span>ENTER</span>
                    <Play className="w-5 h-5 fill-current" />
                </button>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

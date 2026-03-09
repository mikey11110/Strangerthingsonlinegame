import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StartScreen } from './components/game/StartScreen';
import { LevelOne } from './components/game/LevelOne';
import { LevelTwo } from './components/game/LevelTwo';
import { LevelThree } from './components/game/LevelThree';
import { VictoryScreen } from './components/game/VictoryScreen';
import { Volume2, VolumeX } from 'lucide-react';
import '../styles/fonts.css';

// Type definition for game states
type GameState = 'START' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'VICTORY';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Background images for different states
  const getBackground = () => {
    switch (gameState) {
      case 'START':
        return "url('https://images.unsplash.com/photo-1631900268998-5b90da7f0895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhbmdlciUyMHRoaW5ncyUyMHJlZCUyMGRhcmslMjBmb2d8ZW58MXx8fHwxNzY3ODAxOTk1fDA&ixlib=rb-4.1.0&q=80&w=1080')";
      case 'LEVEL_1':
        return "url('https://images.unsplash.com/photo-1575156853840-48a904316e78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjBsaWdodHMlMjB3YWxsJTIwbWVzc3l8ZW58MXx8fHwxNzY3ODAxOTk4fDA&ixlib=rb-4.1.0&q=80&w=1080')";
      case 'LEVEL_2':
        return "url('https://images.unsplash.com/photo-1611857769856-ea8ffb7d53ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGNvbXB1dGVyJTIwc2NyZWVuJTIwY29kZSUyMGdyZWVufGVufDF8fHx8MTc2NzgwMjAwMnww&ixlib=rb-4.1.0&q=80&w=1080')";
      case 'LEVEL_3':
        return "url('https://images.unsplash.com/photo-1692367919967-8fa3f326c83d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodG5pbmclMjBzdG9ybSUyMGRhcmslMjByZWQlMjBvbWlub3VzfGVufDF8fHx8MTc2NzgwMjAwNnww&ixlib=rb-4.1.0&q=80&w=1080')";
      case 'VICTORY':
        return "black";
      default:
        return "black";
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case 'START':
        return <StartScreen onStart={() => setGameState('LEVEL_1')} />;
      case 'LEVEL_1':
        return <LevelOne onComplete={() => setGameState('LEVEL_2')} />;
      case 'LEVEL_2':
        return <LevelTwo onComplete={() => setGameState('LEVEL_3')} />;
      case 'LEVEL_3':
        return <LevelThree onComplete={() => setGameState('VICTORY')} />;
      case 'VICTORY':
        return <VictoryScreen onRestart={() => setGameState('START')} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans text-white selection:bg-red-900 selection:text-white">
      {/* Background Layer with Transition */}
      <AnimatePresence>
        <motion.div 
          key={gameState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0 bg-cover bg-center blur-[2px]"
          style={{ backgroundImage: getBackground() }}
        />
      </AnimatePresence>
      
      {/* Vignette & Scanlines Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Header / HUD */}
        <header className="p-4 flex justify-between items-center opacity-70">
          <div className="text-xs font-['Courier_Prime'] text-red-500 tracking-widest">
            HAWKINS LAB OS v1.9.83
          </div>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-red-500 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </header>

        {/* Game Stage */}
        <main className="flex-1 flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={gameState}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex items-center justify-center"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center">
          <div className="text-[10px] font-['Courier_Prime'] text-gray-600">
            WARNING: CLASSIFIED MATERIAL. DO NOT DISTRIBUTE.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterId, Emotion } from '../types';


interface AvatarProps {
  character: CharacterId;
  emotion?: Emotion;
  side?: 'left' | 'right' | 'center';
  isTalking?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ character, emotion = 'neutral', side = 'center', isTalking = false }) => {
  const getCharacterConfig = () => {
    switch (character) {
      case 'ali':
        return {
          image: '/ali.png',
          label: 'Ali Khan',
          role: 'Senior Officer'
        };
      case 'sara':
        return {
          image: '/sara.png',
          label: 'Sara Ahmed',
          role: 'Asst. Manager'
        };
      case 'manager':
        return {
          image: '/manager.png',
          label: 'Mr. Ahmed',
          role: 'Branch Manager'
        };
      default:
        return { image: '', label: '', role: '' };
    }
  };

  const config = getCharacterConfig();

  const getSideClass = () => {
    switch (side) {
      case 'left': return 'items-start';
      case 'right': return 'items-end';
      default: return 'items-center';
    }
  };

  return (
    <motion.div
      initial={{ x: side === 'left' ? -100 : side === 'right' ? 100 : 0, y: 50, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      exit={{ x: side === 'left' ? -100 : side === 'right' ? 100 : 0, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      className={`absolute bottom-0 flex flex-col justify-end ${side === 'left' ? 'left-4 w-1/3' : side === 'right' ? 'right-4 w-1/3' : 'left-1/2 -translate-x-1/2 w-1/3'
        } max-w-2xl pointer-events-none h-full z-10`}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          scale: emotion === 'frustrated' ? [1, 1.02, 1] : [1, 1.01, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: emotion === 'frustrated' ? 1.5 : 4,
          ease: "easeInOut"
        }}
        className={`flex items-end justify-center w-full h-[90%]`}
      >
        <motion.img
          src={config.image}
          alt={config.label}
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 100%, black 40%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 90% 90% at 50% 100%, black 40%, transparent 100%)'
          }}
          className={`object-contain object-bottom w-full h-full max-h-[85vh] drop-shadow-[0_0_40px_rgba(0,0,0,0.6)] transition-all duration-500 will-change-transform filter ${!isTalking ? 'brightness-50 saturate-50 translate-y-4 scale-95' : 'brightness-110 saturate-110 z-20'
            }`}
          animate={emotion === 'frustrated' ? { x: [-3, 3, -3] } : {}}
          transition={{ repeat: Infinity, duration: 0.1 }}
        />
      </motion.div>
    </motion.div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale';
  duration?: number;
  delay?: number;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  type = 'fade',
  duration = 0.3,
  delay = 0,
}) => {
  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 20, opacity: 0 },
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={animations[type].initial}
        animate={animations[type].animate}
        exit={animations[type].exit}
        transition={{
          duration,
          delay,
          ease: 'easeInOut',
        }}
        className="w-full h-full"
      >
        <div className="w-full h-full transition-all duration-300">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
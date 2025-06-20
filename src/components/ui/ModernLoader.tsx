import React from 'react';
import { motion } from 'framer-motion';

interface ModernLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave';
  color?: 'blue' | 'purple' | 'green' | 'red' | 'gray';
  text?: string;
}

const ModernLoader: React.FC<ModernLoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'blue',
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    green: 'text-green-500',
    red: 'text-red-500',
    gray: 'text-gray-500',
  };

  const SpinnerLoader = () => (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full ${colorClasses[color]}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );

  const DotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${colorClasses[color]} bg-current`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );

  const PulseLoader = () => (
    <motion.div
      className={`${sizeClasses[size]} rounded-full ${colorClasses[color]} bg-current`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );

  const WaveLoader = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`w-1 bg-current ${colorClasses[color]}`}
          animate={{
            height: ['8px', '24px', '8px'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'wave':
        return <WaveLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderLoader()}
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-sm font-medium ${colorClasses[color]}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// 全屏加载器
export const FullScreenLoader: React.FC<{
  text?: string;
  variant?: ModernLoaderProps['variant'];
}> = ({ text = '加载中...', variant = 'spinner' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <ModernLoader size="lg" variant={variant} text={text} />
      </motion.div>
    </motion.div>
  );
};

// 内联加载器
export const InlineLoader: React.FC<{
  text?: string;
  size?: ModernLoaderProps['size'];
}> = ({ text, size = 'sm' }) => {
  return (
    <div className="flex items-center space-x-2">
      <ModernLoader size={size} variant="spinner" />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  );
};

export default ModernLoader;

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface TailwindSaveStatusProps {
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  className?: string;
}

const TailwindSaveStatus: React.FC<TailwindSaveStatusProps> = ({
  saveState,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (saveState) {
      case 'saving':
        return {
          icon: ArrowPathIcon,
          text: '保存中...',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          animate: true,
        };
      case 'saved':
        return {
          icon: CheckCircleIcon,
          text: '已保存',
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          animate: false,
        };
      case 'error':
        return {
          icon: ExclamationCircleIcon,
          text: '保存失败',
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          animate: false,
        };
      default:
        return {
          icon: ClockIcon,
          text: '等待保存',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700',
          animate: false,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex items-center space-x-2 px-3 py-1.5 rounded-full border
        ${config.bgColor} ${config.borderColor} ${className}
        transition-all duration-300
      `}
    >
      <motion.div
        animate={config.animate ? { rotate: 360 } : {}}
        transition={config.animate ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
      </motion.div>
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    </motion.div>
  );
};

export default TailwindSaveStatus;

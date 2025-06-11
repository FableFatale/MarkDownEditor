import React from 'react';
import { motion } from 'framer-motion';

interface ModernProgressBarProps {
  progress: number; // 0-100
  variant?: 'linear' | 'circular' | 'gradient' | 'animated';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple' | 'green' | 'red' | 'gradient';
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

const ModernProgressBar: React.FC<ModernProgressBarProps> = ({
  progress,
  variant = 'linear',
  size = 'md',
  color = 'blue',
  showPercentage = true,
  label,
  className = '',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    gradient: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
  };

  const LinearProgress = () => (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );

  const CircularProgress = () => {
    const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 40;
    const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    return (
      <div className={`relative ${className}`}>
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* 背景圆环 */}
          <circle
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* 进度圆环 */}
          <motion.circle
            stroke="currentColor"
            className={color === 'gradient' ? 'text-blue-500' : `text-${color}-500`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </svg>
        {/* 中心文字 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      </div>
    );
  };

  const GradientProgress = () => (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative`}>
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* 光泽效果 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </div>
    </div>
  );

  const AnimatedProgress = () => (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <motion.span
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
              key={clampedProgress}
              initial={{ scale: 1.2, color: '#3b82f6' }}
              animate={{ scale: 1, color: 'currentColor' }}
              transition={{ duration: 0.3 }}
            >
              {Math.round(clampedProgress)}%
            </motion.span>
          )}
        </div>
      )}
      <div className={`w-full ${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative`}>
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* 动画条纹 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>
      </div>
    </div>
  );

  const renderProgress = () => {
    switch (variant) {
      case 'circular':
        return <CircularProgress />;
      case 'gradient':
        return <GradientProgress />;
      case 'animated':
        return <AnimatedProgress />;
      default:
        return <LinearProgress />;
    }
  };

  return renderProgress();
};

// 多步骤进度条
export const StepProgress: React.FC<{
  steps: string[];
  currentStep: number;
  className?: string;
}> = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {index < currentStep ? '✓' : index + 1}
              </motion.div>
              <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center">
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-gray-200 dark:bg-gray-700 relative">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: index < currentStep ? '100%' : '0%' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ModernProgressBar;

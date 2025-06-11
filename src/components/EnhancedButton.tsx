import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  tooltip?: string;
  glowEffect?: boolean;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  loading = false,
  tooltip,
  glowEffect = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const baseClasses = `
    relative inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden group
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 text-white
      hover:from-blue-700 hover:to-purple-700
      focus:ring-blue-500 shadow-lg hover:shadow-xl
      ${glowEffect ? 'shadow-blue-500/25 hover:shadow-blue-500/40' : ''}
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900
      dark:from-gray-700 dark:to-gray-600 dark:text-white
      hover:from-gray-200 hover:to-gray-300
      dark:hover:from-gray-600 dark:hover:to-gray-500
      focus:ring-gray-500 shadow-md hover:shadow-lg
    `,
    ghost: `
      bg-transparent text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-800
      focus:ring-gray-500
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-pink-600 text-white
      hover:from-red-700 hover:to-pink-700
      focus:ring-red-500 shadow-lg hover:shadow-xl
      ${glowEffect ? 'shadow-red-500/25 hover:shadow-red-500/40' : ''}
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={tooltip}
    >
      {/* 背景光效 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* 涟漪效果 */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-lg"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* 内容 */}
      <div className="relative flex items-center space-x-2">
        {loading ? (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          icon && <span className="flex-shrink-0">{icon}</span>
        )}
        <span>{children}</span>
      </div>

      {/* 边框光效 */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-transparent"
          style={{
            background: `linear-gradient(45deg, transparent, ${
              variant === 'primary' ? 'rgba(59, 130, 246, 0.5)' :
              variant === 'danger' ? 'rgba(239, 68, 68, 0.5)' :
              'rgba(156, 163, 175, 0.5)'
            }, transparent) border-box`,
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default EnhancedButton;

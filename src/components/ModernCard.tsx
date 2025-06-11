import React from 'react';
import { motion } from 'framer-motion';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  glass?: boolean;
  onClick?: () => void;
  delay?: number;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  hover = true,
  glow = false,
  gradient = false,
  glass = false,
  onClick,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseClasses = `
    relative rounded-xl transition-all duration-300 ease-out
    ${onClick ? 'cursor-pointer' : ''}
  `;

  const backgroundClasses = glass
    ? `
        backdrop-blur-xl bg-white/10 dark:bg-gray-900/10
        border border-white/20 dark:border-gray-700/20
        shadow-xl
      `
    : gradient
    ? `
        bg-gradient-to-br from-white via-gray-50 to-gray-100
        dark:from-gray-800 dark:via-gray-900 dark:to-gray-800
        border border-gray-200/50 dark:border-gray-700/50
        shadow-lg
      `
    : `
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        shadow-md
      `;

  const hoverClasses = hover
    ? `
        hover:shadow-2xl hover:-translate-y-1
        ${glow ? 'hover:shadow-blue-500/25 dark:hover:shadow-blue-400/25' : ''}
      `
    : '';

  return (
    <motion.div
      className={`${baseClasses} ${backgroundClasses} ${hoverClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        {/* 渐变光效 */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.6 }}
        />
        
        {/* 网格纹理 */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* 边框光效 */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `
              linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent),
              linear-gradient(-45deg, transparent, rgba(147, 51, 234, 0.1), transparent)
            `,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* 内容 */}
      <div className="relative z-10">
        {children}
      </div>

      {/* 悬浮时的装饰线条 */}
      {hover && (
        <motion.div
          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default ModernCard;

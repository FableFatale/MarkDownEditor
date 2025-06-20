import React from 'react';
import { motion } from 'framer-motion';

// 浮动粒子背景
export const FloatingParticles: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-blue-300/20 dark:from-blue-400/10 dark:to-blue-300/10"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 渐变背景
export const GradientBackground: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* 主渐变背景 */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        }`}
      />
      
      {/* 动态光晕效果 - 蓝色系 */}
      <motion.div
        className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl ${
          isDark
            ? 'bg-gradient-to-r from-blue-600/10 to-blue-400/10'
            : 'bg-gradient-to-r from-blue-200/30 to-blue-100/30'
        }`}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={`absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl ${
          isDark
            ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10'
            : 'bg-gradient-to-r from-blue-100/30 to-cyan-100/30'
        }`}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// 鼠标跟随光标效果 - 只保留动效，不显示圆圈
export const MouseFollower: React.FC = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // 检测是否悬浮在可交互元素上
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'BUTTON' ||
                           target.tagName === 'A' ||
                           target.tagName === 'INPUT' ||
                           target.tagName === 'TEXTAREA' ||
                           !!target.closest('button') ||
                           !!target.closest('a') ||
                           target.style.cursor === 'pointer';

      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  // 只返回动效逻辑，不渲染可见元素
  return (
    <motion.div
      className="fixed pointer-events-none z-50 opacity-0"
      style={{
        left: mousePosition.x - 6,
        top: mousePosition.y - 6,
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
    >
      {/* 移除可见的圆圈，只保留动效逻辑 */}
    </motion.div>
  );
};

// 浮动装饰元素
export const FloatingDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 几何形状装饰 */}
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-40 right-20 w-6 h-6 border-2 border-purple-400/30 rotate-45"
        animate={{
          y: [0, 30, 0],
          rotate: [45, 225, 45],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-32 left-1/4 w-3 h-3 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-25"
        animate={{
          x: [0, 40, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/3 right-1/3 w-5 h-5 border-2 border-blue-400/20 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

// 网格背景
export const GridBackground: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div
        className={`absolute inset-0 opacity-[0.02] ${
          isDark ? 'bg-white' : 'bg-gray-900'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(currentColor 1px, transparent 1px),
            linear-gradient(90deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

// 光束效果
export const LightBeams: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className={`absolute -top-40 -left-40 w-80 h-80 ${
          isDark
            ? 'bg-gradient-conic from-blue-500/5 via-purple-500/5 to-blue-500/5'
            : 'bg-gradient-conic from-blue-200/10 via-purple-200/10 to-blue-200/10'
        } rounded-full blur-3xl`}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className={`absolute -bottom-40 -right-40 w-96 h-96 ${
          isDark
            ? 'bg-gradient-conic from-purple-500/5 via-pink-500/5 to-purple-500/5'
            : 'bg-gradient-conic from-purple-200/10 via-pink-200/10 to-purple-200/10'
        } rounded-full blur-3xl`}
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

// 组合背景效果
export const ModernBackground: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <>
      <GradientBackground isDark={isDark} />
      <GridBackground isDark={isDark} />
      <LightBeams isDark={isDark} />
      <FloatingParticles />
      <FloatingDecorations />
    </>
  );
};

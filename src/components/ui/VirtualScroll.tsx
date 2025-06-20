import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface VirtualScrollProps {
  itemCount: number;
  itemHeight: number;
  renderItem: (index: number) => React.ReactNode;
  overscan?: number;
  height: number | string;
  width?: number | string;
  onScroll?: (scrollTop: number) => void;
}

export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  itemCount,
  itemHeight,
  renderItem,
  overscan = 3,
  height,
  width = '100%',
  onScroll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = itemCount * itemHeight;
  const viewportHeight = typeof height === 'number' ? height : 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const newScrollTop = container.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan
  );

  const items = [];
  for (let i = startIndex; i <= endIndex; i++) {
    items.push(
      <Box
        key={i}
        style={{
          position: 'absolute',
          top: i * itemHeight,
          width: '100%',
          height: itemHeight,
        }}
      >
        {renderItem(i)}
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        height,
        width,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          height: totalHeight,
          width: '100%',
          position: 'relative',
        }}
      >
        {items}
      </Box>
    </Box>
  );
};
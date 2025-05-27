import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { VirtualScroll } from './VirtualScroll';
import { ChunkManager } from '../services/chunkManager';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { basicLight, basicDark } from '@uiw/codemirror-theme-basic';

interface LargeFileEditorProps {
  content: string;
  onChange: (value: string) => void;
  theme: 'light' | 'dark';
  height?: number | string;
  onLoadingChange?: (isLoading: boolean) => void;
}

export const LargeFileEditor: React.FC<LargeFileEditorProps> = ({
  content,
  onChange,
  theme,
  height = '100%',
  onLoadingChange,
}) => {
  const [chunkManager] = useState(() => new ChunkManager(content));
  const [visibleContent, setVisibleContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const lastSaveTimeRef = useRef<number>(Date.now());
  const saveIntervalRef = useRef<number>();

  // 初始化加载内容
  useEffect(() => {
    // 初始化时设置加载状态
    setIsLoading(true);
    onLoadingChange?.(true);

    // 模拟初始加载延迟
    setTimeout(() => {
      // 初始化可见内容
      setVisibleContent(content.slice(0, 10000)); // 初始只加载前10000个字符
      setIsLoading(false);
      onLoadingChange?.(false);
    }, 500);
  }, [onLoadingChange]); // 移除content依赖，避免每次content变化都重新初始化

  // 监听外部content变化，同步更新visibleContent
  useEffect(() => {
    setVisibleContent(content);
  }, [content]);

  // 自动保存功能
  useEffect(() => {
    const autoSave = async () => {
      const now = Date.now();
      if (chunkManager.getDirtyChunksCount() > 0 && now - lastSaveTimeRef.current >= 2000) {
        setIsLoading(true);
        onLoadingChange?.(true);
        try {
          await chunkManager.saveAllDirtyChunks();
          lastSaveTimeRef.current = now;
        } finally {
          setIsLoading(false);
          onLoadingChange?.(false);
        }
      }
    };

    saveIntervalRef.current = window.setInterval(autoSave, 2000);
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [chunkManager, onLoadingChange]);

  // 处理编辑器内容变化
  const handleChange = useCallback(
    (value: string) => {
      // 将变更应用到块管理器
      const operation = {
        offset: 0, // 需要根据实际光标位置计算
        text: value,
        length: visibleContent.length,
      };
      setIsLoading(true);
      onLoadingChange?.(true);
      try {
        chunkManager.applyOperation(operation);
        setVisibleContent(value);
        onChange(value);
      } finally {
        setIsLoading(false);
        onLoadingChange?.(false);
      }
    },
    [chunkManager, onChange, visibleContent, onLoadingChange]
  );

  // 处理滚动事件，加载可见区域的文本块
  const handleScroll = useCallback(
    async (scrollTop: number) => {
      setIsLoading(true);
      onLoadingChange?.(true);
      try {
        const chunk = chunkManager.getChunkAtOffset(scrollTop);
        if (chunk && !chunk.isLoaded) {
          await chunkManager.loadChunk(chunk.id);
          setVisibleContent(chunkManager.getContent());
        }
      } finally {
        setIsLoading(false);
        onLoadingChange?.(false);
      }
    },
    [chunkManager, onLoadingChange]
  );

  return (
    <Box sx={{ position: 'relative', height }}>
      {isLoading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
          }}
        />
      )}
      <CodeMirror
        value={visibleContent}
        height="100%"
        extensions={[markdown()]}
        theme={theme === 'dark' ? basicDark : basicLight}
        onChange={handleChange}
        style={{ fontSize: '16px' }}
      />
    </Box>
  );
};
import { useEffect, useRef, useCallback, useState } from 'react';
import localforage from 'localforage';
import debounce from 'lodash.debounce';

export interface SaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: string | null;
}

export interface AutoSaveOptions {
  key: string;
  debounceMs?: number;
  maxVersions?: number;
  onSave?: (content: string) => void;
  onRestore?: (content: string) => void;
  onError?: (error: string) => void;
}

export interface SavedVersion {
  id: string;
  content: string;
  timestamp: Date;
  title?: string;
}

export const useAutoSave = (
  content: string,
  options: AutoSaveOptions
) => {
  const {
    key,
    debounceMs = 2000,
    maxVersions = 10,
    onSave,
    onRestore,
    onError
  } = options;

  const [saveState, setSaveState] = useState<SaveState>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null
  });

  const [versions, setVersions] = useState<SavedVersion[]>([]);
  const lastContentRef = useRef<string>('');
  const isInitializedRef = useRef(false);

  // 配置localforage
  const storage = localforage.createInstance({
    name: 'MarkdownEditor',
    storeName: 'documents'
  });

  const versionsStorage = localforage.createInstance({
    name: 'MarkdownEditor',
    storeName: 'versions'
  });

  // 保存内容到本地存储
  const saveContent = useCallback(async (contentToSave: string) => {
    try {
      setSaveState(prev => ({ ...prev, isSaving: true, error: null }));
      
      await storage.setItem(key, {
        content: contentToSave,
        timestamp: new Date(),
        version: Date.now()
      });

      setSaveState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false
      }));

      onSave?.(contentToSave);
      lastContentRef.current = contentToSave;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Save failed';
      setSaveState(prev => ({
        ...prev,
        isSaving: false,
        error: errorMessage
      }));
      onError?.(errorMessage);
    }
  }, [key, storage, onSave, onError]);

  // 防抖保存函数
  const debouncedSave = useCallback(
    debounce((contentToSave: string) => {
      if (contentToSave !== lastContentRef.current) {
        saveContent(contentToSave);
      }
    }, debounceMs),
    [saveContent, debounceMs]
  );

  // 手动保存
  const manualSave = useCallback(async () => {
    debouncedSave.cancel(); // 取消防抖保存
    await saveContent(content);
  }, [content, saveContent, debouncedSave]);

  // 恢复内容
  const restoreContent = useCallback(async () => {
    try {
      const saved = await storage.getItem(key) as any;
      if (saved && saved.content) {
        onRestore?.(saved.content);
        lastContentRef.current = saved.content;
        setSaveState(prev => ({
          ...prev,
          lastSaved: new Date(saved.timestamp),
          hasUnsavedChanges: false
        }));
        return saved.content;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Restore failed';
      setSaveState(prev => ({ ...prev, error: errorMessage }));
      onError?.(errorMessage);
    }
    return null;
  }, [key, storage, onRestore, onError]);

  // 保存版本历史
  const saveVersion = useCallback(async (title?: string) => {
    try {
      const versionId = `${key}_${Date.now()}`;
      const newVersion: SavedVersion = {
        id: versionId,
        content,
        timestamp: new Date(),
        title: title || `版本 ${new Date().toLocaleString()}`
      };

      // 获取现有版本
      const existingVersions = await versionsStorage.getItem(`${key}_versions`) as SavedVersion[] || [];
      
      // 添加新版本并限制数量
      const updatedVersions = [newVersion, ...existingVersions].slice(0, maxVersions);
      
      await versionsStorage.setItem(`${key}_versions`, updatedVersions);
      setVersions(updatedVersions);

      return versionId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Version save failed';
      onError?.(errorMessage);
      throw error;
    }
  }, [key, content, maxVersions, versionsStorage, onError]);

  // 恢复版本
  const restoreVersion = useCallback(async (versionId: string) => {
    try {
      const version = versions.find(v => v.id === versionId);
      if (version) {
        onRestore?.(version.content);
        lastContentRef.current = version.content;
        setSaveState(prev => ({
          ...prev,
          hasUnsavedChanges: false
        }));
        return version.content;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Version restore failed';
      onError?.(errorMessage);
    }
    return null;
  }, [versions, onRestore, onError]);

  // 加载版本历史
  const loadVersions = useCallback(async () => {
    try {
      const savedVersions = await versionsStorage.getItem(`${key}_versions`) as SavedVersion[] || [];
      setVersions(savedVersions);
      return savedVersions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Load versions failed';
      onError?.(errorMessage);
      return [];
    }
  }, [key, versionsStorage, onError]);

  // 删除版本
  const deleteVersion = useCallback(async (versionId: string) => {
    try {
      const updatedVersions = versions.filter(v => v.id !== versionId);
      await versionsStorage.setItem(`${key}_versions`, updatedVersions);
      setVersions(updatedVersions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete version failed';
      onError?.(errorMessage);
    }
  }, [key, versions, versionsStorage, onError]);

  // 清除所有数据
  const clearAll = useCallback(async () => {
    try {
      await storage.removeItem(key);
      await versionsStorage.removeItem(`${key}_versions`);
      setVersions([]);
      setSaveState({
        isSaving: false,
        lastSaved: null,
        hasUnsavedChanges: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Clear failed';
      onError?.(errorMessage);
    }
  }, [key, storage, versionsStorage, onError]);

  // 监听内容变化
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }

    if (content !== lastContentRef.current) {
      setSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));
      debouncedSave(content);
    }
  }, [content, debouncedSave]);

  // 初始化时恢复内容和加载版本
  useEffect(() => {
    const initialize = async () => {
      await loadVersions();
      // 注意：不自动恢复内容，让用户选择是否恢复
    };
    initialize();
  }, [loadVersions]);

  // 页面卸载时保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveState.hasUnsavedChanges) {
        debouncedSave.flush(); // 立即执行防抖保存
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      debouncedSave.cancel();
    };
  }, [saveState.hasUnsavedChanges, debouncedSave]);

  return {
    saveState,
    versions,
    manualSave,
    restoreContent,
    saveVersion,
    restoreVersion,
    loadVersions,
    deleteVersion,
    clearAll
  };
};

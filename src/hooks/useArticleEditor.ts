import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { Article } from '../types/article';
import { articleService } from '../services/articleService';

// 自动保存延迟（毫秒）
const AUTO_SAVE_DELAY = 2000;

interface UseArticleEditorOptions {
  autoSave?: boolean;
  onSaveSuccess?: (article: Article) => void;
  onSaveError?: (error: Error) => void;
}

/**
 * 文章编辑器Hook，提供文章加载、编辑和自动保存功能
 */
export function useArticleEditor(articleId?: string, options: UseArticleEditorOptions = {}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 默认选项
  const { autoSave = true, onSaveSuccess, onSaveError } = options;

  // 加载文章
  useEffect(() => {
    if (!articleId) return;

    const loadArticle = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const loadedArticle = await articleService.getArticle(articleId);
        setArticle(loadedArticle);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('加载文章失败'));
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  // 保存文章
  const saveArticle = useCallback(async (articleToSave: Article) => {
    if (!articleToSave) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const savedArticle = await articleService.updateArticle(articleToSave);
      setArticle(savedArticle);
      setLastSaved(new Date());
      onSaveSuccess?.(savedArticle);
      return savedArticle;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('保存文章失败');
      setError(error);
      onSaveError?.(error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [onSaveSuccess, onSaveError]);

  // 创建新文章
  const createArticle = useCallback(async (title: string, content: string, categories: string[] = []) => {
    setSaving(true);
    setError(null);
    
    try {
      const newArticle = await articleService.createArticle(title, content, categories);
      setArticle(newArticle);
      setLastSaved(new Date());
      onSaveSuccess?.(newArticle);
      return newArticle;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('创建文章失败');
      setError(error);
      onSaveError?.(error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [onSaveSuccess, onSaveError]);

  // 更新文章内容
  const updateContent = useCallback((content: string) => {
    if (!article) return;
    
    const updatedArticle = {
      ...article,
      content,
      wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length,
      charCount: content.length
    };
    
    setArticle(updatedArticle);
    return updatedArticle;
  }, [article]);

  // 更新文章标题
  const updateTitle = useCallback((title: string) => {
    if (!article) return;
    
    const updatedArticle = {
      ...article,
      title
    };
    
    setArticle(updatedArticle);
    return updatedArticle;
  }, [article]);

  // 更新文章分类
  const updateCategories = useCallback(async (categoryIds: string[]) => {
    if (!article) return;
    
    try {
      const updatedArticle = await articleService.updateArticleCategories(article.id, categoryIds);
      if (updatedArticle) {
        setArticle(updatedArticle);
        setLastSaved(new Date());
        onSaveSuccess?.(updatedArticle);
      }
      return updatedArticle;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('更新文章分类失败');
      setError(error);
      onSaveError?.(error);
      throw error;
    }
  }, [article, onSaveSuccess, onSaveError]);

  // 自动保存
  const debouncedSave = useCallback(
    debounce((articleToSave: Article) => {
      saveArticle(articleToSave).catch(err => {
        console.error('自动保存失败:', err);
      });
    }, AUTO_SAVE_DELAY),
    [saveArticle]
  );

  // 当文章内容变化且启用自动保存时，触发自动保存
  useEffect(() => {
    if (autoSave && article && !saving) {
      debouncedSave(article);
    }
    
    return () => {
      debouncedSave.cancel();
    };
  }, [article, autoSave, saving, debouncedSave]);

  return {
    article,
    loading,
    saving,
    error,
    lastSaved,
    saveArticle,
    createArticle,
    updateContent,
    updateTitle,
    updateCategories
  };
}
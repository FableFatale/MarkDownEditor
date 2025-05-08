import React, { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { ArticleManager } from './ArticleManager';
import { useArticleEditor } from '../hooks/useArticleEditor';
import { Article } from '../types/article';

/**
 * 文章管理演示组件
 * 展示如何使用ArticleManager和useArticleEditor
 */
export const ArticleManagerDemo: React.FC = () => {
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // 使用自定义Hook管理文章编辑
  const {
    article,
    loading,
    saving,
    lastSaved,
    updateContent,
    updateTitle,
    saveArticle,
    createArticle
  } = useArticleEditor(editingArticleId || undefined, {
    autoSave: true,
    onSaveSuccess: (savedArticle) => {
      console.log('文章已保存:', savedArticle);
    },
    onSaveError: (error) => {
      console.error('保存文章失败:', error);
      alert(`保存失败: ${error.message}`);
    }
  });

  // 处理文章编辑
  const handleArticleEdit = (articleId: string) => {
    setEditingArticleId(articleId);
    setIsCreating(false);
  };

  // 处理创建新文章
  const handleCreateArticle = () => {
    setEditingArticleId(null);
    setIsCreating(true);
  };

  // 保存新文章
  const handleSaveNewArticle = async () => {
    if (!newArticleTitle || !newArticleContent) {
      alert('标题和内容不能为空');
      return;
    }

    try {
      const newArticle = await createArticle(newArticleTitle, newArticleContent);
      setEditingArticleId(newArticle.id);
      setIsCreating(false);
      setNewArticleTitle('');
      setNewArticleContent('');
    } catch (error) {
      console.error('创建文章失败:', error);
    }
  };

  // 返回文章列表
  const handleBackToList = () => {
    setEditingArticleId(null);
    setIsCreating(false);
  };

  // 新文章表单状态
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, my: 3 }}>
        {!editingArticleId && !isCreating ? (
          // 文章列表视图
          <ArticleManager 
            onArticleEdit={handleArticleEdit}
            onArticleCreate={handleCreateArticle}
          />
        ) : isCreating ? (
          // 创建新文章视图
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">创建新文章</Typography>
              <Button variant="outlined" onClick={handleBackToList}>返回列表</Button>
            </Box>
            
            <TextField
              fullWidth
              label="文章标题"
              value={newArticleTitle}
              onChange={(e) => setNewArticleTitle(e.target.value)}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="文章内容"
              value={newArticleContent}
              onChange={(e) => setNewArticleContent(e.target.value)}
              multiline
              rows={15}
              margin="normal"
            />
            
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button 
                variant="contained" 
                onClick={handleSaveNewArticle}
              >
                保存文章
              </Button>
            </Box>
          </Box>
        ) : (
          // 编辑文章视图
          <Box>
            {loading ? (
              <Typography>加载中...</Typography>
            ) : article ? (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5">编辑文章</Typography>
                  <Button variant="outlined" onClick={handleBackToList}>返回列表</Button>
                </Box>
                
                <TextField
                  fullWidth
                  label="文章标题"
                  value={article.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="文章内容"
                  value={article.content}
                  onChange={(e) => updateContent(e.target.value)}
                  multiline
                  rows={15}
                  margin="normal"
                />
                
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    {saving ? '保存中...' : lastSaved ? `上次保存: ${lastSaved.toLocaleString()}` : ''}
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => article && saveArticle(article)}
                    disabled={saving}
                  >
                    {saving ? '保存中...' : '手动保存'}
                  </Button>
                </Box>
              </>
            ) : (
              <Typography color="error">文章不存在或已被删除</Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};
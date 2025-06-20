import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { Article, Category } from '../types/article';
import { articleService } from '../services/articleService';
import { CategoryManager } from './CategoryManager';

interface ArticleManagerProps {
  onArticleEdit: (articleId: string) => void;
  onArticleCreate?: () => void;
}

export const ArticleManager: React.FC<ArticleManagerProps> = ({
  onArticleEdit,
  onArticleCreate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // 加载文章和分类数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [articlesData, categoriesData] = await Promise.all([
          articleService.getAllArticleMetadata(),
          articleService.getAllCategories()
        ]);
        
        setArticles(articlesData.map(meta => ({
          ...meta,
          content: '', // 元数据中不包含内容
          createdAt: new Date(meta.createdAt),
          updatedAt: new Date(meta.updatedAt)
        })));
        setCategories(categoriesData);
      } catch (error) {
        console.error('加载文章数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // 过滤文章
  useEffect(() => {
    const filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategories = selectedCategories.length === 0 ||
        selectedCategories.some(catId => article.categories.includes(catId));
      return matchesSearch && matchesCategories;
    });
    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedCategories]);

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };

  const handleArticleDelete = async (articleId: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        const success = await articleService.deleteArticle(articleId);
        if (success) {
          // 更新本地状态，移除已删除的文章
          setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
        }
      } catch (error) {
        console.error('删除文章失败:', error);
        alert('删除文章失败');
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };
  
  const handleArticleCategoryChange = async (articleId: string, categoryIds: string[]) => {
    try {
      const updatedArticle = await articleService.updateArticleCategories(articleId, categoryIds);
      if (updatedArticle) {
        // 更新本地状态
        setArticles(prevArticles => 
          prevArticles.map(article => 
            article.id === articleId 
              ? { ...article, categories: categoryIds, updatedAt: updatedArticle.updatedAt }
              : article
          )
        );
      }
    } catch (error) {
      console.error('更新文章分类失败:', error);
      alert('更新文章分类失败');
    }
  };
  
  // 处理分类管理相关的回调函数
  const handleCategoryAdd = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCategory = await articleService.createCategory(
        categoryData.name, 
        categoryData.description, 
        categoryData.parentId
      );
      setCategories(prev => [...prev, newCategory]);
    } catch (error) {
      console.error('添加分类失败:', error);
      alert('添加分类失败');
    }
  };
  
  const handleCategoryEdit = async (category: Category) => {
    try {
      const updatedCategory = await articleService.updateCategory(category);
      setCategories(prev => 
        prev.map(cat => cat.id === category.id ? updatedCategory : cat)
      );
    } catch (error) {
      console.error('更新分类失败:', error);
      alert('更新分类失败');
    }
  };
  
  const handleCategoryDelete = async (categoryId: string) => {
    try {
      const success = await articleService.deleteCategory(categoryId);
      if (success) {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        // 更新文章列表中的分类信息
        setArticles(prev => 
          prev.map(article => ({
            ...article,
            categories: article.categories.filter(id => id !== categoryId)
          }))
        );
      }
    } catch (error) {
      console.error('删除分类失败:', error);
      alert('删除分类失败');
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" component="h2" gutterBottom>
          文章管理
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<FolderIcon />}
            onClick={() => setShowCategoryManager(!showCategoryManager)}
          >
            {showCategoryManager ? '隐藏分类管理' : '分类管理'}
          </Button>
          {onArticleCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onArticleCreate}
            >
              新建文章
            </Button>
          )}
        </Box>
      </Box>
      
      {showCategoryManager && (
        <Box mb={3}>
          <CategoryManager 
            categories={categories}
            onCategoryAdd={handleCategoryAdd}
            onCategoryEdit={handleCategoryEdit}
            onCategoryDelete={handleCategoryDelete}
          />
        </Box>
      )}
      
      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索文章..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-filter-label">按分类筛选</InputLabel>
          <Select
            labelId="category-filter-label"
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={getCategoryName(value)}
                    size="small"
                  />
                ))}
              </Box>
            )}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredArticles.length === 0 ? (
        <Box textAlign="center" my={4}>
          <Typography variant="body1" color="textSecondary">
            {searchTerm || selectedCategories.length > 0 
              ? '没有找到匹配的文章' 
              : '还没有创建任何文章'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredArticles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {article.title}
                  </Typography>
                  <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                    {article.categories.map((categoryId) => (
                      <Chip
                        key={categoryId}
                        label={getCategoryName(categoryId)}
                        size="small"
                        icon={<FolderIcon />}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary" mt={2}>
                    字数：{article.wordCount} | 字符数：{article.charCount}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    最后更新：{new Date(article.updatedAt).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Tooltip title="编辑">
                    <IconButton
                      size="small"
                      onClick={() => onArticleEdit(article.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="删除">
                    <IconButton
                      size="small"
                      onClick={() => handleArticleDelete(article.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <FormControl size="small" sx={{ ml: 'auto', minWidth: 120 }}>
                    <Select
                      multiple
                      value={article.categories}
                      onChange={(e) => handleArticleCategoryChange(article.id, e.target.value as string[])}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={getCategoryName(value)} size="small" />
                          ))}
                        </Box>
                      )}
                      displayEmpty
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
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
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { Article, Category } from '../types/article';

interface ArticleManagerProps {
  articles: Article[];
  categories: Category[];
  onArticleEdit: (articleId: string) => void;
  onArticleDelete: (articleId: string) => void;
  onArticleCategoryChange: (articleId: string, categoryIds: string[]) => void;
}

export const ArticleManager: React.FC<ArticleManagerProps> = ({
  articles,
  categories,
  onArticleEdit,
  onArticleDelete,
  onArticleCategoryChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);

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

  const handleArticleDelete = (articleId: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      onArticleDelete(articleId);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  return (
    <Box>
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
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
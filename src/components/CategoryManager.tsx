import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Category } from '../types/article';

interface CategoryManagerProps {
  categories: Category[];
  onCategoryAdd: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCategoryEdit: (category: Category) => void;
  onCategoryDelete: (categoryId: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onCategoryAdd,
  onCategoryEdit,
  onCategoryDelete
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onCategoryAdd({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCategory = () => {
    if (selectedCategory && newCategoryName.trim()) {
      onCategoryEdit({
        ...selectedCategory,
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
        updatedAt: new Date()
      });
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description || '');
    setIsEditDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('确定要删除这个分类吗？')) {
      onCategoryDelete(categoryId);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">分类管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          添加分类
        </Button>
      </Box>

      <List>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <ListItemText
              primary={category.name}
              secondary={category.description}
            />
            <ListItemSecondaryAction>
              <Tooltip title="编辑">
                <IconButton
                  edge="end"
                  aria-label="编辑"
                  onClick={() => openEditDialog(category)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="删除">
                <IconButton
                  edge="end"
                  aria-label="删除"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* 添加分类对话框 */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>添加分类</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="分类名称"
            type="text"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="分类描述（可选）"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>取消</Button>
          <Button onClick={handleAddCategory} variant="contained">
            添加
          </Button>
        </DialogActions>
      </Dialog>

      {/* 编辑分类对话框 */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>编辑分类</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="分类名称"
            type="text"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="分类描述（可选）"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>取消</Button>
          <Button onClick={handleEditCategory} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
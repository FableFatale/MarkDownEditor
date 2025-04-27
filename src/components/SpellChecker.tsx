import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

interface SpellCheckerProps {
  content: string;
  onCorrect: (correctedContent: string) => void;
}

interface SpellingError {
  word: string;
  index: number;
  suggestions: string[];
}

interface CustomDictionary {
  words: Set<string>;
}

export const SpellChecker: React.FC<SpellCheckerProps> = ({ content, onCorrect }) => {
  const [errors, setErrors] = useState<SpellingError[]>([]);
  const [customDictionary, setCustomDictionary] = useState<CustomDictionary>({ words: new Set() });
  const [selectedError, setSelectedError] = useState<SpellingError | null>(null);
  const [isAddWordDialogOpen, setIsAddWordDialogOpen] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>(
    {open: false, message: '', severity: 'success'}
  );

  // 从本地存储加载自定义词典
  useEffect(() => {
    const savedDictionary = localStorage.getItem('customDictionary');
    if (savedDictionary) {
      const words = new Set(JSON.parse(savedDictionary));
      setCustomDictionary({ words });
    }
  }, []);

  // 保存自定义词典到本地存储
  const saveDictionary = useCallback((words: Set<string>) => {
    localStorage.setItem('customDictionary', JSON.stringify(Array.from(words)));
  }, []);

  // 检查拼写错误
  const checkSpelling = useCallback(async (text: string) => {
    // TODO: 接入拼写检查API或使用本地词典
    // 这里使用模拟数据作为示例
    const mockErrors: SpellingError[] = [];
    const words = text.split(/\s+/);
    
    words.forEach((word, index) => {
      if (word.length > 2 && !customDictionary.words.has(word.toLowerCase())) {
        // 模拟拼写检查逻辑
        const suggestions = [`${word}1`, `${word}2`, `${word}3`];
        mockErrors.push({
          word,
          index: text.indexOf(word),
          suggestions,
        });
      }
    });

    setErrors(mockErrors);
  }, [customDictionary.words]);

  // 监听内容变化
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      checkSpelling(content);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [content, checkSpelling]);

  // 添加单词到自定义词典
  const handleAddWord = () => {
    if (newWord.trim()) {
      const updatedWords = new Set(customDictionary.words);
      updatedWords.add(newWord.toLowerCase().trim());
      setCustomDictionary({ words: updatedWords });
      saveDictionary(updatedWords);
      setNewWord('');
      setIsAddWordDialogOpen(false);
      setSnackbar({
        open: true,
        message: '单词已添加到自定义词典',
        severity: 'success'
      });
      checkSpelling(content);
    }
  };

  // 从自定义词典中删除单词
  const handleDeleteWord = (word: string) => {
    const updatedWords = new Set(customDictionary.words);
    updatedWords.delete(word.toLowerCase());
    setCustomDictionary({ words: updatedWords });
    saveDictionary(updatedWords);
    setSnackbar({
      open: true,
      message: '单词已从自定义词典中删除',
      severity: 'success'
    });
    checkSpelling(content);
  };

  // 替换错误单词
  const handleCorrect = (error: SpellingError, correction: string) => {
    const before = content.slice(0, error.index);
    const after = content.slice(error.index + error.word.length);
    const correctedContent = before + correction + after;
    onCorrect(correctedContent);
    setSelectedError(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">拼写检查</Typography>
        <Tooltip title="添加单词到自定义词典">
          <IconButton onClick={() => setIsAddWordDialogOpen(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {errors.length > 0 ? (
        <List>
          {errors.map((error, index) => (
            <ListItem
              key={`${error.word}-${index}`}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => setSelectedError(error)}
                >
                  <EditIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={error.word}
                secondary={`建议：${error.suggestions.join(', ')}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          未发现拼写错误
        </Typography>
      )}

      {/* 添加单词对话框 */}
      <Dialog
        open={isAddWordDialogOpen}
        onClose={() => setIsAddWordDialogOpen(false)}
      >
        <DialogTitle>添加单词到自定义词典</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="新单词"
            fullWidth
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddWordDialogOpen(false)}>取消</Button>
          <Button onClick={handleAddWord} variant="contained">
            添加
          </Button>
        </DialogActions>
      </Dialog>

      {/* 纠正单词对话框 */}
      <Dialog
        open={!!selectedError}
        onClose={() => setSelectedError(null)}
      >
        <DialogTitle>选择正确的拼写</DialogTitle>
        <DialogContent>
          <List>
            {selectedError?.suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                onClick={() => selectedError && handleCorrect(selectedError, suggestion)}
                button
              >
                <ListItemText primary={suggestion} />
                <IconButton edge="end">
                  <CheckIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedError(null)}>取消</Button>
        </DialogActions>
      </Dialog>

      {/* 自定义词典管理对话框 */}
      <Dialog
        open={false} // TODO: 添加词典管理功能
        onClose={() => {}}
      >
        <DialogTitle>自定义词典管理</DialogTitle>
        <DialogContent>
          <List>
            {Array.from(customDictionary.words).map((word) => (
              <ListItem
                key={word}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDeleteWord(word)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={word} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>关闭</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert
          onClose={() => setSnackbar({...snackbar, open: false})}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
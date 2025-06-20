import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Close as CloseIcon,
  Transform as ConvertIcon,
  Upload as UploadIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import TurndownService from 'turndown';

interface TextToMarkdownConverterProps {
  open: boolean;
  onClose: () => void;
  onInsert?: (markdown: string) => void;
  className?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`converter-tabpanel-${index}`}
      aria-labelledby={`converter-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const TextToMarkdownConverter: React.FC<TextToMarkdownConverterProps> = ({
  open,
  onClose,
  onInsert,
  className = ''
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [plainText, setPlainText] = useState('');
  const [htmlText, setHtmlText] = useState('');
  const [convertedMarkdown, setConvertedMarkdown] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 转换选项
  const [options, setOptions] = useState({
    preserveLineBreaks: true,
    convertLinks: true,
    convertImages: true,
    convertTables: true,
    headingStyle: 'atx' as 'atx' | 'setext',
    codeBlockStyle: 'fenced' as 'fenced' | 'indented'
  });

  // 初始化Turndown服务
  const getTurndownService = () => {
    const turndownService = new TurndownService({
      headingStyle: options.headingStyle,
      codeBlockStyle: options.codeBlockStyle,
      emDelimiter: '*'
    });

    // 配置转换规则
    if (options.preserveLineBreaks) {
      turndownService.addRule('preserveLineBreaks', {
        filter: 'br',
        replacement: () => '\n'
      });
    }

    if (!options.convertLinks) {
      turndownService.addRule('removeLinks', {
        filter: 'a',
        replacement: (content) => content
      });
    }

    if (!options.convertImages) {
      turndownService.addRule('removeImages', {
        filter: 'img',
        replacement: (content, node) => (node as HTMLElement).getAttribute('alt') || ''
      });
    }

    if (!options.convertTables) {
      turndownService.addRule('removeTables', {
        filter: ['table', 'thead', 'tbody', 'tr', 'th', 'td'],
        replacement: (content) => content
      });
    }

    return turndownService;
  };

  // 转换纯文本为Markdown
  const convertPlainText = () => {
    if (!plainText.trim()) {
      setConvertedMarkdown('');
      return;
    }

    // 简单的纯文本转Markdown逻辑
    let markdown = plainText;
    
    // 检测并转换标题（基于行首的数字或特殊字符）
    markdown = markdown.replace(/^(\d+\.?\s+)(.+)$/gm, '## $2');
    markdown = markdown.replace(/^([•\-\*]\s+)(.+)$/gm, '- $2');
    
    // 检测并转换段落（双换行分隔）
    markdown = markdown.replace(/\n\s*\n/g, '\n\n');
    
    // 检测并转换引用（行首有>或引号）
    markdown = markdown.replace(/^[""](.+)[""]$/gm, '> $1');
    markdown = markdown.replace(/^>\s*(.+)$/gm, '> $1');
    
    setConvertedMarkdown(markdown);
  };

  // 转换HTML为Markdown
  const convertHtml = () => {
    if (!htmlText.trim()) {
      setConvertedMarkdown('');
      return;
    }

    try {
      const turndownService = getTurndownService();
      const markdown = turndownService.turndown(htmlText);
      setConvertedMarkdown(markdown);
    } catch (error) {
      console.error('HTML转换失败:', error);
      setConvertedMarkdown('转换失败，请检查HTML格式是否正确。');
    }
  };

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (file.type === 'text/html' || file.name.endsWith('.html')) {
        setHtmlText(content);
        setTabValue(1);
      } else {
        setPlainText(content);
        setTabValue(0);
      }
    };
    reader.readAsText(file);
  };

  // 复制到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(convertedMarkdown);
      setSuccessMessage('已复制到剪贴板');
      setShowSuccess(true);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 插入到编辑器
  const handleInsert = () => {
    if (convertedMarkdown && onInsert) {
      onInsert(convertedMarkdown);
      setSuccessMessage('已插入到编辑器');
      setShowSuccess(true);
      onClose();
    }
  };

  // 清空内容
  const clearAll = () => {
    setPlainText('');
    setHtmlText('');
    setConvertedMarkdown('');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        className={className}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ConvertIcon color="primary" />
              <Typography variant="h6">文字转Markdown</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="纯文本转换" />
              <Tab label="HTML转换" />
              <Tab label="转换选项" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', gap: 2, height: 400 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  输入纯文本
                </Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={15}
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="粘贴或输入纯文本内容..."
                  variant="outlined"
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={convertPlainText}
                    startIcon={<ConvertIcon />}
                    size="small"
                  >
                    转换
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setPlainText('')}
                    startIcon={<ClearIcon />}
                    size="small"
                  >
                    清空
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  转换结果
                </Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={15}
                  value={convertedMarkdown}
                  onChange={(e) => setConvertedMarkdown(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    readOnly: false
                  }}
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={copyToClipboard}
                    startIcon={<CopyIcon />}
                    size="small"
                    disabled={!convertedMarkdown}
                  >
                    复制
                  </Button>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', gap: 2, height: 400 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  输入HTML代码
                </Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={15}
                  value={htmlText}
                  onChange={(e) => setHtmlText(e.target.value)}
                  placeholder="粘贴HTML代码..."
                  variant="outlined"
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={convertHtml}
                    startIcon={<ConvertIcon />}
                    size="small"
                  >
                    转换
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setHtmlText('')}
                    startIcon={<ClearIcon />}
                    size="small"
                  >
                    清空
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  转换结果
                </Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={15}
                  value={convertedMarkdown}
                  onChange={(e) => setConvertedMarkdown(e.target.value)}
                  variant="outlined"
                />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={copyToClipboard}
                    startIcon={<CopyIcon />}
                    size="small"
                    disabled={!convertedMarkdown}
                  >
                    复制
                  </Button>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                转换选项
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.preserveLineBreaks}
                      onChange={(e) => setOptions({...options, preserveLineBreaks: e.target.checked})}
                    />
                  }
                  label="保留换行符"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.convertLinks}
                      onChange={(e) => setOptions({...options, convertLinks: e.target.checked})}
                    />
                  }
                  label="转换链接"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.convertImages}
                      onChange={(e) => setOptions({...options, convertImages: e.target.checked})}
                    />
                  }
                  label="转换图片"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={options.convertTables}
                      onChange={(e) => setOptions({...options, convertTables: e.target.checked})}
                    />
                  }
                  label="转换表格"
                />
              </Box>
            </Paper>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <input
            accept=".txt,.html,.htm"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
            >
              上传文件
            </Button>
          </label>
          
          <Button onClick={clearAll} startIcon={<ClearIcon />}>
            清空所有
          </Button>
          
          <Button onClick={onClose}>
            取消
          </Button>
          
          {onInsert && (
            <Button
              variant="contained"
              onClick={handleInsert}
              disabled={!convertedMarkdown}
            >
              插入到编辑器
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TextToMarkdownConverter;

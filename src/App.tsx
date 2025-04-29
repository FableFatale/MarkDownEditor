import { useState, useRef, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Category, Article } from './types/article';
import { Version } from './types/version';
import { CategoryManager } from './components/CategoryManager';
import { ArticleManager } from './components/ArticleManager';
import { ImageUploader } from './components/ImageUploader';
import { VersionManager } from './components/VersionManager';
import { CoverGenerator } from './components/CoverGenerator';
import { VideoLinkManager } from './components/VideoLinkManager';
import { AuthManager } from './components/AuthManager';
import { syncService } from './services/syncService';
import { versionService } from './services/versionService';
import { collaborationService } from './services/collaborationService';
import { offlineService } from './services/offlineService';
import { CollaborationUser, CollaborationState, TextOperation } from './types/collaboration';
import { LargeFileEditor } from './components/LargeFileEditor';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material/styles';
import { Container, Box, CssBaseline, Grid, Paper, Button, Toolbar, IconButton, Stack, Divider, Tooltip, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItemButton, Drawer, alpha } from '@mui/material';
import { AccountCircle, Login } from '@mui/icons-material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Code,
  FormatStrikethrough,
  TitleRounded,
  InsertLink,
  ImageRounded,
  PictureAsPdfRounded,
  FolderRounded,
  SaveRounded,
  DarkMode,
  LightMode,
  HistoryRounded,
  KeyboardTabRounded,
  CloseRounded,
  FullscreenRounded,
  FullscreenExitRounded,
  MenuRounded,
  FunctionsRounded,
  BrokenImageRounded,
  VideoLibraryRounded
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './markdown-styles.css';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

// Helper function to count words (handles CJK characters better)
const countWords = (text: string): number => {
  // Remove leading/trailing whitespace and split by spaces or CJK characters
  const trimmedText = text.trim();
  if (!trimmedText) return 0;
  // Match sequences of non-whitespace characters (including CJK)
  const words = trimmedText.match(/\S+/g);
  return words ? words.length : 0;
};



function App() {
  // 类型定义
  interface OutlineItem {
    id: string;
    text: string;
    level: number;
  }

  // 状态管理
  const [value, setValue] = useState('# 欢迎使用 Markdown 编辑器\n\n这是一个简单的示例文档。您可以开始编写您的内容了！');
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<PaletteMode>('light');
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [recentFilesAnchorEl, setRecentFilesAnchorEl] = useState<null | HTMLElement>(null);
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const [isVersionManagerOpen, setIsVersionManagerOpen] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [collaborationState, setCollaborationState] = useState<CollaborationState>(collaborationService.getState());
  const [collaborators, setCollaborators] = useState<CollaborationUser[]>([]);
  const [isCoverGeneratorOpen, setIsCoverGeneratorOpen] = useState(false);
  const [isVideoLinkManagerOpen, setIsVideoLinkManagerOpen] = useState(false);

  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>([]);

  // 引用和常量
  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const drawerWidth = 240;
  const recentFilesOpen = Boolean(recentFilesAnchorEl);



  // 大纲相关函数
  const toggleOutline = () => {
    setIsOutlineOpen((prev) => !prev);
  };

  // 分类管理相关函数
  const handleAddCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: Category = {
      id: uuidv4(),
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCategories([...categories, newCategory]);
  };

  const handleEditCategory = (updatedCategory: Category) => {
    setCategories(categories.map(cat =>
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    // 同时更新所有包含该分类的文章
    setArticles(articles.map(article => ({
      ...article,
      categories: article.categories.filter(id => id !== categoryId)
    })));
  };

  // 文章管理相关函数
  const handleCreateArticle = () => {
    const newArticle: Article = {
      id: uuidv4(),
      title: '新文章',
      content: '',
      categories: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: 0,
      charCount: 0
    };
    setArticles([...articles, newArticle]);
    setCurrentArticleId(newArticle.id);
    setValue('');
  };

  const handleArticleEdit = async (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (article) {
      setCurrentArticleId(articleId);
      setValue(article.content);
      // 加载文章的版本历史
      const articleVersions = await versionService.getVersionsByArticleId(articleId);
      setVersions(articleVersions);
    }
  };

  // 自动保存功能
  useEffect(() => {
    if (!currentArticleId) return;
    
    let autoSaveTimer: NodeJS.Timeout;
    
    const saveCurrentArticle = () => {
      if (currentArticleId && value) {
        const currentArticle = articles.find(a => a.id === currentArticleId);
        if (currentArticle) {
          const updatedArticle = {
            ...currentArticle,
            content: value,
            wordCount: countWords(value),
            charCount: value.length,
            updatedAt: new Date()
          };
          setArticles(prevArticles =>
            prevArticles.map(a => a.id === currentArticleId ? updatedArticle : a)
          );
        }
      }
    };
    
    // 立即执行一次保存
    saveCurrentArticle();
    
    // 设置定时器
    autoSaveTimer = setInterval(saveCurrentArticle, 30000); // 每30秒自动保存一次

    return () => {
      if (autoSaveTimer) clearInterval(autoSaveTimer);
    };
  }, [currentArticleId, value, articles]);

  // 数据同步相关函数
  const handleSync = async () => {
    try {
      setIsSyncing(true);

      // 获取上次同步时间后的修改数据
      const lastSyncTime = new Date(localStorage.getItem('lastSyncTime') || '0');
      const modifiedArticles = await offlineService.getModifiedArticles(lastSyncTime);
      const modifiedCategories = await offlineService.getModifiedCategories(lastSyncTime);

      // 同步分类
      const categoryResult = await syncService.syncCategories(modifiedCategories);
      if (!categoryResult.success) {
        throw new Error(categoryResult.error || '分类同步失败');
      }

      // 同步文章
      const articleResult = await syncService.syncArticles(modifiedArticles);
      if (!articleResult.success) {
        throw new Error(articleResult.error || '文章同步失败');
      }

      // 更新同步时间
      localStorage.setItem('lastSyncTime', new Date().toISOString());

      // 清理过期的离线数据（保留最近30天的数据）
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      await offlineService.cleanupOldData(thirtyDaysAgo);
    } catch (error) {
      console.error('同步失败:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // 主题切换
  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // 全屏切换
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 图片上传处理
  const handleImageUpload = (imageUrl: string) => {
    const imageMarkdown = `![](${imageUrl})`;
    if (editorRef.current?.view) {
      const view = editorRef.current.view;
      const pos = view.state.selection.main.head;
      view.dispatch({
        changes: { from: pos, insert: imageMarkdown + '\n' }
      });
    }
    setIsImageUploaderOpen(false);
  };

  // 封面图处理
  const handleCoverSave = (coverUrl: string) => {
    const coverMarkdown = `![封面图](${coverUrl})`;
    if (editorRef.current?.view) {
      const view = editorRef.current.view;
      const pos = view.state.selection.main.head;
      view.dispatch({
        changes: { from: pos, insert: coverMarkdown + '\n' }
      });
    }
    setIsCoverGeneratorOpen(false);
  };

  // 视频链接处理
  const handleVideoLinkInsert = (markdown: string) => {
    if (editorRef.current?.view) {
      const view = editorRef.current.view;
      const pos = view.state.selection.main.head;
      view.dispatch({
        changes: { from: pos, insert: markdown + '\n' }
      });
    }
    setIsVideoLinkManagerOpen(false);
  };

  // 主题配置
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: '#5E6AD2',
            light: '#8B8FE5',
            dark: '#4A4FB8',
          },
          background: {
            default: themeMode === 'light' ? '#FFFFFF' : '#1A1B1E',
            paper: themeMode === 'light' ? '#F7F8FA' : '#27282B',
          },
        },
        components: {
          MuiToolbar: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(12px)',
                backgroundColor: alpha(themeMode === 'light' ? '#FFFFFF' : '#1A1B1E', 0.85),
                borderBottom: `1px solid ${themeMode === 'light' ? '#E5E7EB' : '#2D2E32'}`,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px',
                gap: '6px',
                '& .MuiIconButton-root': {
                  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  margin: '0 2px',
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  color: themeMode === 'light' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                  '&:hover': {
                    backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.06),
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                },
                '& .MuiButton-root': {
                  borderRadius: 6,
                  textTransform: 'none',
                  fontWeight: 500,
                  height: 28,
                  minWidth: 80,
                  padding: '0 12px',
                  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: themeMode === 'light' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                  '&:hover': {
                    backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.06),
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                },
                '& .auth-buttons': {
                  marginLeft: 'auto',
                  display: 'flex',
                  gap: '12px',
                  opacity: isFullScreen ? 0 : 1,
                  visibility: isFullScreen ? 'hidden' : 'visible',
                  transition: 'all 0.2s ease-in-out',
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: 4,
                width: 28,
                height: 28,
                padding: '4px',
                color: themeMode === 'light' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.06),
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.08),
                  '&:hover': {
                    backgroundColor: alpha(themeMode === 'light' ? '#000000' : '#FFFFFF', 0.12),
                  },
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                minWidth: 80,
                height: 28,
                padding: '0 12px',
                fontSize: '0.875rem',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              },
              contained: {
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                border: `1px solid ${themeMode === 'light' ? '#E5E7EB' : '#2D2E32'}`,
                boxShadow: 'none',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: themeMode === 'light' 
                    ? '0 4px 12px rgba(0, 0, 0, 0.05)'
                    : '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
              },
            },
          },
        },
      }),
    [themeMode, isFullScreen],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar variant="dense" sx={{ minHeight: 48 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={toggleTheme}>
              {themeMode === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
            <IconButton onClick={toggleFullScreen}>
              {isFullScreen ? <FullscreenExitRounded /> : <FullscreenRounded />}
            </IconButton>
            <Tooltip title="导出PDF">
              <IconButton onClick={async () => {
                if (!previewRef.current) return;
                try {
                  const canvas = await html2canvas(previewRef.current);
                  const imgData = canvas.toDataURL('image/png');
                  const pdf = new jsPDF('p', 'mm', 'a4');
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = pdf.internal.pageSize.getHeight();
                  const imgWidth = canvas.width;
                  const imgHeight = canvas.height;
                  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                  const imgX = (pdfWidth - imgWidth * ratio) / 2;
                  const imgY = 0;

                  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                  pdf.save('markdown-export.pdf');
                } catch (error) {
                  console.error('PDF导出失败:', error);
                }
              }}>
                <PictureAsPdfRounded />
              </IconButton>
            </Tooltip>
          </Stack>

        </Toolbar>
        <Box className={`editor-container ${isFullScreen ? 'fullscreen' : ''}`} sx={{ flex: 1, display: 'flex', flexDirection: 'row', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', height: 'calc(100vh - 64px)', maxHeight: '900px', position: 'relative', boxShadow: themeMode === 'light' ? '0 2px 12px rgba(0, 0, 0, 0.1)' : '0 2px 12px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease-in-out', mx: 'auto', my: 2, maxWidth: '1600px', width: '100%', '&.fullscreen': { maxHeight: '100vh', maxWidth: '100vw', mx: 0, my: 0, borderRadius: 0 } }}>
          <Box className="editor-section" sx={{ flex: '1 1 50%', borderRight: `1px solid ${themeMode === 'light' ? '#E5E7EB' : '#2D2E32'}`, overflow: 'auto', display: 'flex', flexDirection: 'column', bgcolor: themeMode === 'light' ? '#F8F9FA' : '#1E1E1E', minHeight: '100%', maxHeight: '100%' }}>
            <LargeFileEditor
              content={value}
              onChange={setValue}
              theme={themeMode}
            />
          </Box>
          <Box ref={previewRef} className="preview-section markdown-body" sx={{ flex: '1 1 50%', overflow: 'auto', padding: '20px', bgcolor: themeMode === 'light' ? '#F8F9FA' : '#1E1E1E', borderLeft: `1px solid ${themeMode === 'light' ? '#E5E7EB' : '#2D2E32'}`, minHeight: '100%', maxHeight: '100%', '& img': { maxWidth: '100%', height: 'auto' }, '& pre': { maxWidth: '100%', overflow: 'auto' }, '& table': { display: 'block', width: '100%', overflow: 'auto' }, '& blockquote': { borderLeft: '4px solid', borderLeftColor: themeMode === 'light' ? '#E5E7EB' : '#2D2E32', margin: '1em 0', padding: '0 1em' }, '& > *': { maxWidth: '100%' } }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeHighlight, rehypeSlug, rehypeKatex]}
            >
              {value}
            </ReactMarkdown>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
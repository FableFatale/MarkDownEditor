import { useState, useRef, useMemo, useEffect, Component, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
// 导入类型定义
import { Category, Article } from './types/article';
import { Version } from './types/version';
import { CollaborationUser, CollaborationState, TextOperation } from './types/collaboration';

// 导入组件
import { CategoryManager } from './components/CategoryManager';
import { ArticleManager } from './components/ArticleManager';
import { ImageUploader } from './components/ImageUploader';
import { VersionManager } from './components/VersionManager';
import { CoverGenerator } from './components/CoverGenerator';
import { VideoLinkManager } from './components/VideoLinkManager';
import { AuthManager } from './components/AuthManager';
import { LargeFileEditor } from './components/LargeFileEditor';
import Toolbar from './components/Toolbar';
import { MarkdownEditorContainer } from './components/editor/MarkdownEditorContainer';

// 导入服务
import { syncService } from './services/syncService';
import { versionService } from './services/versionService';
import { collaborationService } from './services/collaborationService';
import { offlineService } from './services/offlineService';

// 导入Material UI相关组件和工具
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Container,
  Box,
  CssBaseline,
  Grid,
  Paper,
  Button,
  IconButton,
  Stack,
  Divider,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  Drawer,
  alpha,
  CircularProgress,
  Alert
} from '@mui/material';
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

  // 加载状态管理
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // 状态管理
  const [value, setValue] = useState('# 欢迎使用 Markdown 编辑器\n\n这是一个简单的示例文档。您可以开始编写您的内容了！');
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
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
      const articleVersions = await versionService.getVersionsByArticle(articleId);
      setVersions(articleVersions);
    }
  };

  // 自动保存功能
  useEffect(() => {
    if (!currentArticleId) return;

    let autoSaveTimer: number;

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
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('theme-mode', newMode);
    // 触发主题切换动画
    document.documentElement.style.transition = 'background-color 0.3s ease-in-out';
    document.documentElement.style.backgroundColor =
      newMode === 'light' ? theme.palette.background.default : theme.palette.background.paper;
  };

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    if (savedTheme) {
      setThemeMode(savedTheme);
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDarkMode ? 'dark' : 'light');
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-mode')) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

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
      // 确保 editorRef.current 存在且具有 view 属性
      const view = (editorRef.current as any)?.view;
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
          text: {
            primary: themeMode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
            secondary: themeMode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          },
        },
        transitions: {
          duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
          },
          easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
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
          // 确保文本字段正确渲染
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: themeMode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: themeMode === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#5E6AD2',
                  },
                },
              },
            },
          },
        },
      }),
    [themeMode, isFullScreen],
  );

  // 初始化数据加载
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        // 这里可以添加其他初始化逻辑
        const savedTheme = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
        if (savedTheme) {
          setThemeMode(savedTheme);
        } else {
          const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setThemeMode(prefersDarkMode ? 'dark' : 'light');
        }
      } catch (error) {
        setLoadingError(error instanceof Error ? error.message : '初始化失败');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: theme.palette.background.default
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (loadingError) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: theme.palette.background.default
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {loadingError}
        </Alert>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar content={value} />
        <Box
          className={`editor-container ${isFullScreen ? 'fullscreen' : ''}`}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            height: 'calc(100vh - 64px)',
            maxHeight: '900px',
            position: 'relative',
            boxShadow: themeMode === 'light' ? '0 2px 12px rgba(0, 0, 0, 0.1)' : '0 2px 12px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease-in-out',
            mx: 'auto',
            my: 2,
            maxWidth: '1600px',
            width: '100%',
            '&.fullscreen': {
              maxHeight: '100vh',
              maxWidth: '100vw',
              mx: 0,
              my: 0,
              borderRadius: 0
            }
          }}
        >
          {/* 使用新的MarkdownEditorContainer组件 */}
          <MarkdownEditorContainer
            initialValue={value}
            onContentChange={setValue}
            className="flex-1"
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// 错误边界组件
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('错误边界捕获到错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: 3,
            bgcolor: 'background.default'
          }}
        >
          <Alert
            severity="error"
            sx={{
              maxWidth: 600,
              width: '100%',
              mb: 2
            }}
          >
            应用程序遇到了问题
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            刷新页面
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// 包装App组件
const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
import { useState, useRef, useMemo, useEffect } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { basicLight } from '@codemirror/theme-basic-light';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material/styles';
import { Container, Box, CssBaseline, Grid, Paper, Button, Toolbar, IconButton, Stack, Divider, Tooltip, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItemButton, Drawer } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Code,
  FormatStrikethrough,
  Title,
  Link,
  Image,
  PictureAsPdf,
  FolderOpen,
  Save,
  Brightness4,
  Brightness7,
  History,
  KeyboardTab,
  Close,
  Fullscreen,
  FullscreenExit,
  MenuOpen
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
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
  const [value, setValue] = useState('');
  const previewRef = useRef<HTMLDivElement>(null); // Add ref for preview pane
  const editorRef = useRef<ReactCodeMirrorRef>(null); // Add ref for editor
  const [themeMode, setThemeMode] = useState<PaletteMode>('light'); // Add theme mode state
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [recentFilesAnchorEl, setRecentFilesAnchorEl] = useState<null | HTMLElement>(null);
  const recentFilesOpen = Boolean(recentFilesAnchorEl);
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0); // State for word count
  const [charCount, setCharCount] = useState(0); // State for character count
  const [lineCount, setLineCount] = useState(0); // State for line count
  const [isFullScreen, setIsFullScreen] = useState(false); // State for full screen mode
  const [isOutlineOpen, setIsOutlineOpen] = useState(false); // State for outline drawer
  interface OutlineItem {
    id: string;
    text: string;
    level: number;
  }
  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>([]); // State for outline items

  // Create theme based on themeMode state
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode],
  );

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    // State update will be handled by the event listener
  };

  const toggleOutline = () => {
    setIsOutlineOpen((prev) => !prev);
  };

  // Load recent files from localStorage on component mount
  useEffect(() => {
    const storedRecentFiles = localStorage.getItem('recentFiles');
    if (storedRecentFiles) {
      setRecentFiles(JSON.parse(storedRecentFiles));
    }
  }, []);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl/Cmd key is pressed
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b': // Bold
            e.preventDefault();
            handleFormat('bold');
            break;
          case 'i': // Italic
            e.preventDefault();
            handleFormat('italic');
            break;
          case 'l': // Link
            e.preventDefault();
            handleFormat('link');
            break;
          case 'k': // Code
            e.preventDefault();
            handleFormat('code');
            break;
          case 's': // Save
            e.preventDefault();
            handleSaveFile();
            break;
          case 'o': // Open
            e.preventDefault();
            handleOpenFile();
            break;
          case 'p': // Export PDF
            if (e.shiftKey) {
              e.preventDefault();
              handleExportPdf();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Effect to listen for fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // Update word and character count when value changes
  useEffect(() => {
    setCharCount(value.length);
    setWordCount(countWords(value));
    // Calculate line count (handle empty string case)
    setLineCount(value ? value.split('\n').length : 0);
    }, [value]);

  // Effect to extract headings for outline
  useEffect(() => {
    if (previewRef.current) {
      const headings = previewRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const items: OutlineItem[] = Array.from(headings).map((heading) => ({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1), 10),
      }));
      setOutlineItems(items);
    }
    // Dependency on 'value' ensures this runs when content changes and re-renders
    // Adding a small delay might be necessary if rehype-slug runs slightly after initial render
    const timer = setTimeout(() => {
        if (previewRef.current) {
            const headings = previewRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const items: OutlineItem[] = Array.from(headings)
                .filter(heading => heading.id) // Ensure heading has an ID from rehype-slug
                .map((heading) => ({
                    id: heading.id,
                    text: heading.textContent || '',
                    level: parseInt(heading.tagName.substring(1), 10),
                }));
            setOutlineItems(items);
        }
    }, 100); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, [value, themeMode]); // Rerun when value or theme changes (preview re-renders)

  const handleOutlineItemClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

const onChange = (val: string) => {
  setValue(val);
  };

  // Extend handleFormat type to include new formats
  const handleFormat = (type: 'bold' | 'italic' | 'unordered-list' | 'ordered-list' | 'code' | 'strikethrough' | 'h1' | 'h2' | 'link' | 'image') => {
    const editorView = editorRef.current?.view;
    if (!editorView) return;

    const { state } = editorView;
    const changes = state.changeByRange((range) => {
      const text = state.sliceDoc(range.from, range.to);
      let newText = '';
      let newSelection = range;
      const isMultiLine = text.includes('\n');

      switch (type) {
        case 'bold':
          newText = `**${text}**`;
          // Adjust selection if text was selected
          if (range.from !== range.to) {
            newSelection = state.selection.main.extend(range.from + 2, range.to + 2);
          } else {
            // Place cursor in the middle if no text selected
            newSelection = state.selection.main.extend(range.from + 2);
          }
          break;
        case 'italic':
          newText = `*${text}*`;
          if (range.from !== range.to) {
            newSelection = state.selection.main.extend(range.from + 1, range.to + 1);
          } else {
            newSelection = state.selection.main.extend(range.from + 1);
          }
          break;
        case 'unordered-list':
          // Add '- ' prefix to each selected line or insert '- ' if no selection
          newText = text.split('\n').map(line => `- ${line}`).join('\n');
          if (range.from === range.to) newText = '- ';
          newSelection = state.selection.main.extend(range.from + newText.length);
          break;
        case 'ordered-list':
          // Add '1. ' prefix to each selected line or insert '1. ' if no selection
          newText = text.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
          if (range.from === range.to) newText = '1. ';
          newSelection = state.selection.main.extend(range.from + newText.length);
          break;
        case 'code':
          newText = '```\n' + text + '\n```';
          if (range.from !== range.to) {
            newSelection = state.selection.main.extend(range.from + 3, range.to + 3);
          } else {
            newSelection = state.selection.main.extend(range.from + 3);
          }
          break;
        // Add new cases for strikethrough, headings, link, image
        case 'strikethrough':
          newText = `~~${text}~~`;
          if (range.from !== range.to) {
            newSelection = state.selection.main.extend(range.from + 2, range.to + 2);
          } else {
            newSelection = state.selection.main.extend(range.from + 2);
          }
          break;
        case 'h1':
          newText = isMultiLine
            ? text.split('\n').map(line => `# ${line}`).join('\n')
            : `# ${text}`;
          if (range.from === range.to) newText = '# ';
          newSelection = state.selection.main.extend(range.from + newText.length);
          break;
        case 'h2':
           newText = isMultiLine
            ? text.split('\n').map(line => `## ${line}`).join('\n')
            : `## ${text}`;
          if (range.from === range.to) newText = '## ';
          newSelection = state.selection.main.extend(range.from + newText.length);
          break;
        case 'link':
          newText = `[${text || 'link text'}](url)`;
          // Select 'url' part for easy replacement
          if (range.from !== range.to) {
             newSelection = state.selection.main.extend(range.from + newText.length - 4, range.from + newText.length -1);
          } else {
             newSelection = state.selection.main.extend(range.from + newText.length - 4, range.from + newText.length -1);
          }
          break;
        case 'image':
          newText = `![${text || 'alt text'}](image url)`;
           // Select 'image url' part for easy replacement
          if (range.from !== range.to) {
             newSelection = state.selection.main.extend(range.from + newText.length - 10, range.from + newText.length -1);
          } else {
             newSelection = state.selection.main.extend(range.from + newText.length - 10, range.from + newText.length -1);
          }
          break;
      }

      return {
        changes: { from: range.from, to: range.to, insert: newText },
        range: newSelection,
      };
    });

    editorView.dispatch(changes);
    // Ensure the editor keeps focus after the change
    editorView.focus();
  };

  const handleExportPdf = () => {
    if (previewRef.current) {
      html2canvas(previewRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30; // Add some margin top
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('markdown-export.pdf');
      });
    }
  };

  // Function to handle opening a file
  const handleOpenFile = async () => {
    try {
      // @ts-ignore - Using experimental File System Access API
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Markdown Files',
            accept: {
              'text/markdown': ['.md'],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });
      const file = await fileHandle.getFile();
      const contents = await file.text();
      setValue(contents);
      
      // Add to recent files
      const fileName = file.name;
      setRecentFiles(prev => {
        // Remove if already exists and add to the beginning
        const newRecentFiles = prev.filter(f => f !== fileName);
        newRecentFiles.unshift(fileName);
        // Keep only the last 5 files
        const limitedFiles = newRecentFiles.slice(0, 5);
        // Save to localStorage
        localStorage.setItem('recentFiles', JSON.stringify(limitedFiles));
        return limitedFiles;
      });
    } catch (err) {
      console.error('Error opening file:', err);
      // Handle errors, e.g., user cancellation
    }
  };
  
  const handleRecentFilesClick = (event: React.MouseEvent<HTMLElement>) => {
    setRecentFilesAnchorEl(event.currentTarget);
  };
  
  const handleRecentFilesClose = () => {
    setRecentFilesAnchorEl(null);
  };

  // Function to handle saving a file
  const handleSaveFile = async () => {
    try {
      // @ts-ignore - Using experimental File System Access API
      const fileHandle = await window.showSaveFilePicker({
        types: [
          {
            description: 'Markdown Files',
            accept: {
              'text/markdown': ['.md'],
            },
          },
        ],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(value);
      await writable.close();
    } catch (err) {
      console.error('Error saving file:', err);
      // Handle errors, e.g., user cancellation
    }
  };


  return (
    <ThemeProvider theme={theme}> {/* Wrap with ThemeProvider */}
      <CssBaseline />
      {/* Adjust Container padding and background based on theme */}
      <Container maxWidth={false} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: { xs: 1, sm: 2, md: 3 }, bgcolor: 'background.default', background: themeMode === 'light' ? 'linear-gradient(145deg, #f8f9fa, #ffffff)' : 'linear-gradient(145deg, #0d1117, #161b22)' }} disableGutters={isFullScreen}> {/* Adjust gutters based on fullscreen */}
        {/* Toolbar remains visible in fullscreen */}
        <Toolbar variant="dense" sx={{
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
          position: isFullScreen ? 'fixed' : 'relative', // Fix toolbar in fullscreen
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100, // Ensure toolbar is above other content
          width: '100%',
          px: { xs: 1, sm: 2, md: 3 },
          mb: 2,
          bgcolor: themeMode === 'light' ? 'grey.100' : 'grey.900',
          borderRadius: { xs: 8, sm: 12 },
          boxShadow: themeMode === 'light'
            ? '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)'
            : '0 10px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.2)',
          background: themeMode === 'light'
            ? 'linear-gradient(135deg, #f5f7fa, #e4e7eb)'
            : 'linear-gradient(135deg, #2d3748, #1a202c)',
          transition: 'all 0.3s ease',
          overflowX: 'auto',
        }}>
          <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center" sx={{ width: '100%' }} divider={<Divider orientation="vertical" flexItem />}>
             <Tooltip title="切换大纲">
               <IconButton onClick={toggleOutline} size="small" sx={{ p: 1.2, borderRadius: 8, backdropFilter: 'blur(4px)', '&:hover': { bgcolor: themeMode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)', transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' }, transition: 'all 0.2s ease' }}>
                 <MenuOpen fontSize="small" />
               </IconButton>
             </Tooltip>
               {/* Text Formatting Group */}
               <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
              <Typography variant="caption" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1, fontWeight: 'bold', color: 'text.secondary' }}>格式</Typography>
              <Tooltip title="加粗 (Ctrl+B)">
                <IconButton onClick={() => handleFormat('bold')} size="small" sx={{ p: 1.2, borderRadius: 8, backdropFilter: 'blur(4px)', '&:hover': { bgcolor: themeMode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)', transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' }, transition: 'all 0.2s ease' }}>
                  <FormatBold fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="斜体 (Ctrl+I)">
                <IconButton onClick={() => handleFormat('italic')} size="small" sx={{ p: 1.2, borderRadius: 8, backdropFilter: 'blur(4px)', '&:hover': { bgcolor: themeMode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)', transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' }, transition: 'all 0.2s ease' }}>
                  <FormatItalic fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="删除线">
                <IconButton onClick={() => handleFormat('strikethrough')} size="small" sx={{ p: 1.2, borderRadius: 8, backdropFilter: 'blur(4px)', '&:hover': { bgcolor: themeMode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)', transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' }, transition: 'all 0.2s ease' }}>
                  <FormatStrikethrough fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            {/* Headings Group */}
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
              <Typography variant="caption" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1, fontWeight: 'bold', color: 'text.secondary' }}>标题</Typography>
              <Tooltip title="一级标题">
                <IconButton onClick={() => handleFormat('h1')} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <Title fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="二级标题">
                <IconButton onClick={() => handleFormat('h2')} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <Title sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Tooltip>
            </Stack>
            {/* Lists Group */}
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
              <Typography variant="caption" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1, fontWeight: 'bold', color: 'text.secondary' }}>列表</Typography>
              <Tooltip title="无序列表">
                <IconButton onClick={() => handleFormat('unordered-list')} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <FormatListBulleted fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="有序列表">
                <IconButton onClick={() => handleFormat('ordered-list')} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <FormatListNumbered fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            {/* Insert Group */}
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
              <Typography variant="caption" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1, fontWeight: 'bold', color: 'text.secondary' }}>插入</Typography>
              <Tooltip title="代码块 (Ctrl+K)">
                <IconButton onClick={() => handleFormat('code')} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <Code fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="链接 (Ctrl+L)">
                <IconButton onClick={() => handleFormat('link')} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <Link fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="图片">
                <IconButton onClick={() => handleFormat('image')} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <Image fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            {/* View Options Group */}
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
              <Typography variant="caption" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1, fontWeight: 'bold', color: 'text.secondary' }}>视图</Typography>
              <Tooltip title={isFullScreen ? "退出全屏" : "全屏模式"}>
                <IconButton onClick={toggleFullScreen} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  {isFullScreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title={themeMode === 'light' ? "切换深色模式" : "切换浅色模式"}>
                <IconButton onClick={toggleTheme} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  {themeMode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Stack>
            {/* File Operations Group */}
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
              <Typography variant="caption" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 1, fontWeight: 'bold', color: 'text.secondary' }}>文件</Typography>
              <Tooltip title="打开文件 (Ctrl+O)">
                <IconButton onClick={handleOpenFile} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <FolderOpen fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="保存文件 (Ctrl+S)">
                <IconButton onClick={handleSaveFile} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <Save fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="导出为 PDF (Ctrl+Shift+P)">
                <IconButton onClick={handleExportPdf} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <PictureAsPdf fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="最近打开">
                <IconButton
                  onClick={handleRecentFilesClick}
                  size="small"
                  sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}
                  aria-controls={recentFilesOpen ? 'recent-files-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={recentFilesOpen ? 'true' : undefined}
                >
                  <History fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu
                id="recent-files-menu"
                anchorEl={recentFilesAnchorEl}
                open={recentFilesOpen}
                onClose={handleRecentFilesClose}
                MenuListProps={{
                  'aria-labelledby': 'recent-files-button',
                }}
              >
                {recentFiles.length > 0 ? (
                  recentFiles.map((file) => (
                    <MenuItem key={file} onClick={() => { /* Implement opening recent file */ handleRecentFilesClose(); }}>
                      <ListItemText primary={file} />
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>没有最近文件</MenuItem>
                )}
              </Menu>
            </Stack>
            {/* Spacer to push theme toggle to the right */}
            <Box sx={{ flexGrow: 1 }} />
            {/* Other Controls Group */}
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
              <Tooltip title="键盘快捷键">
                <IconButton onClick={() => setShortcutsDialogOpen(true)} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  <KeyboardTab fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={themeMode === 'light' ? '切换到深色模式' : '切换到浅色模式'}>
                <IconButton onClick={toggleTheme} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  {themeMode === 'light' ? <Brightness4 fontSize="small" /> : <Brightness7 fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Tooltip title={isFullScreen ? '退出全屏' : '全屏'}>
                <IconButton onClick={toggleFullScreen} size="small" sx={{ p: 1.2, borderRadius: 1.5, '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-1px)', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }, '&:active': { transform: 'translateY(0px)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.1)' } }}>
                  {isFullScreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Toolbar>

        {/* Outline Drawer */}
          <Drawer
            anchor="left"
            open={isOutlineOpen}
            onClose={toggleOutline}
            sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, mt: { xs: '56px', sm: '64px' }, height: 'calc(100% - 64px)', borderRight: `1px solid ${theme.palette.divider}` } }} // Adjust top margin based on Toolbar height
            variant="temporary" // Or 'persistent' if you want it to push content
          >
            <Toolbar /> {/* Add Toolbar spacing */} 
            <Box sx={{ overflow: 'auto', p: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                文档大纲
              </Typography>
              <List dense>
                {outlineItems.length > 0 ? (
                  outlineItems.map((item) => (
                    <ListItemButton
                      key={item.id}
                      onClick={() => handleOutlineItemClick(item.id)}
                      sx={{ pl: item.level * 2 }} // Indent based on heading level
                    >
                      <ListItemText primary={item.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'text.secondary',
                            fontSize: '0.875rem' // Slightly smaller font
                          }
                        }}
                      />
                    </ListItemButton>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                    没有找到标题。
                  </Typography>
                )}
              </List>
            </Box>
          </Drawer>

          {/* Main Content Area - Adjust padding/margin if Drawer is persistent */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mt: isFullScreen ? '64px' : 0 }}> {/* Add top margin in fullscreen to account for fixed toolbar */} 
            {/* Grid for Editor and Preview */}
            <Grid container spacing={2} sx={{ flexGrow: 1, overflow: 'hidden', height: '100%' }}>
            {/* Editor Pane */}
            {/* Adjust width based on fullscreen and outline visibility */}
            <Grid item xs={12} md={isFullScreen ? 6 : 5} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 2, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
                <CodeMirror
                  ref={editorRef} // Assign ref
                  value={value}
                  height="100%"
                  extensions={[markdown()]} // Enable Markdown language support
                  theme={themeMode === 'light' ? basicLight : oneDark} // Apply theme based on state
                  onChange={onChange}
                  style={{ fontSize: '16px', height: '100%', overflow: 'auto' }}
                />
              </Paper>
            </Grid>

            {/* Preview Pane */}
            {/* Adjust width based on fullscreen and outline visibility */}
            <Grid item xs={12} md={isFullScreen ? 6 : 4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'auto', p: 3, borderRadius: 2, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
                <Box ref={previewRef} className={`markdown-body ${themeMode}`}> {/* Add ref and theme class */} 
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]} // Enable GFM (tables, strikethrough, etc.)
                    rehypePlugins={[
                      rehypeHighlight, // Add syntax highlighting
                      rehypeSlug // Add IDs to headings
                    ]}
                    components={{
                      // Customize heading rendering if needed
                      // h1: ({node, ...props}) => <h1 style={{color: 'red'}} {...props} />,
                    }}
                  >
                    {value}
                  </ReactMarkdown>
                </Box>
              </Paper>
            </Grid>

            {/* Outline Pane - Conditionally render based on fullscreen */} 
            {!isFullScreen && (
              <Grid item md={3} sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', height: '100%' }}>
                <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'auto', p: 2, borderRadius: 2, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.secondary', mb: 1 }}>
                    大纲
                  </Typography>
                  <List dense disablePadding>
                    {outlineItems.length > 0 ? (
                      outlineItems.map((item) => (
                        <ListItemButton
                          key={item.id}
                          onClick={() => handleOutlineItemClick(item.id)}
                          sx={{
                            pl: item.level * 2, // Indent based on heading level
                            py: 0.5, // Adjust vertical padding
                            borderRadius: 1,
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: 'text.secondary',
                                fontSize: '0.875rem' // Slightly smaller font
                              }
                            }}
                          />
                        </ListItemButton>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                        无标题
                      </Typography>
                    )}
                  </List>
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* Status Bar */}
          <Box sx={{ borderTop: 1, borderColor: 'divider', p: 1, mt: 2, flexShrink: 0, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Typography variant="caption" color="text.secondary">字数: {wordCount}</Typography>
              <Typography variant="caption" color="text.secondary">字符: {charCount}</Typography>
              <Typography variant="caption" color="text.secondary">行数: {lineCount}</Typography>
            </Stack>
          </Box>

          {/* Shortcuts Dialog */}
          <Dialog open={shortcutsDialogOpen} onClose={() => setShortcutsDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              键盘快捷键
              <IconButton onClick={() => setShortcutsDialogOpen(false)} size="small">
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>格式化</Typography>
                  <Typography variant="body2">加粗: Ctrl/Cmd + B</Typography>
                  <Typography variant="body2">斜体: Ctrl/Cmd + I</Typography>
                  <Typography variant="body2">链接: Ctrl/Cmd + L</Typography>
                  <Typography variant="body2">代码: Ctrl/Cmd + K</Typography>
                  {/* Add other formatting shortcuts here */}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>文件操作</Typography>
                  <Typography variant="body2">保存: Ctrl/Cmd + S</Typography>
                  <Typography variant="body2">打开: Ctrl/Cmd + O</Typography>
                  <Typography variant="body2">导出 PDF: Ctrl/Cmd + Shift + P</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShortcutsDialogOpen(false)}>关闭</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Drawer>
      {/* 主体内容区域 */}
      <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 0 }}>
        {/* 工具栏 */}
        <Toolbar disableGutters sx={{ minHeight: 48, px: 1, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          {/* ...工具栏内容... */}
        </Toolbar>
        {/* 编辑器和预览区域 */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* 编辑器区域 */}
          <Box sx={{ flex: 1, p: 2, overflow: 'auto', minWidth: 0 }}>
            <CodeMirror
              ref={editorRef}
              value={value}
              height="100%"
              minHeight="300px"
              theme={themeMode === 'dark' ? oneDark : basicLight}
              extensions={[markdown()]}
              onChange={onChange}
            />
          </Box>
          {/* 预览区域 */}
          <Box sx={{ flex: 1, p: 2, overflow: 'auto', minWidth: 0 }}>
            <div ref={previewRef} className={themeMode === 'dark' ? 'markdown-body-dark' : 'markdown-body'}>
              <ReactMarkdown
                children={value}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeSlug]}
                components={{
                  img: ({node, ...props}) => (
                    <img {...props} style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} alt={props.alt || ''} />
                  ),
                  a: ({node, ...props}) => (
                    <a {...props} style={{ color: themeMode === 'dark' ? '#90caf9' : '#1976d2', textDecoration: 'underline', wordBreak: 'break-all' }} target="_blank" rel="noopener noreferrer">{props.children}</a>
                  )
                }}
              />
            </div>
          </Box>
        </Box>
      </Container>
      {/* 状态栏 */}
      <Box sx={{ mt: 2, mb: 1, px: { xs: 1, sm: 2, md: 3 }, py: 1, borderRadius: 3, bgcolor: themeMode === 'light' ? 'grey.100' : 'grey.900', color: 'text.secondary', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: themeMode === 'light' ? '0 1px 4px rgba(0,0,0,0.04)' : '0 1px 4px rgba(0,0,0,0.18)', transition: 'all 0.3s' }}>
        <span>字数：{charCount} ｜ 单词：{wordCount} ｜ 行数：{lineCount}</span>
        <span>快捷键：<b>Ctrl+S</b> 保存，<b>Ctrl+O</b> 打开，<b>Ctrl+B</b> 加粗，<b>Ctrl+I</b> 斜体，<b>Ctrl+L</b> 链接，<b>Ctrl+Shift+P</b> 导出PDF</span>
      </Box>
    </Container>
  </ThemeProvider>
);

export default App;
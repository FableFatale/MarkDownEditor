// 编辑器配置类型
export interface EditorConfig {
  fontSize?: number;
  lineHeight?: number;
  tabSize?: number;
  lineNumbers?: boolean;
  lineWrapping?: boolean;
  autoCloseBrackets?: boolean;
  autoCloseTags?: boolean;
  highlightActiveLine?: boolean;
  highlightSelectionMatches?: boolean;
  theme?: 'light' | 'dark';
}

// 编辑器状态类型
export interface EditorState {
  content: string;
  selection?: {
    from: number;
    to: number;
  };
  scrollPosition?: number;
  history?: {
    undo: string[];
    redo: string[];
  };
}

// 工具栏操作类型
export type ToolbarAction =
  | 'bold'
  | 'italic'
  | 'bullet-list'
  | 'numbered-list'
  | 'link'
  | 'image'
  | 'code-block'
  | 'quote'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6';

// 快捷键配置类型
export interface ShortcutConfig {
  key: string;
  action: ToolbarAction;
  description: string;
}

// 编辑器事件处理器类型
export interface EditorEventHandlers {
  onChange?: (content: string) => void;
  onSelectionChange?: (selection: { from: number; to: number }) => void;
  onScroll?: (position: number) => void;
  onToolbarAction?: (action: ToolbarAction) => void;
  onSave?: () => void;
}

// 编辑器主题类型
export interface EditorTheme {
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  selectionMatch: string;
  lineHighlight: string;
  gutterBackground: string;
  gutterForeground: string;
  gutterActiveForeground: string;
}
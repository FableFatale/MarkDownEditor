// 编辑器核心配置类型
export interface EditorCoreConfig {
  // 基础配置
  fontSize?: number;
  lineHeight?: number;
  tabSize?: number;
  lineNumbers?: boolean;
  lineWrapping?: boolean;
  theme?: 'light' | 'dark';

  // 编辑增强
  autoCloseBrackets?: boolean;
  autoCloseTags?: boolean;
  highlightActiveLine?: boolean;
  highlightSelectionMatches?: boolean;
  indentUnit?: number;
  smartIndent?: boolean;
  spellcheck?: boolean;

  // 性能相关
  maxContentLength?: number;
  virtualScroll?: boolean;
  lazyLoading?: boolean;
}

// 编辑器核心状态类型
export interface EditorCoreState {
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
  isLoading?: boolean;
  isSaving?: boolean;
  hasChanges?: boolean;
}

// 编辑器核心事件处理器类型
export interface EditorCoreEventHandlers {
  onChange?: (content: string) => void;
  onSelectionChange?: (selection: { from: number; to: number }) => void;
  onScroll?: (position: number) => void;
  onSave?: () => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// 编辑器核心API类型
export interface EditorCoreAPI {
  // 内容操作
  getValue: () => string;
  setValue: (content: string) => void;
  insertText: (text: string, position?: number) => void;
  replaceSelection: (text: string) => void;
  getSelection: () => { from: number; to: number };
  setSelection: (from: number, to: number) => void;

  // 历史记录
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  // 视图控制
  focus: () => void;
  blur: () => void;
  scrollTo: (position: number) => void;
  scrollIntoView: (position: number) => void;

  // 配置控制
  setOption: <K extends keyof EditorCoreConfig>(option: K, value: EditorCoreConfig[K]) => void;
  getOption: <K extends keyof EditorCoreConfig>(option: K) => EditorCoreConfig[K];

  // 生命周期
  destroy: () => void;
}

// 编辑器核心主题类型
export interface EditorCoreTheme {
  // 基础颜色
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  selectionMatch: string;

  // 行相关
  lineBackground?: string;
  lineHighlight: string;
  lineNumber?: string;
  lineNumberActive?: string;

  // 语法高亮
  comment: string;
  keyword: string;
  string: string;
  number: string;
  operator: string;
  punctuation: string;

  // 标记
  markdownHeading: string;
  markdownEmphasis: string;
  markdownStrong: string;
  markdownCode: string;
  markdownQuote: string;
  markdownLink: string;

  // 滚动条
  scrollbarThumb: string;
  scrollbarTrack: string;

  // 其他UI元素
  gutterBackground: string;
  gutterForeground: string;
  gutterActiveForeground: string;
  gutterBorder?: string;
}
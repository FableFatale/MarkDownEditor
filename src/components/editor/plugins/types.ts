// 插件基础类型
export interface EditorPlugin {
  id: string;
  name: string;
  description?: string;
  version?: string;
  author?: string;

  // 插件生命周期
  onInit?: () => void | Promise<void>;
  onDestroy?: () => void;

  // 插件配置
  defaultConfig?: Record<string, unknown>;
  validateConfig?: (config: Record<string, unknown>) => boolean;
}

// Markdown语法扩展插件
export interface MarkdownSyntaxPlugin extends EditorPlugin {
  type: 'syntax';
  tokenizer: (stream: string) => { type: string; content: string }[];
  renderer: (tokens: { type: string; content: string }[]) => string;
}

// 工具栏插件
export interface ToolbarPlugin extends EditorPlugin {
  type: 'toolbar';
  icon: string | React.ReactNode;
  tooltip?: string;
  action: () => void;
  shortcut?: string;
  position?: 'left' | 'center' | 'right';
}

// 快捷键插件
export interface ShortcutPlugin extends EditorPlugin {
  type: 'shortcut';
  key: string;
  action: () => void;
  when?: string;
}

// 内容转换插件
export interface ContentTransformPlugin extends EditorPlugin {
  type: 'transform';
  inputFormat: string;
  outputFormat: string;
  transform: (content: string) => string | Promise<string>;
}

// 自动完成插件
export interface AutoCompletePlugin extends EditorPlugin {
  type: 'autocomplete';
  trigger: string | RegExp;
  getSuggestions: (text: string) => Promise<string[]>;
  renderSuggestion?: (suggestion: string) => React.ReactNode;
}

// 实时预览插件
export interface PreviewPlugin extends EditorPlugin {
  type: 'preview';
  render: (markdown: string) => string | React.ReactNode;
  debounce?: number;
}

// 导出插件
export interface ExportPlugin extends EditorPlugin {
  type: 'export';
  format: string;
  export: (content: string) => Promise<Blob>;
  fileExtension: string;
}

// 插件管理器类型
export interface PluginManager {
  // 插件注册和管理
  register: (plugin: EditorPlugin) => void;
  unregister: (pluginId: string) => void;
  getPlugin: (pluginId: string) => EditorPlugin | undefined;
  getAllPlugins: () => EditorPlugin[];

  // 插件配置
  setPluginConfig: (pluginId: string, config: Record<string, unknown>) => void;
  getPluginConfig: (pluginId: string) => Record<string, unknown>;

  // 插件状态
  enablePlugin: (pluginId: string) => void;
  disablePlugin: (pluginId: string) => void;
  isPluginEnabled: (pluginId: string) => boolean;

  // 插件事件
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
}
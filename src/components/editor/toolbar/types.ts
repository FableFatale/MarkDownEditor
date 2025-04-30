// 工具栏项目类型
export type ToolbarItemType =
  | 'button'
  | 'dropdown'
  | 'separator'
  | 'group'
  | 'custom';

// 工具栏操作分类
export type ToolbarActionCategory =
  | 'format'      // 文本格式化
  | 'insert'      // 插入内容
  | 'list'        // 列表操作
  | 'heading'     // 标题操作
  | 'table'       // 表格操作
  | 'media'       // 媒体操作
  | 'view'        // 视图控制
  | 'export'      // 导出操作
  | 'custom';     // 自定义操作

// 工具栏操作类型
export type ToolbarAction =
  // 格式化操作
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'subscript'
  | 'superscript'
  | 'clear-format'

  // 插入操作
  | 'link'
  | 'image'
  | 'table'
  | 'horizontal-rule'
  | 'emoji'
  | 'special-character'
  | 'math-formula'
  | 'code-block'

  // 列表操作
  | 'bullet-list'
  | 'numbered-list'
  | 'task-list'
  | 'indent'
  | 'outdent'

  // 标题操作
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6'

  // 表格操作
  | 'insert-row-above'
  | 'insert-row-below'
  | 'insert-column-left'
  | 'insert-column-right'
  | 'delete-row'
  | 'delete-column'
  | 'merge-cells'
  | 'split-cells'

  // 媒体操作
  | 'image-upload'
  | 'image-by-url'
  | 'video-embed'
  | 'audio-embed'

  // 视图操作
  | 'preview'
  | 'side-by-side'
  | 'fullscreen'
  | 'theme-switch'

  // 导出操作
  | 'export-pdf'
  | 'export-html'
  | 'export-word'
  | 'export-image';

// 工具栏项目基础接口
export interface ToolbarItemBase {
  id: string;
  type: ToolbarItemType;
  category: ToolbarActionCategory;
  title?: string;
  tooltip?: string;
  icon?: string | React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  order?: number;
}

// 工具栏按钮项目
export interface ToolbarButton extends ToolbarItemBase {
  type: 'button';
  action: ToolbarAction;
  shortcut?: string;
  active?: boolean;
  onClick?: () => void;
}

// 工具栏下拉菜单项目
export interface ToolbarDropdown extends ToolbarItemBase {
  type: 'dropdown';
  items: ToolbarButton[];
  selectedItem?: string;
  onChange?: (itemId: string) => void;
}

// 工具栏分组项目
export interface ToolbarGroup extends ToolbarItemBase {
  type: 'group';
  items: (ToolbarButton | ToolbarDropdown)[];
}

// 工具栏分隔符
export interface ToolbarSeparator extends ToolbarItemBase {
  type: 'separator';
}

// 工具栏自定义项目
export interface ToolbarCustomItem extends ToolbarItemBase {
  type: 'custom';
  render: () => React.ReactNode;
}

// 工具栏项目联合类型
export type ToolbarItem =
  | ToolbarButton
  | ToolbarDropdown
  | ToolbarGroup
  | ToolbarSeparator
  | ToolbarCustomItem;

// 工具栏配置接口
export interface ToolbarConfig {
  items: ToolbarItem[];
  position?: 'top' | 'bottom';
  sticky?: boolean;
  floating?: boolean;
  animation?: boolean;
  customClassName?: string;
}

// 工具栏事件处理器接口
export interface ToolbarEventHandlers {
  onAction?: (action: ToolbarAction) => void;
  onButtonClick?: (buttonId: string) => void;
  onDropdownChange?: (dropdownId: string, value: string) => void;
  onVisibilityChange?: (visible: boolean) => void;
}
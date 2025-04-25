// 协同编辑相关的类型定义

export interface CollaborationUser {
  id: string;
  username: string;
  color: string; // 用户光标和选择区域的颜色
  lastActive: Date;
}

export interface CollaborationState {
  isConnected: boolean;
  isCollaborating: boolean;
  error: string | null;
}

// 文本操作类型
export interface TextOperation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  text?: string;
  length?: number;
  userId: string;
  timestamp: Date;
}

// 协作事件类型
export type CollaborationEvent =
  | { type: 'collaborator:joined'; user: CollaborationUser }
  | { type: 'collaborator:left'; userId: string }
  | { type: 'operation:received'; operation: TextOperation }
  | { type: 'selection:updated'; userId: string; range: { from: number; to: number } }
  | { type: 'error'; message: string };

// 操作转换函数类型
export type TransformFunction = (op1: TextOperation, op2: TextOperation) => TextOperation;

// 冲突解决策略
export type ConflictResolution = 'first-wins' | 'last-wins' | 'merge';

// 协作会话配置
export interface CollaborationConfig {
  maxCollaborators?: number;
  conflictResolution?: ConflictResolution;
  cursorColors?: string[];
  heartbeatInterval?: number;
  reconnectAttempts?: number;
}
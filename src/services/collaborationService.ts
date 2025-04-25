import { io, Socket } from 'socket.io-client';
import { authService } from './authService';
import { CollaborationEvent, CollaborationState, CollaborationUser, TextOperation } from '../types/collaboration';

class CollaborationService {
  private socket: Socket | null = null;
  private readonly SERVER_URL = 'https://api.example.com'; // 替换为实际的协作服务器地址
  private collaborators: CollaborationUser[] = [];
  private state: CollaborationState = {
    isConnected: false,
    isCollaborating: false,
    error: null,
  };

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    const token = authService.getToken();
    if (!token) return;

    this.socket = io(this.SERVER_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.state.isConnected = true;
      this.state.error = null;
    });

    this.socket.on('disconnect', () => {
      this.state.isConnected = false;
    });

    this.socket.on('error', (error: Error) => {
      this.state.error = error.message;
    });

    this.socket.on('collaborator:join', (user: CollaborationUser) => {
      this.collaborators.push(user);
      this.emitEvent('collaborator:joined', user);
    });

    this.socket.on('collaborator:leave', (userId: string) => {
      this.collaborators = this.collaborators.filter(u => u.id !== userId);
      this.emitEvent('collaborator:left', { userId });
    });

    this.socket.on('operation', (operation: TextOperation) => {
      this.emitEvent('operation:received', operation);
    });

    this.socket.on('selection', (data: { userId: string; range: { from: number; to: number } }) => {
      this.emitEvent('selection:updated', data);
    });
  }

  private emitEvent(eventName: string, data: any) {
    const event = new CustomEvent<CollaborationEvent>(eventName, { detail: data });
    document.dispatchEvent(event);
  }

  joinSession(documentId: string) {
    if (!this.socket || !this.state.isConnected) {
      throw new Error('未连接到协作服务器');
    }

    this.socket.emit('session:join', { documentId });
    this.state.isCollaborating = true;
  }

  leaveSession(documentId: string) {
    if (!this.socket || !this.state.isConnected) return;

    this.socket.emit('session:leave', { documentId });
    this.state.isCollaborating = false;
    this.collaborators = [];
  }

  sendOperation(operation: TextOperation) {
    if (!this.socket || !this.state.isCollaborating) return;

    this.socket.emit('operation', operation);
  }

  updateSelection(range: { from: number; to: number }) {
    if (!this.socket || !this.state.isCollaborating) return;

    this.socket.emit('selection', { range });
  }

  getCollaborators(): CollaborationUser[] {
    return this.collaborators;
  }

  getState(): CollaborationState {
    return this.state;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.state.isConnected = false;
    this.state.isCollaborating = false;
    this.collaborators = [];
  }
}

export const collaborationService = new CollaborationService();
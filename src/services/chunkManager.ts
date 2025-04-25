import { TextOperation } from '../types/collaboration';

interface TextChunk {
  id: string;
  content: string;
  startOffset: number;
  endOffset: number;
  isLoaded: boolean;
  isDirty: boolean;
}

export class ChunkManager {
  private chunks: TextChunk[] = [];
  private chunkSize: number = 50000; // 每个块约50KB
  private loadedChunks: Set<string> = new Set();
  private dirtyChunks: Set<string> = new Set();

  constructor(initialContent: string = '') {
    if (initialContent) {
      this.initializeChunks(initialContent);
    }
  }

  private initializeChunks(content: string) {
    const totalLength = content.length;
    let offset = 0;

    while (offset < totalLength) {
      const chunkContent = content.slice(offset, offset + this.chunkSize);
      const chunk: TextChunk = {
        id: `chunk-${offset}`,
        content: chunkContent,
        startOffset: offset,
        endOffset: offset + chunkContent.length,
        isLoaded: false,
        isDirty: false
      };
      this.chunks.push(chunk);
      offset += chunkContent.length;
    }
  }

  public getChunkAtOffset(offset: number): TextChunk | null {
    return this.chunks.find(chunk =>
      offset >= chunk.startOffset && offset < chunk.endOffset
    ) || null;
  }

  public async loadChunk(chunkId: string): Promise<void> {
    const chunk = this.chunks.find(c => c.id === chunkId);
    if (!chunk || chunk.isLoaded) return;

    // 模拟从存储加载数据
    await new Promise(resolve => setTimeout(resolve, 50));
    chunk.isLoaded = true;
    this.loadedChunks.add(chunkId);
  }

  public async saveChunk(chunkId: string): Promise<void> {
    const chunk = this.chunks.find(c => c.id === chunkId);
    if (!chunk || !chunk.isDirty) return;

    // 模拟保存到存储
    await new Promise(resolve => setTimeout(resolve, 50));
    chunk.isDirty = false;
    this.dirtyChunks.delete(chunkId);
  }

  public applyOperation(operation: TextOperation) {
    const { offset, text, length } = operation;
    const chunk = this.getChunkAtOffset(offset);
    if (!chunk || !chunk.isLoaded) return false;

    const relativeOffset = offset - chunk.startOffset;
    chunk.content =
      chunk.content.slice(0, relativeOffset) +
      text +
      chunk.content.slice(relativeOffset + length);
    
    chunk.isDirty = true;
    this.dirtyChunks.add(chunk.id);

    // 更新后续块的偏移量
    const deltaLength = text.length - length;
    if (deltaLength !== 0) {
      const chunkIndex = this.chunks.indexOf(chunk);
      for (let i = chunkIndex + 1; i < this.chunks.length; i++) {
        this.chunks[i].startOffset += deltaLength;
        this.chunks[i].endOffset += deltaLength;
      }
    }

    return true;
  }

  public getContent(): string {
    return this.chunks
      .filter(chunk => chunk.isLoaded)
      .map(chunk => chunk.content)
      .join('');
  }

  public async saveAllDirtyChunks(): Promise<void> {
    const savePromises = Array.from(this.dirtyChunks).map(chunkId =>
      this.saveChunk(chunkId)
    );
    await Promise.all(savePromises);
  }

  public getDirtyChunksCount(): number {
    return this.dirtyChunks.size;
  }

  public getLoadedChunksCount(): number {
    return this.loadedChunks.size;
  }

  public getTotalChunksCount(): number {
    return this.chunks.length;
  }
}
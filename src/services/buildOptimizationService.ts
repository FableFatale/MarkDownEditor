// 构建优化服务
export interface BuildStats {
  totalSize: number;
  gzipSize: number;
  brotliSize: number;
  chunks: ChunkInfo[];
  assets: AssetInfo[];
}

export interface ChunkInfo {
  name: string;
  size: number;
  gzipSize?: number;
  modules: string[];
}

export interface AssetInfo {
  name: string;
  size: number;
  type: 'js' | 'css' | 'image' | 'font' | 'other';
}

export interface OptimizationRecommendation {
  type: 'warning' | 'error' | 'info';
  message: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

class BuildOptimizationService {
  private readonly CHUNK_SIZE_WARNING = 500 * 1024; // 500KB
  private readonly CHUNK_SIZE_ERROR = 1024 * 1024; // 1MB
  private readonly TOTAL_SIZE_WARNING = 2 * 1024 * 1024; // 2MB
  private readonly TOTAL_SIZE_ERROR = 5 * 1024 * 1024; // 5MB

  // 分析构建结果
  analyzeBuild(stats: BuildStats): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // 检查总体大小
    recommendations.push(...this.checkTotalSize(stats));

    // 检查单个chunk大小
    recommendations.push(...this.checkChunkSizes(stats.chunks));

    // 检查重复依赖
    recommendations.push(...this.checkDuplicateDependencies(stats.chunks));

    // 检查未使用的依赖
    recommendations.push(...this.checkUnusedDependencies(stats.chunks));

    // 检查资源优化
    recommendations.push(...this.checkAssetOptimization(stats.assets));

    return recommendations;
  }

  private checkTotalSize(stats: BuildStats): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    if (stats.totalSize > this.TOTAL_SIZE_ERROR) {
      recommendations.push({
        type: 'error',
        message: `总构建大小过大: ${this.formatSize(stats.totalSize)}`,
        suggestion: '考虑代码分割、移除未使用的依赖、启用tree-shaking',
        impact: 'high'
      });
    } else if (stats.totalSize > this.TOTAL_SIZE_WARNING) {
      recommendations.push({
        type: 'warning',
        message: `总构建大小较大: ${this.formatSize(stats.totalSize)}`,
        suggestion: '建议优化代码分割和依赖管理',
        impact: 'medium'
      });
    }

    // 检查压缩效果
    const compressionRatio = stats.gzipSize / stats.totalSize;
    if (compressionRatio > 0.8) {
      recommendations.push({
        type: 'warning',
        message: `Gzip压缩效果不佳: ${(compressionRatio * 100).toFixed(1)}%`,
        suggestion: '检查是否有大量重复代码或未压缩的资源',
        impact: 'medium'
      });
    }

    return recommendations;
  }

  private checkChunkSizes(chunks: ChunkInfo[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    chunks.forEach(chunk => {
      if (chunk.size > this.CHUNK_SIZE_ERROR) {
        recommendations.push({
          type: 'error',
          message: `Chunk "${chunk.name}" 过大: ${this.formatSize(chunk.size)}`,
          suggestion: '将此chunk进一步分割或移除不必要的依赖',
          impact: 'high'
        });
      } else if (chunk.size > this.CHUNK_SIZE_WARNING) {
        recommendations.push({
          type: 'warning',
          message: `Chunk "${chunk.name}" 较大: ${this.formatSize(chunk.size)}`,
          suggestion: '考虑优化此chunk的内容',
          impact: 'medium'
        });
      }
    });

    return recommendations;
  }

  private checkDuplicateDependencies(chunks: ChunkInfo[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    const moduleCount = new Map<string, number>();

    // 统计模块出现次数
    chunks.forEach(chunk => {
      chunk.modules.forEach(module => {
        moduleCount.set(module, (moduleCount.get(module) || 0) + 1);
      });
    });

    // 查找重复模块
    const duplicates = Array.from(moduleCount.entries())
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1]);

    if (duplicates.length > 0) {
      const topDuplicates = duplicates.slice(0, 5);
      recommendations.push({
        type: 'warning',
        message: `发现 ${duplicates.length} 个重复依赖`,
        suggestion: `优化代码分割配置，主要重复模块: ${topDuplicates.map(([name]) => name).join(', ')}`,
        impact: 'medium'
      });
    }

    return recommendations;
  }

  private checkUnusedDependencies(chunks: ChunkInfo[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    // 这里可以添加检查未使用依赖的逻辑
    // 需要结合package.json和实际使用情况

    return recommendations;
  }

  private checkAssetOptimization(assets: AssetInfo[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // 检查图片资源
    const images = assets.filter(asset => asset.type === 'image');
    const largeImages = images.filter(img => img.size > 100 * 1024); // 100KB

    if (largeImages.length > 0) {
      recommendations.push({
        type: 'info',
        message: `发现 ${largeImages.length} 个大图片文件`,
        suggestion: '考虑压缩图片或使用WebP格式',
        impact: 'medium'
      });
    }

    // 检查字体文件
    const fonts = assets.filter(asset => asset.type === 'font');
    if (fonts.length > 5) {
      recommendations.push({
        type: 'info',
        message: `字体文件较多: ${fonts.length} 个`,
        suggestion: '考虑减少字体变体或使用字体子集',
        impact: 'low'
      });
    }

    return recommendations;
  }

  // 生成优化建议
  generateOptimizationPlan(recommendations: OptimizationRecommendation[]): string {
    const highPriority = recommendations.filter(r => r.impact === 'high');
    const mediumPriority = recommendations.filter(r => r.impact === 'medium');
    const lowPriority = recommendations.filter(r => r.impact === 'low');

    let plan = '# 构建优化计划\n\n';

    if (highPriority.length > 0) {
      plan += '## 🔴 高优先级问题\n\n';
      highPriority.forEach((rec, index) => {
        plan += `${index + 1}. **${rec.message}**\n`;
        plan += `   - 建议: ${rec.suggestion}\n\n`;
      });
    }

    if (mediumPriority.length > 0) {
      plan += '## 🟡 中优先级问题\n\n';
      mediumPriority.forEach((rec, index) => {
        plan += `${index + 1}. **${rec.message}**\n`;
        plan += `   - 建议: ${rec.suggestion}\n\n`;
      });
    }

    if (lowPriority.length > 0) {
      plan += '## 🟢 低优先级优化\n\n';
      lowPriority.forEach((rec, index) => {
        plan += `${index + 1}. **${rec.message}**\n`;
        plan += `   - 建议: ${rec.suggestion}\n\n`;
      });
    }

    if (recommendations.length === 0) {
      plan += '✅ 构建已经很好地优化了！\n';
    }

    return plan;
  }

  // 格式化文件大小
  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  // 计算压缩比
  calculateCompressionRatio(originalSize: number, compressedSize: number): number {
    return ((originalSize - compressedSize) / originalSize) * 100;
  }

  // 预估加载时间
  estimateLoadTime(sizeInBytes: number, connectionSpeed: 'slow-3g' | 'fast-3g' | '4g' | 'wifi'): number {
    const speeds = {
      'slow-3g': 50 * 1024, // 50 KB/s
      'fast-3g': 150 * 1024, // 150 KB/s
      '4g': 1.5 * 1024 * 1024, // 1.5 MB/s
      'wifi': 10 * 1024 * 1024 // 10 MB/s
    };

    return sizeInBytes / speeds[connectionSpeed];
  }

  // 生成性能报告
  generatePerformanceReport(stats: BuildStats): string {
    const recommendations = this.analyzeBuild(stats);
    
    let report = '# 构建性能报告\n\n';
    
    report += '## 📊 构建统计\n\n';
    report += `- **总大小**: ${this.formatSize(stats.totalSize)}\n`;
    report += `- **Gzip压缩后**: ${this.formatSize(stats.gzipSize)} (${this.calculateCompressionRatio(stats.totalSize, stats.gzipSize).toFixed(1)}% 压缩)\n`;
    report += `- **Brotli压缩后**: ${this.formatSize(stats.brotliSize)} (${this.calculateCompressionRatio(stats.totalSize, stats.brotliSize).toFixed(1)}% 压缩)\n`;
    report += `- **Chunk数量**: ${stats.chunks.length}\n`;
    report += `- **资源文件数量**: ${stats.assets.length}\n\n`;

    report += '## ⏱️ 预估加载时间\n\n';
    report += `- **慢速3G**: ${this.estimateLoadTime(stats.gzipSize, 'slow-3g').toFixed(1)}秒\n`;
    report += `- **快速3G**: ${this.estimateLoadTime(stats.gzipSize, 'fast-3g').toFixed(1)}秒\n`;
    report += `- **4G**: ${this.estimateLoadTime(stats.gzipSize, '4g').toFixed(1)}秒\n`;
    report += `- **WiFi**: ${this.estimateLoadTime(stats.gzipSize, 'wifi').toFixed(1)}秒\n\n`;

    report += this.generateOptimizationPlan(recommendations);

    return report;
  }
}

export const buildOptimizationService = new BuildOptimizationService();

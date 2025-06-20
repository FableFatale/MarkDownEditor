import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import {
  PhotoIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';

interface ImageCompressorProps {
  isOpen: boolean;
  onClose: () => void;
  onImageInsert?: (imageUrl: string, altText?: string) => void;
}

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}

interface CompressedImage {
  original: File;
  compressed: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  originalUrl: string;
  compressedUrl: string;
}

const ImageCompressor: React.FC<ImageCompressorProps> = ({
  isOpen,
  onClose,
  onImageInsert,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [compressionOptions, setCompressionOptions] = useState<CompressionOptions>({
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: 0.8,
    format: 'jpeg',
  });
  const [showSettings, setShowSettings] = useState(false);

  // 处理文件拖拽
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      compressImages(imageFiles);
    }
  }, []);

  // 处理文件选择
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      compressImages(files);
    }
  }, []);

  // 压缩图片
  const compressImages = async (files: File[]) => {
    setIsCompressing(true);
    const results: CompressedImage[] = [];

    for (const file of files) {
      try {
        const options = {
          maxSizeMB: compressionOptions.maxSizeMB,
          maxWidthOrHeight: compressionOptions.maxWidthOrHeight,
          useWebWorker: compressionOptions.useWebWorker,
          initialQuality: compressionOptions.quality,
        };

        const compressedFile = await imageCompression(file, options);
        
        // 如果指定了格式转换
        let finalFile = compressedFile;
        if (compressionOptions.format !== 'jpeg' || !file.type.includes('jpeg')) {
          finalFile = await convertImageFormat(compressedFile, compressionOptions.format);
        }

        const originalUrl = URL.createObjectURL(file);
        const compressedUrl = URL.createObjectURL(finalFile);
        
        const compressionRatio = ((file.size - finalFile.size) / file.size) * 100;

        results.push({
          original: file,
          compressed: finalFile,
          originalSize: file.size,
          compressedSize: finalFile.size,
          compressionRatio,
          originalUrl,
          compressedUrl,
        });
      } catch (error) {
        console.error('压缩失败:', error);
      }
    }

    setCompressedImages(prev => [...prev, ...results]);
    setIsCompressing(false);
  };

  // 格式转换
  const convertImageFormat = async (file: File, format: string): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], `${file.name.split('.')[0]}.${format}`, {
              type: `image/${format}`,
            });
            resolve(newFile);
          } else {
            resolve(file);
          }
        }, `image/${format}`, format === 'jpeg' ? 0.9 : undefined);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // 下载压缩后的图片
  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a');
    link.href = image.compressedUrl;
    link.download = `compressed_${image.compressed.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 复制图片到剪贴板
  const copyImageToClipboard = async (image: CompressedImage) => {
    try {
      const response = await fetch(image.compressedUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      // 这里可以显示成功提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 插入到编辑器
  const insertToEditor = (image: CompressedImage) => {
    if (onImageInsert) {
      onImageInsert(image.compressedUrl, image.original.name);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 清除所有图片
  const clearAll = () => {
    compressedImages.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
      URL.revokeObjectURL(image.compressedUrl);
    });
    setCompressedImages([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* 对话框 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <PhotoIcon className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    图片压缩工具
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="压缩设置"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                  </motion.button>
                  {compressedImages.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAll}
                      className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      清除全部
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* 设置面板 */}
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        最大文件大小 (MB)
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={compressionOptions.maxSizeMB}
                        onChange={(e) => setCompressionOptions(prev => ({
                          ...prev,
                          maxSizeMB: parseFloat(e.target.value)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        最大尺寸 (px)
                      </label>
                      <input
                        type="number"
                        min="100"
                        max="4000"
                        step="100"
                        value={compressionOptions.maxWidthOrHeight}
                        onChange={(e) => setCompressionOptions(prev => ({
                          ...prev,
                          maxWidthOrHeight: parseInt(e.target.value)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        质量 (0-1)
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={compressionOptions.quality}
                        onChange={(e) => setCompressionOptions(prev => ({
                          ...prev,
                          quality: parseFloat(e.target.value)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        输出格式
                      </label>
                      <select
                        value={compressionOptions.format}
                        onChange={(e) => setCompressionOptions(prev => ({
                          ...prev,
                          format: e.target.value as any
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 内容区域 */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {/* 上传区域 */}
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${dragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    拖拽图片到这里或点击选择
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    支持 JPG、PNG、WebP 格式
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    选择图片
                  </label>
                </div>

                {/* 压缩进度 */}
                {isCompressing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      <span className="text-blue-700 dark:text-blue-400">正在压缩图片...</span>
                    </div>
                  </motion.div>
                )}

                {/* 压缩结果 */}
                {compressedImages.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      压缩结果
                    </h3>
                    <div className="space-y-4">
                      {compressedImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-start space-x-4">
                            {/* 预览图 */}
                            <div className="flex space-x-2">
                              <img
                                src={image.originalUrl}
                                alt="原图"
                                className="w-16 h-16 object-cover rounded border"
                              />
                              <img
                                src={image.compressedUrl}
                                alt="压缩后"
                                className="w-16 h-16 object-cover rounded border"
                              />
                            </div>
                            
                            {/* 信息 */}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {image.original.name}
                              </h4>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <div>原始大小: {formatFileSize(image.originalSize)}</div>
                                <div>压缩后: {formatFileSize(image.compressedSize)}</div>
                                <div className="flex items-center space-x-2">
                                  <span>压缩率: {image.compressionRatio.toFixed(1)}%</span>
                                  {image.compressionRatio > 0 ? (
                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* 操作按钮 */}
                            <div className="flex flex-col space-y-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => downloadImage(image)}
                                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                <span>下载</span>
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyImageToClipboard(image)}
                                className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                              >
                                <ClipboardDocumentIcon className="w-4 h-4" />
                                <span>复制</span>
                              </motion.button>
                              
                              {onImageInsert && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => insertToEditor(image)}
                                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                  <span>插入</span>
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImageCompressor;

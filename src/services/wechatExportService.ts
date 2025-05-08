/**
 * 微信公众号导出服务
 * 提供将Markdown转换为微信公众号兼容HTML的功能
 */

import { marked } from 'marked';

export interface WechatStyleOptions {
  titleColor: string;
  titleSize: string;
  subtitleColor: string;
  subtitleSize: string;
  textColor: string;
  textSize: string;
  lineHeight: string;
  linkColor: string;
  useRoundedImages: boolean;
  useImageShadow: boolean;
}

// 默认样式选项
export const defaultWechatStyles: WechatStyleOptions = {
  titleColor: '#2c3e50',
  titleSize: '24px',
  subtitleColor: '#555555',
  subtitleSize: '18px',
  textColor: '#333333',
  textSize: '16px',
  lineHeight: '1.75',
  linkColor: '#1e88e5',
  useRoundedImages: true,
  useImageShadow: true,
};

/**
 * 将Markdown转换为微信公众号兼容的HTML
 * @param markdown Markdown文本
 * @param styleOptions 样式选项
 * @returns 转换后的HTML
 */
export const convertMarkdownToWechatHTML = (markdown: string, styleOptions: WechatStyleOptions = defaultWechatStyles): string => {
  try {
    // 配置marked选项
    marked.setOptions({
      gfm: true, // 启用GitHub风格Markdown
      breaks: true, // 允许回车换行
      sanitize: false, // 不进行HTML标签过滤
    });
    
    // 转换Markdown为HTML
    let html = marked(markdown);
    
    // 应用微信公众号兼容的样式
    html = applyWechatStyles(html, styleOptions);
    
    return html;
  } catch (error) {
    console.error('转换Markdown到微信HTML失败:', error);
    throw new Error('转换失败，请检查Markdown内容');
  }
};

/**
 * 应用微信公众号兼容的样式
 * @param html 原始HTML
 * @param options 样式选项
 * @returns 应用样式后的HTML
 */
const applyWechatStyles = (html: string, options: WechatStyleOptions): string => {
  // 替换标题样式
  html = html.replace(/<h1>/g, `<h1 style="font-size:${options.titleSize}; color:${options.titleColor}; line-height:1.2; letter-spacing:1px; text-align:center; margin:0.5em 0;">`);
  html = html.replace(/<h2>/g, `<h2 style="font-size:${options.subtitleSize}; color:${options.subtitleColor}; line-height:1.3; text-align:center; margin:0 0 1em 0;">`);
  html = html.replace(/<h3>/g, `<h3 style="font-size:${parseInt(options.textSize) + 2}px; color:${options.titleColor}; line-height:1.5; margin:1.5em 0 0.8em;">`);
  html = html.replace(/<h4>/g, `<h4 style="font-size:${parseInt(options.textSize) + 1}px; color:${options.titleColor}; line-height:1.5; margin:1.5em 0 0.8em;">`);
  html = html.replace(/<h5>/g, `<h5 style="font-size:${options.textSize}; color:${options.titleColor}; line-height:1.5; margin:1.5em 0 0.8em;">`);
  html = html.replace(/<h6>/g, `<h6 style="font-size:${options.textSize}; color:${options.titleColor}; line-height:1.5; margin:1.5em 0 0.8em;">`);
  
  // 替换段落样式
  html = html.replace(/<p>/g, `<p style="font-size:${options.textSize}; color:${options.textColor}; line-height:${options.lineHeight}; letter-spacing:0.5px; margin:0 0 1em 0;">`);
  
  // 替换链接样式
  html = html.replace(/<a\s+href="([^"]+)">/g, `<a href="$1" style="color:${options.linkColor}; text-decoration:underline;">`);
  
  // 替换图片样式
  const imageStyle = options.useRoundedImages && options.useImageShadow
    ? `style="max-width:100%; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.15);"`
    : options.useRoundedImages
      ? `style="max-width:100%; border-radius:8px;"`
      : options.useImageShadow
        ? `style="max-width:100%; box-shadow:0 4px 6px rgba(0,0,0,0.15);"`
        : `style="max-width:100%;"`;
  
  html = html.replace(/<img\s+src="([^"]+)"\s+alt="([^"]*)"/g, `<p style="text-align:center; margin:1.5em 0;"><img src="$1" alt="$2" ${imageStyle} /></p>`);
  
  // 替换列表样式
  html = html.replace(/<ul>/g, `<ul style="font-size:${options.textSize}; color:${options.textColor}; line-height:${options.lineHeight}; margin:0 0 1em 0; padding-left:2em;">`);
  html = html.replace(/<ol>/g, `<ol style="font-size:${options.textSize}; color:${options.textColor}; line-height:${options.lineHeight}; margin:0 0 1em 0; padding-left:2em;">`);
  html = html.replace(/<li>/g, `<li style="margin-bottom:0.5em;">`);
  
  // 替换引用样式
  html = html.replace(/<blockquote>/g, `<blockquote style="border-left:4px solid #ddd; padding-left:1em; margin:0 0 1em 0; color:#666;">`);
  
  // 替换代码块样式
  html = html.replace(/<pre><code>/g, `<pre style="background-color:#f6f8fa; border-radius:5px; padding:1em; overflow:auto; margin:0 0 1em 0; font-family:monospace; font-size:14px; line-height:1.5;"><code>`);
  
  // 替换行内代码样式
  html = html.replace(/<code>/g, `<code style="background-color:#f6f8fa; border-radius:3px; padding:0.2em 0.4em; font-family:monospace; font-size:0.9em;">`);
  
  return html;
};

/**
 * 获取微信公众号HTML/CSS支持的说明信息
 * @returns 支持信息对象
 */
export const getWechatSupportInfo = () => {
  return {
    supportedTags: [
      { name: '段落和标题', tags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      { name: '文本修饰', tags: ['strong', 'b', 'em', 'i', 'u', 'br'] },
      { name: '列表', tags: ['ul', 'ol', 'li'] },
      { name: '链接', tags: ['a'] },
      { name: '图像', tags: ['img'] },
      { name: '微信特定媒体标签', tags: ['mpvoice', 'mpvideo'] },
    ],
    supportedStyles: [
      { name: '文本样式', styles: ['font-size', 'color', 'font-weight', 'font-style'] },
      { name: '段落间距', styles: ['margin', 'padding', 'line-height'] },
      { name: '字间距', styles: ['letter-spacing'] },
      { name: '对齐与显示', styles: ['text-align', 'display', 'vertical-align'] },
      { name: '颜色和背景', styles: ['color', 'background-color'] },
      { name: '图像样式', styles: ['border', 'border-radius', 'box-shadow'] },
    ],
    unsupportedFeatures: [
      { name: '脚本和外部内容', features: ['script', 'iframe', 'object', 'embed', 'form'] },
      { name: '全局样式和选择器', features: ['style标签', 'CSS选择器', '媒体查询', '关键帧动画'] },
      { name: '定位和布局', features: ['position (absolute, fixed, relative)', 'z-index'] },
      { name: '元素ID', features: ['所有HTML元素的id属性会被删除'] },
      { name: 'CSS变换和动画', features: ['transform', 'transition', 'animation'] },
    ],
    recommendations: [
      '所有样式必须内联在元素的style属性中',
      '避免使用复杂的CSS3特性',
      '图片建议上传到微信素材库后获取链接',
      '导出后在微信编辑器中预览，确认样式效果',
    ],
  };
};
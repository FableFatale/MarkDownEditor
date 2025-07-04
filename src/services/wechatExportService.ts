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
 * @param convertLinksToFootnotes 是否将外链转换为脚注
 * @returns 转换后的HTML
 */
export const convertMarkdownToWechatHTML = (
  markdown: string,
  styleOptions: WechatStyleOptions = defaultWechatStyles,
  convertLinksToFootnotes: boolean = true
): string => {
  try {
    // 配置marked选项
    marked.setOptions({
      gfm: true, // 启用GitHub风格Markdown
      breaks: true, // 允许回车换行
      sanitize: false, // 不进行HTML标签过滤
    });

    // 处理外链转脚注
    let processedMarkdown = markdown;
    let footnotes: string[] = [];

    if (convertLinksToFootnotes) {
      const result = convertExternalLinksToFootnotes(markdown);
      processedMarkdown = result.content;
      footnotes = result.footnotes;
    }

    // 转换Markdown为HTML
    let html = marked(processedMarkdown);

    // 过滤不支持的HTML标签和属性
    html = filterUnsupportedHtml(html);

    // 应用微信公众号兼容的样式
    html = applyWechatStyles(html, styleOptions);

    // 添加脚注
    if (footnotes.length > 0) {
      html = addFootnotesToHTML(html, footnotes, styleOptions);
    }

    // 最终清理，确保HTML符合微信公众号要求
    html = finalCleanup(html);

    return html;
  } catch (error) {
    console.error('转换Markdown到微信HTML失败:', error);
    throw new Error('转换失败，请检查Markdown内容');
  }
};

/**
 * 将外部链接转换为脚注
 * @param markdown 原始Markdown内容
 * @returns 处理后的内容和脚注列表
 */
const convertExternalLinksToFootnotes = (markdown: string): { content: string; footnotes: string[] } => {
  const footnotes: string[] = [];
  let footnoteIndex = 1;

  // 匹配Markdown链接格式 [文本](URL)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  const processedContent = markdown.replace(linkRegex, (match, text, url) => {
    // 判断是否为外部链接
    if (isExternalLink(url)) {
      footnotes.push(url);
      return `${text}[${footnoteIndex++}]`;
    }
    // 内部链接保持原样
    return match;
  });

  return {
    content: processedContent,
    footnotes
  };
};

/**
 * 判断是否为外部链接
 * @param url 链接地址
 * @returns 是否为外部链接
 */
const isExternalLink = (url: string): boolean => {
  // 排除相对路径和锚点链接
  if (url.startsWith('#') || url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return false;
  }

  // 排除邮箱链接
  if (url.startsWith('mailto:')) {
    return false;
  }

  // 排除电话链接
  if (url.startsWith('tel:')) {
    return false;
  }

  // 检查是否为HTTP/HTTPS链接
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * 将脚注添加到HTML内容中
 * @param html 原始HTML
 * @param footnotes 脚注列表
 * @param styleOptions 样式选项
 * @returns 添加脚注后的HTML
 */
const addFootnotesToHTML = (html: string, footnotes: string[], styleOptions: WechatStyleOptions): string => {
  if (footnotes.length === 0) {
    return html;
  }

  // 创建脚注HTML
  let footnotesHTML = `
    <div style="margin-top: 2em; padding-top: 1em; border-top: 1px solid #e0e0e0;">
      <h4 style="font-size: ${parseInt(styleOptions.textSize) + 2}px; color: ${styleOptions.subtitleColor}; margin-bottom: 1em;">参考链接</h4>
  `;

  footnotes.forEach((url, index) => {
    footnotesHTML += `
      <p style="font-size: ${parseInt(styleOptions.textSize) - 1}px; color: ${styleOptions.textColor}; line-height: 1.5; margin: 0.5em 0; word-break: break-all;">
        [${index + 1}] ${url}
      </p>
    `;
  });

  footnotesHTML += '</div>';

  return html + footnotesHTML;
};

/**
 * 最终清理HTML，确保完全符合微信公众号要求
 * @param html 处理后的HTML
 * @returns 最终清理后的HTML
 */
const finalCleanup = (html: string): string => {
  // 移除空标签
  html = html.replace(/<(\w+)>\s*<\/\1>/g, '');
  
  // 确保所有图片都有alt属性
  html = html.replace(/<img([^>]*)alt=""([^>]*)>/g, '<img$1alt="图片"$2>');
  
  // 移除可能导致问题的注释
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // 确保链接在新窗口打开（微信会自动处理，但为了完整性添加）
  html = html.replace(/<a([^>]*)>/g, '<a$1 target="_blank">');
  
  // 移除多余的空格和换行，减小HTML体积
  html = html.replace(/\s{2,}/g, ' ');
  
  return html;
};

/**
 * 过滤微信公众号不支持的HTML标签和属性
 * @param html 原始HTML
 * @returns 过滤后的HTML
 */
const filterUnsupportedHtml = (html: string): string => {
  // 移除不支持的标签（script, iframe, object, embed, form, input等）
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  html = html.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  html = html.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  html = html.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');
  html = html.replace(/<input\b[^<]*\/?>/gi, '');
  html = html.replace(/<audio\b[^<]*(?:(?!<\/audio>)<[^<]*)*<\/audio>/gi, '');
  html = html.replace(/<video\b[^<]*(?:(?!<\/video>)<[^<]*)*<\/video>/gi, '');
  
  // 移除所有id属性（微信会删除id属性）
  html = html.replace(/\sid="[^"]*"/gi, '');
  
  // 移除不支持的CSS属性（position, z-index, transform等）
  html = html.replace(/position\s*:\s*absolute|position\s*:\s*fixed|position\s*:\s*relative/gi, '');
  html = html.replace(/z-index\s*:\s*[^;"]+/gi, '');
  html = html.replace(/transform\s*:\s*[^;"]+/gi, '');
  html = html.replace(/transition\s*:\s*[^;"]+/gi, '');
  html = html.replace(/animation\s*:\s*[^;"]+/gi, '');
  
  // 处理百分比高度值（微信中可能不生效）
  html = html.replace(/height\s*:\s*(\d+)%/gi, '');
  html = html.replace(/margin-top\s*:\s*-\d+%/gi, '');
  html = html.replace(/margin-bottom\s*:\s*-\d+%/gi, '');
  
  // 移除可能导致问题的float属性（在某些情况下可能导致布局问题）
  // 注意：不完全移除float，只在可能有问题的情况下处理
  html = html.replace(/style="([^"]*)float\s*:\s*[^;"]+;\s*([^"]*)height/gi, 'style="$1$2height');
  html = html.replace(/style="([^"]*)float\s*:\s*[^;"]+;\s*([^"]*)position/gi, 'style="$1$2position');
  
  // 移除事件处理属性（onclick等）
  html = html.replace(/\son\w+="[^"]*"/gi, '');
  
  // 清理空样式属性和连续分号
  html = html.replace(/style="\s*"/gi, '');
  html = html.replace(/style="([^"]*);\s*;\s*([^"]*)"/gi, 'style="$1;$2"');
  html = html.replace(/style="([^"]*);\s*"/gi, 'style="$1"');
  
  return html;
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
  
  // 替换图片样式 - 确保图片居中且样式符合微信要求
  const imageStyle = options.useRoundedImages && options.useImageShadow
    ? `style="max-width:100%; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.15);"`
    : options.useRoundedImages
      ? `style="max-width:100%; border-radius:8px;"`
      : options.useImageShadow
        ? `style="max-width:100%; box-shadow:0 4px 6px rgba(0,0,0,0.15);"`
        : `style="max-width:100%;"`;
  
  // 替换图片标签，确保图片居中显示并符合微信要求
  html = html.replace(/<img\s+src="([^"]+)"\s+alt="([^"]*)"/g, `<p style="text-align:center; margin:1.5em 0;"><img src="$1" alt="$2" ${imageStyle} /></p>`);
  
  // 处理可能存在的其他格式的图片标签
  html = html.replace(/<img\s+src="([^"]+)"/g, (match, src) => {
    if (match.includes('alt=')) return match; // 已经处理过的图片
    return `<p style="text-align:center; margin:1.5em 0;"><img src="${src}" alt="" ${imageStyle} /></p>`;
  });
  
  // 替换列表样式
  html = html.replace(/<ul>/g, `<ul style="font-size:${options.textSize}; color:${options.textColor}; line-height:${options.lineHeight}; margin:0 0 1em 0; padding-left:2em;">`);
  html = html.replace(/<ol>/g, `<ol style="font-size:${options.textSize}; color:${options.textColor}; line-height:${options.lineHeight}; margin:0 0 1em 0; padding-left:2em;">`);
  html = html.replace(/<li>/g, `<li style="margin-bottom:0.5em;">`);
  
  // 替换引用样式
  html = html.replace(/<blockquote>/g, `<blockquote style="border-left:4px solid #ddd; padding-left:1em; margin:0 0 1em 0; color:#666;">`);
  
  // 替换代码块样式 - 确保在微信中正确显示
  html = html.replace(/<pre><code>/g, `<pre style="background-color:#f6f8fa; border-radius:5px; padding:1em; overflow:auto; margin:0 0 1em 0; font-size:14px; line-height:1.5;"><code>`);
  
  // 替换行内代码样式 - 移除可能不兼容的font-family
  html = html.replace(/<code>/g, `<code style="background-color:#f6f8fa; border-radius:3px; padding:0.2em 0.4em; font-size:0.9em;">`);
  
  // 处理表格样式，确保在微信中正确显示
  html = html.replace(/<table>/g, `<table style="border-collapse:collapse; width:100%; margin:0 0 1em 0;">`);
  html = html.replace(/<th>/g, `<th style="border:1px solid #ddd; padding:8px; text-align:left; background-color:#f6f8fa;">`);
  html = html.replace(/<td>/g, `<td style="border:1px solid #ddd; padding:8px;">`);
  
  return html;
};

/**
 * 预览外链转脚注的效果
 * @param markdown 原始Markdown内容
 * @returns 预览信息
 */
export const previewFootnoteConversion = (markdown: string) => {
  const result = convertExternalLinksToFootnotes(markdown);

  return {
    originalLinkCount: (markdown.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length,
    externalLinkCount: result.footnotes.length,
    processedContent: result.content,
    footnotes: result.footnotes,
    hasExternalLinks: result.footnotes.length > 0
  };
};

/**
 * 批量处理多个Markdown文件的外链转脚注
 * @param markdownFiles Markdown文件内容数组
 * @param styleOptions 样式选项
 * @returns 处理结果数组
 */
export const batchConvertToWechatHTML = (
  markdownFiles: string[],
  styleOptions: WechatStyleOptions = defaultWechatStyles
): Array<{ html: string; footnoteCount: number; success: boolean; error?: string }> => {
  return markdownFiles.map((markdown, index) => {
    try {
      const html = convertMarkdownToWechatHTML(markdown, styleOptions, true);
      const preview = previewFootnoteConversion(markdown);

      return {
        html,
        footnoteCount: preview.externalLinkCount,
        success: true
      };
    } catch (error) {
      return {
        html: '',
        footnoteCount: 0,
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  });
};

/**
 * 生成微信公众号样式预设
 * @returns 样式预设数组
 */
export const getWechatStylePresets = (): Array<{ name: string; description: string; styles: WechatStyleOptions }> => {
  return [
    {
      name: '经典黑白',
      description: '简洁的黑白配色，适合正式文章',
      styles: {
        ...defaultWechatStyles,
        titleColor: '#2c3e50',
        subtitleColor: '#34495e',
        textColor: '#2c3e50',
        linkColor: '#3498db'
      }
    },
    {
      name: '温暖橙色',
      description: '温暖的橙色调，适合生活类文章',
      styles: {
        ...defaultWechatStyles,
        titleColor: '#e67e22',
        subtitleColor: '#d35400',
        textColor: '#2c3e50',
        linkColor: '#e74c3c'
      }
    },
    {
      name: '清新绿色',
      description: '清新的绿色调，适合科技类文章',
      styles: {
        ...defaultWechatStyles,
        titleColor: '#27ae60',
        subtitleColor: '#2ecc71',
        textColor: '#2c3e50',
        linkColor: '#16a085'
      }
    },
    {
      name: '优雅紫色',
      description: '优雅的紫色调，适合文艺类文章',
      styles: {
        ...defaultWechatStyles,
        titleColor: '#8e44ad',
        subtitleColor: '#9b59b6',
        textColor: '#2c3e50',
        linkColor: '#e74c3c'
      }
    },
    {
      name: '商务蓝色',
      description: '专业的蓝色调，适合商务类文章',
      styles: {
        ...defaultWechatStyles,
        titleColor: '#2980b9',
        subtitleColor: '#3498db',
        textColor: '#2c3e50',
        linkColor: '#e74c3c'
      }
    }
  ];
};

/**
 * 验证微信公众号HTML内容
 * @param html HTML内容
 * @returns 验证结果
 */
export const validateWechatHTML = (html: string) => {
  const issues: Array<{ type: 'warning' | 'error'; message: string; suggestion: string }> = [];

  // 检查是否包含不支持的标签
  const unsupportedTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'audio', 'video'];
  unsupportedTags.forEach(tag => {
    const regex = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
    if (regex.test(html)) {
      issues.push({
        type: 'error',
        message: `包含不支持的标签: ${tag}`,
        suggestion: `移除所有 <${tag}> 标签`
      });
    }
  });

  // 检查是否包含外部链接
  const externalLinkRegex = /<a\s+href="(https?:\/\/[^"]+)"/gi;
  const externalLinks = html.match(externalLinkRegex);
  if (externalLinks && externalLinks.length > 0) {
    issues.push({
      type: 'warning',
      message: `包含 ${externalLinks.length} 个外部链接`,
      suggestion: '考虑将外部链接转换为脚注'
    });
  }

  // 检查图片链接
  const imageRegex = /<img\s+src="([^"]+)"/gi;
  let match;
  while ((match = imageRegex.exec(html)) !== null) {
    const src = match[1];
    if (src.startsWith('http') && !src.includes('mmbiz.qpic.cn')) {
      issues.push({
        type: 'warning',
        message: '包含外部图片链接',
        suggestion: '建议将图片上传到微信素材库'
      });
    }
  }

  // 检查HTML长度
  if (html.length > 200000) {
    issues.push({
      type: 'warning',
      message: 'HTML内容过长',
      suggestion: '考虑分割为多篇文章'
    });
  }

  return {
    isValid: issues.filter(issue => issue.type === 'error').length === 0,
    issues,
    wordCount: html.replace(/<[^>]*>/g, '').length,
    htmlSize: html.length
  };
};

/**
 * 获取微信公众号HTML/CSS支持的说明信息
 * @returns 支持信息对象
 */
export const getWechatSupportInfo = () => {
  return {
    supportedTags: [
      { name: '段落和标题', tags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      { name: '文本修饰', tags: ['strong', 'b', 'em', 'i', 'u', 'br', 'span'] },
      { name: '列表', tags: ['ul', 'ol', 'li'] },
      { name: '链接', tags: ['a'] },
      { name: '图像', tags: ['img'] },
      { name: '表格', tags: ['table', 'thead', 'tbody', 'tr', 'th', 'td'] },
      { name: '引用和代码', tags: ['blockquote', 'pre', 'code'] },
      { name: '微信特定媒体标签', tags: ['mpvoice', 'mpvideo'] },
    ],
    supportedStyles: [
      { name: '文本样式', styles: ['font-size', 'color', 'font-weight', 'font-style', 'text-decoration'] },
      { name: '段落间距', styles: ['margin', 'padding', 'line-height'] },
      { name: '字间距', styles: ['letter-spacing'] },
      { name: '对齐与显示', styles: ['text-align', 'display', 'vertical-align'] },
      { name: '颜色和背景', styles: ['color', 'background-color', 'opacity'] },
      { name: '图像样式', styles: ['border', 'border-radius', 'box-shadow', 'max-width'] },
      { name: '表格样式', styles: ['border-collapse', 'width', 'border'] },
    ],
    unsupportedFeatures: [
      { name: '脚本和外部内容', features: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'audio', 'video'] },
      { name: '全局样式和选择器', features: ['style标签', 'CSS选择器', '媒体查询(@media)', '关键帧动画(@keyframes)'] },
      { name: '定位和布局', features: ['position (absolute, fixed, relative)', 'z-index', '百分比高度值'] },
      { name: '元素ID和事件', features: ['所有HTML元素的id属性会被删除', '所有事件处理属性(onclick等)会被移除'] },
      { name: 'CSS变换和动画', features: ['transform', 'transition', 'animation', '部分CSS3特性在不同设备上表现不一致'] },
      { name: '外部资源', features: ['外部字体', '外部CSS文件', '外部JavaScript文件'] },
    ],
    recommendations: [
      '所有样式必须内联在元素的style属性中，不能使用<style>标签',
      '避免使用复杂的CSS3特性，优先使用基础样式确保兼容性',
      '图片建议上传到微信素材库后获取链接，避免使用外链或Base64编码',
      '使用像素(px)或视口单位(vw, vh)控制尺寸，避免使用百分比值',
      '导出后在微信编辑器中预览，确认样式效果，及时调整不兼容的样式',
      '对于复杂布局，考虑使用表格实现，而非定位属性',
    ],
  };
};
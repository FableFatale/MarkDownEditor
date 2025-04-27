import mammoth from 'mammoth';
import TurndownService from 'turndown';

interface ConversionResult {
  success: boolean;
  content: string;
  error?: string;
}

class DocumentService {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '*'
    });

    // 配置转换规则
    this.configureTurndownRules();
  }

  private configureTurndownRules() {
    // 保留换行符
    this.turndownService.addRule('preserveLineBreaks', {
      filter: 'br',
      replacement: () => '\n'
    });

    // 处理代码块
    this.turndownService.addRule('codeBlocks', {
      filter: ['pre', 'code'],
      replacement: (content, node) => {
        const language = (node as HTMLElement).getAttribute('class') || '';
        const code = content.replace(/\n$/, '');
        return '\n```' + language + '\n' + code + '\n```\n';
      }
    });
  }

  /**
   * 将Word文档转换为Markdown
   */
  async convertWordToMarkdown(buffer: ArrayBuffer): Promise<ConversionResult> {
    try {
      const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
      const markdown = this.turndownService.turndown(result.value);
      
      return {
        success: true,
        content: markdown
      };
    } catch (error) {
      return {
        success: false,
        content: '',
        error: '转换Word文档失败'
      };
    }
  }

  /**
   * 将HTML转换为Markdown
   */
  convertHtmlToMarkdown(html: string): ConversionResult {
    try {
      const markdown = this.turndownService.turndown(html);
      return {
        success: true,
        content: markdown
      };
    } catch (error) {
      return {
        success: false,
        content: '',
        error: '转换HTML失败'
      };
    }
  }

  /**
   * 将纯文本转换为Markdown
   */
  convertTextToMarkdown(text: string): ConversionResult {
    try {
      // 处理纯文本中的URL，将其转换为Markdown链接
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const markdown = text.replace(urlRegex, '[$1]($1)');

      return {
        success: true,
        content: markdown
      };
    } catch (error) {
      return {
        success: false,
        content: '',
        error: '转换文本失败'
      };
    }
  }
}

export const documentService = new DocumentService();
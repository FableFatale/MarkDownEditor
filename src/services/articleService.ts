import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { Article, ArticleMetadata, Category } from '../types/article';

// 创建存储实例
const articleStore = localforage.createInstance({
  name: 'markdownEditor',
  storeName: 'articles'
});

const categoryStore = localforage.createInstance({
  name: 'markdownEditor',
  storeName: 'categories'
});

// 自动保存的延迟时间（毫秒）
const AUTO_SAVE_DELAY = 2000;

class ArticleService {
  private autoSaveTimeout: NodeJS.Timeout | null = null;

  /**
   * 获取所有文章元数据
   */
  async getAllArticleMetadata(): Promise<ArticleMetadata[]> {
    const metadata: ArticleMetadata[] = [];
    
    try {
      await articleStore.iterate<Article, void>((article) => {
        metadata.push({
          id: article.id,
          title: article.title,
          categories: article.categories,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          wordCount: article.wordCount,
          charCount: article.charCount
        });
      });
      
      // 按更新时间排序，最新的在前面
      return metadata.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      console.error('获取文章元数据失败:', error);
      return [];
    }
  }

  /**
   * 获取单篇文章
   */
  async getArticle(id: string): Promise<Article | null> {
    try {
      const article = await articleStore.getItem<Article>(id);
      return article;
    } catch (error) {
      console.error(`获取文章 ${id} 失败:`, error);
      return null;
    }
  }

  /**
   * 创建新文章
   */
  async createArticle(title: string, content: string, categories: string[] = []): Promise<Article> {
    const now = new Date();
    const wordCount = this.countWords(content);
    const charCount = content.length;
    
    const article: Article = {
      id: uuidv4(),
      title,
      content,
      categories,
      createdAt: now,
      updatedAt: now,
      wordCount,
      charCount
    };
    
    try {
      await articleStore.setItem(article.id, article);
      return article;
    } catch (error) {
      console.error('创建文章失败:', error);
      throw new Error('创建文章失败');
    }
  }

  /**
   * 更新文章
   */
  async updateArticle(article: Article): Promise<Article> {
    try {
      const existingArticle = await this.getArticle(article.id);
      
      if (!existingArticle) {
        throw new Error(`文章 ${article.id} 不存在`);
      }
      
      const updatedArticle: Article = {
        ...article,
        updatedAt: new Date(),
        wordCount: this.countWords(article.content),
        charCount: article.content.length
      };
      
      await articleStore.setItem(article.id, updatedArticle);
      return updatedArticle;
    } catch (error) {
      console.error(`更新文章 ${article.id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 删除文章
   */
  async deleteArticle(id: string): Promise<boolean> {
    try {
      await articleStore.removeItem(id);
      return true;
    } catch (error) {
      console.error(`删除文章 ${id} 失败:`, error);
      return false;
    }
  }

  /**
   * 更新文章分类
   */
  async updateArticleCategories(articleId: string, categoryIds: string[]): Promise<Article | null> {
    try {
      const article = await this.getArticle(articleId);
      
      if (!article) {
        return null;
      }
      
      article.categories = categoryIds;
      article.updatedAt = new Date();
      
      await articleStore.setItem(articleId, article);
      return article;
    } catch (error) {
      console.error(`更新文章 ${articleId} 分类失败:`, error);
      return null;
    }
  }

  /**
   * 自动保存文章
   */
  scheduleAutoSave(article: Article): void {
    // 清除之前的定时器
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    // 设置新的定时器
    this.autoSaveTimeout = setTimeout(async () => {
      try {
        await this.updateArticle(article);
        console.log(`文章 ${article.id} 已自动保存`);
      } catch (error) {
        console.error(`自动保存文章 ${article.id} 失败:`, error);
      }
    }, AUTO_SAVE_DELAY);
  }

  /**
   * 获取所有分类
   */
  async getAllCategories(): Promise<Category[]> {
    const categories: Category[] = [];
    
    try {
      await categoryStore.iterate<Category, void>((category) => {
        categories.push(category);
      });
      
      // 按名称排序
      return categories.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('获取分类失败:', error);
      return [];
    }
  }

  /**
   * 创建分类
   */
  async createCategory(name: string, description?: string, parentId?: string): Promise<Category> {
    const now = new Date();
    
    const category: Category = {
      id: uuidv4(),
      name,
      description,
      parentId,
      createdAt: now,
      updatedAt: now
    };
    
    try {
      await categoryStore.setItem(category.id, category);
      return category;
    } catch (error) {
      console.error('创建分类失败:', error);
      throw new Error('创建分类失败');
    }
  }

  /**
   * 更新分类
   */
  async updateCategory(category: Category): Promise<Category> {
    try {
      const existingCategory = await categoryStore.getItem<Category>(category.id);
      
      if (!existingCategory) {
        throw new Error(`分类 ${category.id} 不存在`);
      }
      
      const updatedCategory: Category = {
        ...category,
        updatedAt: new Date()
      };
      
      await categoryStore.setItem(category.id, updatedCategory);
      return updatedCategory;
    } catch (error) {
      console.error(`更新分类 ${category.id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 删除分类
   */
  async deleteCategory(id: string): Promise<boolean> {
    try {
      // 获取所有使用此分类的文章
      const articles = await this.getArticlesByCategory(id);
      
      // 从所有文章中移除此分类
      for (const article of articles) {
        article.categories = article.categories.filter(catId => catId !== id);
        await this.updateArticle(article);
      }
      
      // 删除分类
      await categoryStore.removeItem(id);
      return true;
    } catch (error) {
      console.error(`删除分类 ${id} 失败:`, error);
      return false;
    }
  }

  /**
   * 获取指定分类下的所有文章
   */
  async getArticlesByCategory(categoryId: string): Promise<Article[]> {
    const articles: Article[] = [];
    
    try {
      await articleStore.iterate<Article, void>((article) => {
        if (article.categories.includes(categoryId)) {
          articles.push(article);
        }
      });
      
      return articles;
    } catch (error) {
      console.error(`获取分类 ${categoryId} 的文章失败:`, error);
      return [];
    }
  }

  /**
   * 计算文本中的单词数
   */
  private countWords(text: string): number {
    // 简单的单词计数方法，按空格分割
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
}

export const articleService = new ArticleService();
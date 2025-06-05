# 🎨 Mermaid流程图测试文档

## 🎯 测试目的
验证Markdown编辑器中的Mermaid流程图渲染功能是否正常工作。

## 📋 支持的图表类型

### 1. 流程图 (Flowchart)
```mermaid
flowchart TD
    A[开始] --> B{是否登录?}
    B -->|是| C[显示主页]
    B -->|否| D[显示登录页]
    C --> E[结束]
    D --> F[用户登录]
    F --> G{登录成功?}
    G -->|是| C
    G -->|否| H[显示错误信息]
    H --> D
```

### 2. 时序图 (Sequence Diagram)
```mermaid
sequenceDiagram
    participant 用户
    participant 前端
    participant 后端
    participant 数据库
    
    用户->>前端: 提交登录表单
    前端->>后端: 发送登录请求
    后端->>数据库: 验证用户信息
    数据库-->>后端: 返回验证结果
    后端-->>前端: 返回登录状态
    前端-->>用户: 显示登录结果
```

### 3. 甘特图 (Gantt Chart)
```mermaid
gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 设计阶段
    需求分析           :done,    des1, 2024-01-01,2024-01-05
    UI设计            :done,    des2, 2024-01-06, 2024-01-12
    原型制作          :active,  des3, 2024-01-13, 2024-01-20
    section 开发阶段
    前端开发          :         dev1, 2024-01-21, 2024-02-15
    后端开发          :         dev2, 2024-01-21, 2024-02-10
    数据库设计        :         dev3, 2024-01-21, 2024-01-25
    section 测试阶段
    单元测试          :         test1, 2024-02-16, 2024-02-20
    集成测试          :         test2, 2024-02-21, 2024-02-25
    用户测试          :         test3, 2024-02-26, 2024-03-05
```

### 4. 类图 (Class Diagram)
```mermaid
classDiagram
    class User {
        +String name
        +String email
        +String password
        +login()
        +logout()
        +updateProfile()
    }
    
    class Article {
        +String title
        +String content
        +Date createdAt
        +Date updatedAt
        +publish()
        +unpublish()
        +delete()
    }
    
    class Comment {
        +String content
        +Date createdAt
        +approve()
        +reject()
    }
    
    User ||--o{ Article : writes
    Article ||--o{ Comment : has
    User ||--o{ Comment : makes
```

### 5. 状态图 (State Diagram)
```mermaid
stateDiagram-v2
    [*] --> 草稿
    草稿 --> 审核中 : 提交审核
    草稿 --> 已删除 : 删除
    审核中 --> 已发布 : 审核通过
    审核中 --> 草稿 : 审核拒绝
    已发布 --> 已下线 : 下线
    已发布 --> 草稿 : 编辑
    已下线 --> 已发布 : 重新发布
    已下线 --> 已删除 : 删除
    已删除 --> [*]
```

### 6. 饼图 (Pie Chart)
```mermaid
pie title 用户访问来源
    "搜索引擎" : 42.5
    "直接访问" : 28.3
    "社交媒体" : 15.2
    "邮件营销" : 8.7
    "其他" : 5.3
```

### 7. 用户旅程图 (User Journey)
```mermaid
journey
    title 用户购买流程
    section 发现产品
      浏览网站: 5: 用户
      查看产品: 4: 用户
      比较价格: 3: 用户
    section 购买决策
      添加购物车: 4: 用户
      查看评价: 5: 用户
      咨询客服: 3: 用户, 客服
    section 完成购买
      填写信息: 2: 用户
      选择支付: 3: 用户
      确认订单: 5: 用户
```

### 8. Git图 (Git Graph)
```mermaid
gitgraph
    commit id: "初始提交"
    branch develop
    checkout develop
    commit id: "添加登录功能"
    commit id: "添加用户管理"
    checkout main
    merge develop
    commit id: "发布v1.0"
    branch feature/payment
    checkout feature/payment
    commit id: "添加支付功能"
    checkout develop
    merge feature/payment
    commit id: "修复支付bug"
    checkout main
    merge develop
    commit id: "发布v1.1"
```

### 9. ER图 (Entity Relationship Diagram)
```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email UK
        string password
        datetime created_at
        datetime updated_at
    }
    
    ARTICLE {
        int id PK
        string title
        text content
        int user_id FK
        enum status
        datetime created_at
        datetime updated_at
    }
    
    COMMENT {
        int id PK
        text content
        int user_id FK
        int article_id FK
        datetime created_at
    }
    
    CATEGORY {
        int id PK
        string name
        string description
    }
    
    USER ||--o{ ARTICLE : writes
    USER ||--o{ COMMENT : makes
    ARTICLE ||--o{ COMMENT : has
    ARTICLE }o--|| CATEGORY : belongs_to
```

## 🧪 测试步骤

### 1. 基础渲染测试
1. 复制上述任意一个图表代码到编辑器
2. 查看预览区域是否正确渲染图表
3. 检查图表是否响应式适配

### 2. 主题适配测试
1. 切换深色/浅色主题
2. 检查图表颜色是否正确适配
3. 验证文字和背景对比度

### 3. 错误处理测试
1. 输入错误的Mermaid语法
2. 检查是否显示友好的错误信息
3. 验证错误详情是否可展开查看

### 4. 性能测试
1. 同时渲染多个复杂图表
2. 检查页面响应速度
3. 验证内存使用情况

## ✅ 验证要点

- [ ] **流程图渲染** - 基础流程图正确显示
- [ ] **时序图渲染** - 参与者和消息正确显示
- [ ] **甘特图渲染** - 时间轴和任务正确显示
- [ ] **类图渲染** - 类和关系正确显示
- [ ] **状态图渲染** - 状态转换正确显示
- [ ] **饼图渲染** - 数据比例正确显示
- [ ] **用户旅程图渲染** - 旅程步骤正确显示
- [ ] **Git图渲染** - 分支和合并正确显示
- [ ] **ER图渲染** - 实体关系正确显示
- [ ] **主题适配** - 深浅模式正确切换
- [ ] **响应式设计** - 图表自适应容器大小
- [ ] **错误处理** - 语法错误友好提示
- [ ] **加载状态** - 渲染过程显示加载指示器

## 🎯 快速测试

复制以下简单流程图到编辑器进行快速测试：

```mermaid
flowchart LR
    A[开始] --> B[处理]
    B --> C{判断}
    C -->|是| D[结果A]
    C -->|否| E[结果B]
    D --> F[结束]
    E --> F
```

如果上述图表能正确渲染，说明Mermaid功能已成功集成！

---

## 📊 测试结果记录

**测试日期**: ___________
**测试人员**: ___________

**功能测试结果**:
- [ ] 流程图 ✅/❌
- [ ] 时序图 ✅/❌
- [ ] 甘特图 ✅/❌
- [ ] 类图 ✅/❌
- [ ] 状态图 ✅/❌
- [ ] 饼图 ✅/❌
- [ ] 用户旅程图 ✅/❌
- [ ] Git图 ✅/❌
- [ ] ER图 ✅/❌

**问题记录**:
1. ________________
2. ________________
3. ________________

**总体评价**: ⭐⭐⭐⭐⭐

# Mermaid 测试文档

## 流程图测试

```mermaid
graph TD
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

## 序列图测试

```mermaid
sequenceDiagram
    participant 用户
    participant 前端
    participant 后端
    participant 数据库
    
    用户->>前端: 点击登录
    前端->>后端: 发送登录请求
    后端->>数据库: 验证用户信息
    数据库-->>后端: 返回验证结果
    后端-->>前端: 返回登录状态
    前端-->>用户: 显示登录结果
```

## 甘特图测试

```mermaid
gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 设计阶段
    需求分析           :done,    des1, 2024-01-01,2024-01-07
    UI设计            :done,    des2, 2024-01-08, 2024-01-15
    section 开发阶段
    前端开发          :active,  dev1, 2024-01-16, 2024-02-15
    后端开发          :         dev2, 2024-01-20, 2024-02-20
    section 测试阶段
    单元测试          :         test1, after dev1, 5d
    集成测试          :         test2, after dev2, 3d
```

## 类图测试

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
        +User author
        +publish()
        +edit()
        +delete()
    }
    
    class Comment {
        +String content
        +Date createdAt
        +User author
        +Article article
        +reply()
        +delete()
    }
    
    User ||--o{ Article : writes
    User ||--o{ Comment : writes
    Article ||--o{ Comment : has
```

## 状态图测试

```mermaid
stateDiagram-v2
    [*] --> 未登录
    未登录 --> 登录中 : 点击登录
    登录中 --> 已登录 : 登录成功
    登录中 --> 未登录 : 登录失败
    已登录 --> 未登录 : 退出登录
    已登录 --> 编辑中 : 开始编辑
    编辑中 --> 已登录 : 保存/取消
    已登录 --> [*] : 关闭应用
```

## 饼图测试

```mermaid
pie title 编程语言使用比例
    "JavaScript" : 35
    "Python" : 25
    "Java" : 20
    "TypeScript" : 15
    "其他" : 5
```

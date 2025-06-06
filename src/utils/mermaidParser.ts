// Mermaid语法解析器 - 将Mermaid代码转换为React Flow格式

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
  style?: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  style?: Record<string, any>;
}

export interface ParsedFlow {
  nodes: FlowNode[];
  edges: FlowEdge[];
  direction: 'TB' | 'LR' | 'BT' | 'RL';
}

// 节点形状映射
const getNodeStyle = (shape: string) => {
  switch (shape) {
    case 'rect':
    case 'square':
      return {
        backgroundColor: '#e1f5fe',
        border: '2px solid #0277bd',
        borderRadius: '6px',
        padding: '12px 16px',
        minWidth: '80px',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '500'
      };
    case 'round':
    case 'circle':
      return {
        backgroundColor: '#f3e5f5',
        border: '2px solid #7b1fa2',
        borderRadius: '50%',
        padding: '12px 16px',
        minWidth: '80px',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '500'
      };
    case 'diamond':
      return {
        backgroundColor: '#fff3e0',
        border: '2px solid #ef6c00',
        borderRadius: '8px',
        padding: '12px 16px',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '80px',
        minHeight: '40px'
      };
    default:
      return {
        backgroundColor: '#f5f5f5',
        border: '2px solid #666',
        borderRadius: '6px',
        padding: '12px 16px',
        minWidth: '80px',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '500'
      };
  }
};

// 获取边样式
const getEdgeStyle = (type: string, originalLine: string) => {
  const baseStyle = {
    strokeWidth: 2,
    stroke: '#666'
  };

  if (originalLine.includes('-.->')) {
    // 虚线
    return {
      ...baseStyle,
      strokeDasharray: '5,5',
      stroke: '#9c27b0'
    };
  } else if (originalLine.includes('==>')) {
    // 粗线
    return {
      ...baseStyle,
      strokeWidth: 4,
      stroke: '#1976d2'
    };
  } else {
    // 实线
    return baseStyle;
  }
};

// 解析节点定义
const parseNode = (nodeStr: string): { id: string; label: string; shape: string } => {
  console.log('🔍 解析节点:', nodeStr);
  
  // 匹配各种节点格式 - 支持中文字符
  const patterns = [
    // A[文本] - 方形节点（支持中文）
    /^([A-Za-z0-9_\u4e00-\u9fff]+)\[([^\]]+)\]$/,
    // A(文本) - 圆形节点（支持中文）
    /^([A-Za-z0-9_\u4e00-\u9fff]+)\(([^)]+)\)$/,
    // A{文本} - 菱形节点（支持中文）
    /^([A-Za-z0-9_\u4e00-\u9fff]+)\{([^}]+)\}$/,
    // A((文本)) - 圆形节点（支持中文）
    /^([A-Za-z0-9_\u4e00-\u9fff]+)\(\(([^)]+)\)\)$/,
    // 简单节点 A（支持中文）
    /^([A-Za-z0-9_\u4e00-\u9fff]+)$/
  ];

  for (const pattern of patterns) {
    const match = nodeStr.trim().match(pattern);
    if (match) {
      const id = match[1];
      const label = match[2] || id;
      
      // 根据括号类型确定形状
      let shape = 'rect';
      if (nodeStr.includes('(')) shape = 'round';
      if (nodeStr.includes('{')) shape = 'diamond';
      if (nodeStr.includes('((')) shape = 'circle';
      
      console.log('✅ 节点解析成功:', { id, label, shape });
      return { id, label, shape };
    }
  }

  // 默认返回
  console.log('⚠️ 节点解析失败，使用默认值');
  return { id: nodeStr.trim(), label: nodeStr.trim(), shape: 'rect' };
};

// 解析连接线
const parseEdge = (edgeStr: string): { source: string; target: string; label?: string; type: string } => {
  console.log('🔍 解析连接线:', edgeStr);
  
  // 各种连接线格式 - 支持带方括号、圆括号、花括号的节点和中文字符
  const patterns = [
    // A[文本] --> B[文本] (带标签的节点，支持中文)
    /^([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)\s*-->\s*([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)$/,
    // A[文本] --- B[文本] (实线，支持中文)
    /^([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)\s*---\s*([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)$/,
    // A[文本] -.-> B[文本] (虚线，支持中文)
    /^([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)\s*-\.->\s*([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)$/,
    // A[文本] ==> B[文本] (粗线，支持中文)
    /^([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)\s*==>\s*([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)$/,
    // A[文本] -->|标签| B[文本] (带标签的连接线，支持中文)
    /^([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)\s*-->\|([^|]+)\|\s*([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)$/,
    // A[文本] -.->|标签| B[文本] (虚线带标签，支持中文)
    /^([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)\s*-\.->\|([^|]+)\|\s*([A-Za-z0-9_\u4e00-\u9fff]+(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?)$/,
    // 简单格式 A --> B (支持中文)
    /^([A-Za-z0-9_\u4e00-\u9fff]+)\s*-->\s*([A-Za-z0-9_\u4e00-\u9fff]+)$/,
    // 简单格式 A --- B (支持中文)
    /^([A-Za-z0-9_\u4e00-\u9fff]+)\s*---\s*([A-Za-z0-9_\u4e00-\u9fff]+)$/,
    // 简单格式 A -.-> B (支持中文)
    /^([A-Za-z0-9_\u4e00-\u9fff]+)\s*-\.->\s*([A-Za-z0-9_\u4e00-\u9fff]+)$/,
    // 简单格式 A ==> B (支持中文)
    /^([A-Za-z0-9_\u4e00-\u9fff]+)\s*==>\s*([A-Za-z0-9_\u4e00-\u9fff]+)$/
  ];

  for (const pattern of patterns) {
    const match = edgeStr.trim().match(pattern);
    if (match) {
      // 提取源节点和目标节点的ID（去掉方括号等装饰，支持中文）
      const extractNodeId = (nodeStr: string): string => {
        const idMatch = nodeStr.match(/^([A-Za-z0-9_\u4e00-\u9fff]+)/);
        return idMatch ? idMatch[1] : nodeStr;
      };

      const source = extractNodeId(match[1]);
      let target: string;
      let label: string | undefined;

      // 判断是否有标签 - 检查原始字符串中是否包含 |标签|
      if (edgeStr.includes('|') && match.length >= 4) {
        // 有标签的情况: A -->|label| B
        target = extractNodeId(match[3]);
        label = match[2];
      } else {
        // 没有标签的情况: A --> B
        target = extractNodeId(match[match.length - 1]);
        label = undefined;
      }

      // 根据箭头类型确定样式
      let type = 'default';
      if (edgeStr.includes('-.->')) type = 'smoothstep';
      if (edgeStr.includes('==>')) type = 'step';

      console.log('✅ 连接线解析成功:', { source, target, label, type });
      return { source, target, label, type };
    }
  }

  console.log('⚠️ 连接线解析失败');
  return { source: '', target: '', type: 'default' };
};

// 自动布局算法
const autoLayout = (nodes: FlowNode[], edges: FlowEdge[], direction: string) => {
  console.log('🎨 开始自动布局，方向:', direction);
  console.log('📊 节点列表:', nodes.map(n => ({ id: n.id, label: n.data.label })));
  console.log('🔗 连接列表:', edges.map(e => ({ source: e.source, target: e.target, label: e.label })));

  const nodeSpacing = 200; // 增加节点间距
  const levelSpacing = 250; // 增加层级间距
  
  // 构建图的层级结构
  const levels: string[][] = [];
  const visited = new Set<string>();
  const nodeToLevel = new Map<string, number>();
  
  // 找到根节点（没有入边的节点）
  const hasIncoming = new Set(edges.map(e => e.target));
  const roots = nodes.filter(n => !hasIncoming.has(n.id)).map(n => n.id);

  console.log('🌳 有入边的节点:', Array.from(hasIncoming));
  console.log('🌱 根节点:', roots);

  if (roots.length === 0 && nodes.length > 0) {
    // 如果没有明显的根节点，选择第一个
    roots.push(nodes[0].id);
    console.log('⚠️ 没有找到根节点，使用第一个节点作为根:', nodes[0].id);
  }
  
  // BFS遍历构建层级
  let currentLevel = 0;
  let queue = [...roots];

  console.log('🔄 开始BFS遍历，初始队列:', queue);

  while (queue.length > 0) {
    const nextQueue: string[] = [];
    levels[currentLevel] = [];

    console.log(`📊 处理第 ${currentLevel} 层，当前队列:`, queue);

    for (const nodeId of queue) {
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        levels[currentLevel].push(nodeId);
        nodeToLevel.set(nodeId, currentLevel);

        // 找到子节点
        const children = edges
          .filter(e => e.source === nodeId)
          .map(e => e.target)
          .filter(id => !visited.has(id));

        console.log(`🌿 节点 ${nodeId} 的子节点:`, children);
        nextQueue.push(...children);
      }
    }

    console.log(`✅ 第 ${currentLevel} 层完成，节点:`, levels[currentLevel]);
    currentLevel++;
    queue = [...new Set(nextQueue)]; // 去重，避免重复添加同一个节点
    console.log(`➡️ 下一层队列:`, queue);
  }
  
  // 处理未访问的节点
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      if (!levels[currentLevel]) levels[currentLevel] = [];
      levels[currentLevel].push(node.id);
      nodeToLevel.set(node.id, currentLevel);
    }
  });
  
  // 计算位置
  const isVertical = direction === 'TB' || direction === 'BT';
  console.log('📐 布局方向:', isVertical ? '垂直' : '水平');
  console.log('📊 层级结构:', levels.map((level, i) => `Level ${i}: [${level.join(', ')}]`));

  levels.forEach((level, levelIndex) => {
    console.log(`🎯 处理第 ${levelIndex} 层，包含 ${level.length} 个节点:`, level);
    level.forEach((nodeId, nodeIndex) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        if (isVertical) {
          node.position = {
            x: (nodeIndex - (level.length - 1) / 2) * nodeSpacing,
            y: levelIndex * levelSpacing
          };
        } else {
          node.position = {
            x: levelIndex * levelSpacing,
            y: (nodeIndex - (level.length - 1) / 2) * nodeSpacing
          };
        }
        console.log(`📍 节点 ${nodeId} 位置:`, node.position);
      }
    });
  });

  console.log('✅ 自动布局完成，层级数:', levels.length);
  console.log('📋 最终节点位置:', nodes.map(n => ({ id: n.id, label: n.data.label, position: n.position })));

  // 检查节点数据完整性
  nodes.forEach(node => {
    if (!node.id || !node.data || !node.data.label || !node.position) {
      console.error('❌ 节点数据不完整:', node);
    } else {
      console.log('✅ 节点数据完整:', { id: node.id, label: node.data.label, position: node.position });
    }
  });

  return nodes;
};

// 主解析函数
export const parseMermaidToFlow = (mermaidCode: string): ParsedFlow => {
  console.log('🚀 开始解析Mermaid代码');
  console.log('📝 原始代码:', mermaidCode);
  
  const lines = mermaidCode
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('%%')); // 过滤空行和注释
  
  console.log('📄 有效行数:', lines.length);
  
  // 解析图表类型和方向
  let direction: 'TB' | 'LR' | 'BT' | 'RL' = 'TB';
  let startIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^(graph|flowchart)\s+(TB|LR|BT|RL|TD)/)) {
      const match = line.match(/^(graph|flowchart)\s+(TB|LR|BT|RL|TD)/);
      if (match) {
        direction = match[2] === 'TD' ? 'TB' : match[2] as any;
        startIndex = i + 1;
        console.log('📊 检测到图表方向:', direction);
        break;
      }
    }
  }
  
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  const nodeIds = new Set<string>();
  
  // 解析节点和连接线
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    console.log('🔍 处理行:', line);
    
    if (line.includes('-->') || line.includes('---') || line.includes('-.->') || line.includes('==>')) {
      // 这是一条连接线
      const edgeInfo = parseEdge(line);
      if (edgeInfo.source && edgeInfo.target) {
        // 从原始行中提取完整的节点信息
        const extractNodeFromLine = (nodeId: string, fullLine: string): { id: string; label: string; shape: string } => {
          // 在行中查找这个节点的完整定义（支持中文）
          const patterns = [
            new RegExp(`(${nodeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\[([^\\]]+)\\]`), // A[文本]
            new RegExp(`(${nodeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\(([^)]+)\\)`),   // A(文本)
            new RegExp(`(${nodeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\{([^}]+)\\}`),   // A{文本}
            new RegExp(`(${nodeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\(\\(([^)]+)\\)\\)`) // A((文本))
          ];

          for (const pattern of patterns) {
            const match = fullLine.match(pattern);
            if (match) {
              let shape = 'rect';
              if (fullLine.includes(`${nodeId}(`)) shape = 'round';
              if (fullLine.includes(`${nodeId}{`)) shape = 'diamond';
              if (fullLine.includes(`${nodeId}((`)) shape = 'circle';

              return { id: nodeId, label: match[2], shape };
            }
          }

          return { id: nodeId, label: nodeId, shape: 'rect' };
        };

        // 确保源节点和目标节点存在
        [edgeInfo.source, edgeInfo.target].forEach(nodeId => {
          if (!nodeIds.has(nodeId)) {
            nodeIds.add(nodeId);
            const nodeInfo = extractNodeFromLine(nodeId, line);
            console.log(`➕ 添加节点: ${nodeId}, 标签: ${nodeInfo.label}, 形状: ${nodeInfo.shape}`);
            nodes.push({
              id: nodeId,
              type: 'default',
              position: { x: 0, y: 0 },
              data: { label: nodeInfo.label },
              style: getNodeStyle(nodeInfo.shape)
            });
          } else {
            console.log(`⚠️ 节点 ${nodeId} 已存在，跳过`);
          }
        });
        
        edges.push({
          id: `${edgeInfo.source}-${edgeInfo.target}`,
          source: edgeInfo.source,
          target: edgeInfo.target,
          label: edgeInfo.label,
          type: edgeInfo.type,
          style: getEdgeStyle(edgeInfo.type, line),
          labelStyle: { fill: '#666', fontWeight: 600 },
          labelBgStyle: { fill: 'white', fillOpacity: 0.8 }
        });
      }
    } else {
      // 这可能是一个独立的节点定义
      const nodeInfo = parseNode(line);
      if (nodeInfo.id && !nodeIds.has(nodeInfo.id)) {
        nodeIds.add(nodeInfo.id);
        nodes.push({
          id: nodeInfo.id,
          type: 'default',
          position: { x: 0, y: 0 },
          data: { label: nodeInfo.label },
          style: getNodeStyle(nodeInfo.shape)
        });
      }
    }
  }
  
  // 自动布局
  autoLayout(nodes, edges, direction);
  
  console.log('✅ 解析完成');
  console.log('📊 节点数量:', nodes.length);
  console.log('🔗 连接线数量:', edges.length);
  
  return { nodes, edges, direction };
};

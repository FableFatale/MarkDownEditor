import React from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';

// 标题样式类型
export type HeadingStyleType = 'default' | 'underline' | 'bordered' | 'gradient' | 'modern' | 'elegant';

// 标题组件属性
interface CustomHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  styleType: HeadingStyleType;
  className?: string;
}

// 自定义标题组件
export const CustomHeading: React.FC<CustomHeadingProps> = ({
  level,
  children,
  styleType = 'default',
  className = '',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // 基础样式 - 增强视觉效果，适合在预览区域展示
  const baseStyles = {
    fontFamily: theme.typography.fontFamily,
    fontWeight: level <= 2 ? 700 : 600,
    lineHeight: 1.3,
    marginTop: theme.spacing(level === 1 ? 3 : 2),
    marginBottom: theme.spacing(level === 1 ? 2 : 1.5),
    color: theme.palette.text.primary,
    transition: 'all 0.3s ease',
  };
  
  // 根据样式类型应用不同的样式
  const getStyleByType = (): React.CSSProperties => {
    switch (styleType) {
      case 'underline':
        return {
          borderBottom: `2px solid ${theme.palette.primary.main}`,
          paddingBottom: theme.spacing(0.5),
          display: 'inline-block',
        };
        
      case 'bordered':
        return {
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          paddingLeft: theme.spacing(1.5),
          paddingTop: theme.spacing(0.5),
          paddingBottom: theme.spacing(0.5),
        };
        
      case 'gradient':
        return {
          background: isDark
            ? `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
            : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          display: 'inline-block',
        };
        
      case 'modern':
        return {
          position: 'relative',
          paddingLeft: theme.spacing(2),
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
          },
        };
        
      case 'elegant':
        return {
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 300,
          color: theme.palette.primary.main,
        };
        
      default:
        return {};
    }
  };
  
  // 合并样式
  const combinedStyles = {
    ...baseStyles,
    ...getStyleByType(),
  };
  
  // 根据级别渲染不同的标题元素
  const renderHeading = () => {
    const headingProps = {
      style: combinedStyles,
      className,
    };
    
    switch (level) {
      case 1:
        return <h1 {...headingProps}>{children}</h1>;
      case 2:
        return <h2 {...headingProps}>{children}</h2>;
      case 3:
        return <h3 {...headingProps}>{children}</h3>;
      case 4:
        return <h4 {...headingProps}>{children}</h4>;
      case 5:
        return <h5 {...headingProps}>{children}</h5>;
      case 6:
        return <h6 {...headingProps}>{children}</h6>;
      default:
        return <h2 {...headingProps}>{children}</h2>;
    }
  };
  
  // 特殊处理带分隔线的样式
  if (styleType === 'underline' && level <= 2) {
    return (
      <Box sx={{ mb: 2 }}>
        {renderHeading()}
        {level === 1 && <Divider sx={{ mt: 1 }} />}
      </Box>
    );
  }
  
  return renderHeading();
};

// 自定义标题样式预览组件
export const HeadingStylePreview: React.FC<{ styleType: HeadingStyleType }> = ({ styleType }) => {
  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
      <Typography variant="overline" display="block" gutterBottom>
        样式预览: {styleType}
      </Typography>
      <CustomHeading level={1} styleType={styleType}>
        一级标题示例
      </CustomHeading>
      <CustomHeading level={2} styleType={styleType}>
        二级标题示例
      </CustomHeading>
      <CustomHeading level={3} styleType={styleType}>
        三级标题示例
      </CustomHeading>
    </Box>
  );
};

// 导出自定义标题渲染器（用于React Markdown）
export const createCustomHeadingRenderer = (styleType: HeadingStyleType = 'default') => {
  return {
    h1: ({ node, ...props }: any) => (
      <CustomHeading level={1} styleType={styleType} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <CustomHeading level={2} styleType={styleType} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <CustomHeading level={3} styleType={styleType} {...props} />
    ),
    h4: ({ node, ...props }: any) => (
      <CustomHeading level={4} styleType={styleType} {...props} />
    ),
    h5: ({ node, ...props }: any) => (
      <CustomHeading level={5} styleType={styleType} {...props} />
    ),
    h6: ({ node, ...props }: any) => (
      <CustomHeading level={6} styleType={styleType} {...props} />
    ),
  };
};

export default CustomHeading;

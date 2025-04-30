import { useState } from 'react';
import { MarkdownEditorCore } from './MarkdownEditorCore';
import { MarkdownPreview } from './MarkdownPreview';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface MarkdownEditorContainerProps {
  initialValue?: string;
  className?: string;
}

export const MarkdownEditorContainer = ({
  initialValue = '',
  className = '',
}: MarkdownEditorContainerProps) => {
  const [content, setContent] = useState(initialValue);
  const [editorWidth, setEditorWidth] = useState(window.innerWidth / 2);

  const handleResize = (_: any, { size }: { size: { width: number } }) => {
    setEditorWidth(size.width);
  };

  return (
    <div className={`flex h-full ${className}`}>
      <Resizable
        width={editorWidth}
        height={0} // 高度由容器控制
        onResize={handleResize}
        handle={<div className="w-2 h-full cursor-col-resize bg-gray-200 hover:bg-gray-300" />}
        axis="x"
      >
        <div style={{ width: editorWidth }} className="h-full">
          <MarkdownEditorCore
            initialValue={initialValue}
            onChange={setContent}
            className="h-full p-4 bg-white dark:bg-gray-800"
          />
        </div>
      </Resizable>
      <div className="flex-1 h-full overflow-auto p-4 bg-white dark:bg-gray-800">
        <MarkdownPreview content={content} />
      </div>
    </div>
  );
};
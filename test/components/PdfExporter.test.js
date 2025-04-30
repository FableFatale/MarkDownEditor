import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PdfExporter } from '../../src/components/PdfExporter';

// 模拟html2pdf
jest.mock('html2pdf.js', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      from: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      save: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('PdfExporter', () => {
  it('renders export button with default text', () => {
    const contentRef = { current: document.createElement('div') };
    render(<PdfExporter contentRef={contentRef} />);
    
    expect(screen.getByText('导出PDF')).toBeInTheDocument();
  });

  it('renders export button with custom text', () => {
    const contentRef = { current: document.createElement('div') };
    render(<PdfExporter contentRef={contentRef} buttonText="自定义按钮文本" />);
    
    expect(screen.getByText('自定义按钮文本')).toBeInTheDocument();
  });

  it('opens settings dialog when settings button is clicked', () => {
    const contentRef = { current: document.createElement('div') };
    render(<PdfExporter contentRef={contentRef} />);
    
    fireEvent.click(screen.getByText('设置'));
    
    expect(screen.getByText('PDF导出设置')).toBeInTheDocument();
  });

  it('updates settings when changed in dialog', () => {
    const contentRef = { current: document.createElement('div') };
    render(<PdfExporter contentRef={contentRef} />);
    
    // 打开设置对话框
    fireEvent.click(screen.getByText('设置'));
    
    // 更改文件名
    const filenameInput = screen.getByLabelText('文件名');
    fireEvent.change(filenameInput, { target: { value: 'test-document' } });
    
    // 检查值是否已更新
    expect(filenameInput.value).toBe('test-document');
  });

  it('shows error when contentRef is null', async () => {
    const contentRef = { current: null };
    render(<PdfExporter contentRef={contentRef} />);
    
    fireEvent.click(screen.getByText('导出PDF'));
    
    await waitFor(() => {
      expect(screen.getByText('无法找到要导出的内容')).toBeInTheDocument();
    });
  });

  it('exports PDF when export button is clicked', async () => {
    const contentRef = { current: document.createElement('div') };
    render(<PdfExporter contentRef={contentRef} />);
    
    fireEvent.click(screen.getByText('导出PDF'));
    
    await waitFor(() => {
      expect(screen.getByText('PDF导出成功')).toBeInTheDocument();
    });
  });
});

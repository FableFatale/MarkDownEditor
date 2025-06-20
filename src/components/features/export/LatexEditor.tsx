import React, { useState, useEffect } from 'react';
import { Box, IconButton, TextField, Typography, Paper } from '@mui/material';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface LatexEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  inline?: boolean;
}

export const LatexEditor: React.FC<LatexEditorProps> = ({
  initialValue = '',
  onChange,
  inline = false,
}) => {
  const [latex, setLatex] = useState(initialValue);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rendered = katex.renderToString(latex, {
        displayMode: !inline,
        throwOnError: false,
        strict: false
      });
      setPreview(rendered);
      setError(null);
      onChange?.(latex);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [latex, inline, onChange]);

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <TextField
        fullWidth
        multiline={!inline}
        rows={inline ? 1 : 3}
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        placeholder={inline ? '输入行内公式' : '输入公式块'}
        variant="outlined"
        error={!!error}
        helperText={error}
        sx={{ mb: 1 }}
      />
      <Paper
        elevation={1}
        sx={{
          p: 2,
          minHeight: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .katex-display': {
            margin: 0
          }
        }}
      >
        {preview ? (
          <div dangerouslySetInnerHTML={{ __html: preview }} />
        ) : (
          <Typography color="text.secondary">
            预览区域
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
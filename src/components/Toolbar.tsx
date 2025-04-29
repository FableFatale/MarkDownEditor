import React from 'react';
import { AppBar, Box, useTheme } from '@mui/material';
import WordCounter from './WordCounter';

interface ToolbarProps {
  content: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ content }) => {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        top: 0,
        backgroundColor: alpha(theme.palette.background.default, 0.85),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backdropFilter: 'blur(10px)',
        transition: theme.transitions.create(
          ['background-color', 'box-shadow', 'border-bottom-color'],
          { duration: 200 }
        ),
        '&:hover': {
          backgroundColor: theme.palette.background.default,
          backdropFilter: 'blur(12px)',
        }
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: { xs: 1, sm: 1.5 },
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        <WordCounter text={content} />
      </Container>
    </AppBar>
  );
};

export default Toolbar;
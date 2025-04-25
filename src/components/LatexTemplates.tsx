import React from 'react';
import { Box, Button, Grid, Tooltip, Typography } from '@mui/material';
import { LatexService } from '../services/latexService';

interface LatexTemplatesProps {
  onSelect: (template: string) => void;
}

export const LatexTemplates: React.FC<LatexTemplatesProps> = ({ onSelect }) => {
  const templates = LatexService.getCommonTemplates();

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        常用公式模板
      </Typography>
      <Grid container spacing={1}>
        {Object.entries(templates).map(([name, template]) => (
          <Grid item key={name}>
            <Tooltip
              title={<div dangerouslySetInnerHTML={{
                __html: LatexService.renderLatex(template).html
              }} />}
              placement="top"
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => onSelect(template)}
                sx={{ textTransform: 'none' }}
              >
                {name}
              </Button>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
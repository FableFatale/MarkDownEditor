import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Typography,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Image } from '../types/image';

interface ImageListProps {
  images: Image[];
  onImageClick: (image: Image) => void;
  onImageDelete: (id: string) => void;
  onImageCopy: (url: string) => void;
  onImagesReorder: (images: Image[]) => void;
}

const ITEMS_PER_PAGE = 12;

export const ImageList: React.FC<ImageListProps> = ({
  images,
  onImageClick,
  onImageDelete,
  onImageCopy,
  onImagesReorder,
}) => {
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onImagesReorder(items);
  };

  const handleDeleteClick = (image: Image) => {
    setSelectedImage(image);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedImage) {
      onImageDelete(selectedImage.id);
      setDeleteDialogOpen(false);
      setSelectedImage(null);
    }
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const displayedImages = images.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);

  return (
    <Box sx={{ width: '100%' }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {displayedImages.map((image, index) => (
                <Draggable
                  key={image.id}
                  draggableId={image.id}
                  index={startIndex + index}
                >
                  {(provided) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <Card>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="160"
                            image={image.url}
                            alt={image.name}
                            onClick={() => onImageClick(image)}
                            sx={{ cursor: 'pointer', objectFit: 'cover' }}
                          />
                          <Box
                            {...provided.dragHandleProps}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              bgcolor: 'rgba(0, 0, 0, 0.5)',
                              borderRadius: '50%',
                              p: 0.5,
                              cursor: 'grab',
                            }}
                          >
                            <DragIcon sx={{ color: 'white' }} />
                          </Box>
                        </Box>
                        <CardActions sx={{ justifyContent: 'space-between' }}>
                          <Typography
                            variant="caption"
                            sx={{
                              maxWidth: '60%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {image.name}
                          </Typography>
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(image)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onImageCopy(image.url)}
                              color="primary"
                            >
                              <CopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardActions>
                      </Card>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除图片 {selectedImage?.name} 吗？此操作无法撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
import { useState, useCallback } from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import AddRoomDialog from '../AddRoomDialog/AddRoomDialog';

/**
 * Компонент картки для додавання нової кімнати
 */
const AddRoomCard = ({ fullWidth = false, onRoomAdded }) => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  
  // Мемоізовані обробники для запобігання зайвим рендерам
  const handleOpenDialog = useCallback(() => {
    setOpenDialog(true);
  }, []);
  
  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleRoomAdded = useCallback(() => {
    handleCloseDialog();
    if (onRoomAdded) {
      onRoomAdded();
    }
  }, [handleCloseDialog, onRoomAdded]);
  
  return (
    <>
      <Card 
        onClick={handleOpenDialog}
        sx={{ 
          height: fullWidth ? 'auto' : '100%',
          width: fullWidth ? '100%' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: fullWidth ? 5 : 3,
          transition: 'transform 0.3s, box-shadow 0.3s',
          cursor: 'pointer',
          borderRadius: 2,
          border: '2px dashed',
          borderColor: 'primary.light',
          boxShadow: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
            borderColor: 'primary.main',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 2
          }}
        >
          <IconButton 
            color="primary" 
            sx={{ 
              mb: 1,
              width: 56,
              height: 56,
              backgroundColor: 'primary.light',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.main',
              }
            }}
          >
            <AddIcon fontSize="large" />
          </IconButton>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              component="div" 
              color="primary.main"
              sx={{ fontWeight: 'bold' }}
            >
              {t('room.addRoom')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('room.addRoomDescription')}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      
      <AddRoomDialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        onSuccess={handleRoomAdded}
      />
    </>
  );
};

export default AddRoomCard; 
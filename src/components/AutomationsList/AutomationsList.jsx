import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Grid, Fab, useTheme, Container, Zoom, useMediaQuery } from '@mui/material';
import { Add as AddIcon, AutoAwesome, SmartToy } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AutomationCard from '../AutomationCard/AutomationCard';
import AddAutomationDialog from '../AddAutomationDialog/AddAutomationDialog';
import EditAutomationDialog from '../EditAutomationDialog/EditAutomationDialog';
import DeleteAutomationDialog from '../DeleteAutomationDialog/DeleteAutomationDialog';
import { fadeIn, slideInLeft, floatingEffect } from '../../theme/animations';

const AutomationsList = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { automations = [] } = useSelector(state => state.homes);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [transitionIn, setTransitionIn] = useState(false);

  useEffect(() => {
    // Додаємо невелику затримку для анімації входу
    const timer = setTimeout(() => {
      setTransitionIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = automation => {
    setSelectedAutomation(automation);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = automation => {
    setSelectedAutomation(automation);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Container 
      disableGutters={isXsScreen} 
      maxWidth="xl" 
      sx={{ 
        p: { xs: 1, sm: 2, md: 3 }, 
        position: 'relative',
        overflow: 'hidden',
        minWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Декоративні елементи */}
      <Box 
        sx={{
          position: 'absolute',
          zIndex: 0,
          top: -50,
          right: -50,
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.light}22, ${theme.palette.primary.light}00)`,
          opacity: 0.6,
          filter: 'blur(40px)',
          display: { xs: 'none', sm: 'block' },
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          zIndex: 0,
          bottom: -100,
          left: -100,
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.secondary.light}22, ${theme.palette.secondary.light}00)`,
          opacity: 0.5,
          filter: 'blur(60px)',
          display: { xs: 'none', sm: 'block' },
        }}
      />

      <Paper 
        elevation={3} 
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: 5,
          borderRadius: { xs: 2, sm: 3, md: 4 },
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          position: "relative",
          overflow: "hidden",
          animation: `${slideInLeft} 0.6s ease-out forwards`,
          transition: 'all 0.3s ease',
          width: '100%',
          boxSizing: 'border-box',
          mx: 'auto',
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "6px",
            background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          mb={3} 
          gap={{ xs: 2, sm: 0 }}
          position="relative"
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            width: { xs: '100%', sm: 'auto' },
          }}>
            <AutoAwesome 
              color="primary" 
              sx={{ 
                fontSize: { xs: 24, sm: 30 }, 
                animation: `${floatingEffect} 3s ease-in-out infinite`
              }} 
            />
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                fontWeight: 600,
                background: theme => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {t('automation.title')}
            </Typography>
          </Box>
          
          <Zoom in={transitionIn} timeout={500} style={{ transitionDelay: '300ms' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              size={isXsScreen ? "medium" : "large"}
              sx={{
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: { xs: 0.8, sm: 1.2 },
                fontWeight: 500,
                boxShadow: '0 6px 12px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.3s ease',
                width: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 15px rgba(25, 118, 210, 0.4)',
                }
              }}
            >
              {t('automation.addAutomation')}
            </Button>
          </Zoom>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {automations.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: { xs: 4, sm: 6, md: 8 }, 
                px: { xs: 1, sm: 2 },
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                animation: `${fadeIn} 0.8s ease-out forwards`,
                border: '1px dashed rgba(0, 0, 0, 0.1)',
              }}
            >
              <SmartToy 
                sx={{ 
                  fontSize: { xs: 40, sm: 50, md: 60 }, 
                  color: theme => theme.palette.primary.light,
                  mb: 2,
                  opacity: 0.7,
                  animation: `${floatingEffect} 3s ease-in-out infinite`,
                }} 
              />
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                {t('automation.noAutomations')}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                mt={2} 
                mb={3}
                sx={{ 
                  maxWidth: '500px',
                  mx: 'auto',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {t('automation.description')}
              </Typography>
              <Zoom in={transitionIn} timeout={500} style={{ transitionDelay: '400ms' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddClick}
                  size={isXsScreen ? "medium" : "large"}
                  sx={{
                    borderRadius: 2,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.8, sm: 1.2 },
                    fontWeight: 500,
                    boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s ease',
                    width: { xs: '100%', sm: 'auto' },
                    maxWidth: { xs: '250px', sm: 'none' },
                    mx: 'auto',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 20px rgba(25, 118, 210, 0.4)',
                    }
                  }}
                >
                  {t('automation.addAutomation')}
                </Button>
              </Zoom>
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {automations.map((automation, index) => (
                <Grid 
                  item 
                  xs={12} 
                  md={6} 
                  lg={4} 
                  key={automation._id}
                  sx={{
                    animation: `${fadeIn} ${0.3 + (index * 0.1)}s ease-out forwards`,
                  }}
                >
                  <AutomationCard
                    automation={automation}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Плаваюча кнопка для мобільних пристроїв */}
      <Zoom in={transitionIn && automations.length > 0} timeout={500} style={{ transitionDelay: '500ms' }}>
        <Fab
          color="primary"
          aria-label="add"
          size={isXsScreen ? "small" : "medium"}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            boxShadow: '0 8px 16px rgba(25, 118, 210, 0.4)',
            display: { md: 'none' }
          }}
          onClick={handleAddClick}
        >
          <AddIcon fontSize={isXsScreen ? "small" : "medium"} />
        </Fab>
      </Zoom>

      <AddAutomationDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      <EditAutomationDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        automation={selectedAutomation}
      />

      <DeleteAutomationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        automation={selectedAutomation}
      />
    </Container>
  );
};

export default AutomationsList; 
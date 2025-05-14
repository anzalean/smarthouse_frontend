import { Card, CardContent, Typography, IconButton, Switch, Box, Paper, Chip, useTheme, useMediaQuery } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, AccessAlarm, Sensors } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toggleAutomationStatus } from '../../redux/slices/homesSlice';
import { fadeIn, pulseEffect, scaleIn } from '../../theme/animations';

const AutomationCard = ({ automation, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(false);
  
  const handleToggle = (event) => {
    if (event) {
      event.stopPropagation();
    }

    // Не дозволяємо перемикати стан, якщо вже відбувається запит
    if (isLoading) return;

    setIsLoading(true);
    dispatch(toggleAutomationStatus(automation._id))
      .unwrap()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to toggle automation status:', error);
        setIsLoading(false);
      });
  };

  const getTriggerInfo = () => {
    if (automation.triggerType === 'time') {
      return `${t('automation.review.time')}: ${automation.timeTrigger.startTime} ${automation.timeTrigger.endTime ? `- ${automation.timeTrigger.endTime}` : ''}`;
    } else {
      return `${t('automation.review.sensor')}: ${automation.sensorTrigger.sensorType ? t(`sensor.sensorTypes.${automation.sensorTrigger.sensorType}`) : ''}`;
    }
  };

  const getBorderColor = () => {
    if (automation.isActive) {
      return theme.palette.success.main;
    }
    return theme.palette.text.disabled;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mb: { xs: 2, sm: 3 },
        borderRadius: { xs: 2, sm: 3 },
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        transform: 'translateY(0)',
        position: 'relative',
        border: `1px solid ${getBorderColor()}`,
        animation: `${scaleIn} 0.4s ease-out forwards`,
        '&:hover': {
          transform: { xs: 'none', sm: 'translateY(-5px)' },
          boxShadow: { xs: 'none', sm: '0 12px 20px -10px rgba(0,0,0,0.2)' },
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          opacity: automation.isActive ? 1 : 0.3,
          transition: 'opacity 0.3s ease'
        }}
      />
      
      <Card
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          position: 'relative',
          overflow: 'visible',
          width: '100%',
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 3 },
            '&:last-child': { pb: { xs: 2, sm: 3 } },
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 0%, rgba(255, 255, 255, 0.1) 90%)',
          }}
        >
          <Box 
            display="flex" 
            flexDirection="column" 
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
            }}
          >
            <Box 
              display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between" 
              alignItems={{ xs: 'flex-start', sm: 'flex-start' }} 
              mb={{ xs: 1.5, sm: 2 }}
              gap={{ xs: 1, sm: 0 }}
            >
              <Box width={{ xs: '100%', sm: 'auto' }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    animation: `${fadeIn} 0.5s ease-out forwards`,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    wordBreak: 'break-word',
                    width: '100%',
                  }}
                >
                  {automation.name}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  <Chip
                    icon={automation.triggerType === 'time' ? <AccessAlarm fontSize="small" /> : <Sensors fontSize="small" />}
                    label={automation.triggerType === 'time' ? t('automation.triggerTypes.time') : t('automation.triggerTypes.sensor')}
                    size="small"
                    color={automation.triggerType === 'time' ? 'primary' : 'secondary'}
                    variant="outlined"
                    sx={{ 
                      animation: `${fadeIn} 0.6s ease-out forwards`,
                      height: { xs: '24px', sm: '32px' },
                      '& .MuiChip-label': {
                        px: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                      },
                      '& .MuiChip-icon': {
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }
                    }}
                  />
                  
                  <Chip
                    label={automation.isActive ? t('automation.active') : t('automation.inactive')}
                    size="small"
                    color={automation.isActive ? 'success' : 'default'}
                    sx={{ 
                      animation: `${fadeIn} 0.7s ease-out forwards`,
                      height: { xs: '24px', sm: '32px' },
                      '& .MuiChip-label': {
                        px: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                      },
                      ...(automation.isActive && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: -4,
                          borderRadius: 'inherit',
                          animation: `${pulseEffect} 2s infinite`,
                          opacity: 0.3,
                        }
                      })
                    }}
                  />
                </Box>
              </Box>
              
              <Box 
                display="flex" 
                alignItems="center" 
                gap={0.5}
                width={{ xs: '100%', sm: 'auto' }}
                justifyContent={{ xs: 'flex-end', sm: 'flex-end' }}
                mt={{ xs: 1, sm: 0 }}
                alignSelf={{ xs: 'stretch', sm: 'flex-start' }}
                onClick={(e) => e.stopPropagation()}
                sx={{ pointerEvents: 'auto' }}
              >
                <Box position="relative" display="flex" alignItems="center">
                  <Switch
                    checked={automation.isActive}
                    onChange={(e) => handleToggle(e)}
                    onClick={(e) => e.stopPropagation()}
                    color="success"
                    edge="start"
                    disabled={isLoading}
                    size={isXsScreen ? "small" : "medium"}
                    sx={{
                      '.MuiSwitch-thumb': {
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                      '.MuiSwitch-track': {
                        opacity: 0.8,
                      },
                      '.Mui-checked': {
                        color: theme.palette.success.main,
                      },
                      '.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: theme.palette.success.light,
                      }
                    }}
                    inputProps={{ 
                      'aria-label': t('automation.toggle'),
                      'data-automation-id': automation._id
                    }}
                  />
                </Box>
                <IconButton 
                  onClick={() => onEdit(automation)} 
                  size="small" 
                  title={t('automation.editAutomation')}
                  sx={{
                    transition: 'all 0.2s ease',
                    p: { xs: 0.5, sm: 1 },
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      transform: { xs: 'none', sm: 'rotate(10deg) scale(1.1)' },
                    }
                  }}
                >
                  <EditIcon fontSize={isXsScreen ? "small" : "medium"} />
                </IconButton>
                <IconButton 
                  onClick={() => onDelete(automation)} 
                  size="small" 
                  color="error" 
                  title={t('automation.deleteAutomation')}
                  sx={{
                    transition: 'all 0.2s ease',
                    p: { xs: 0.5, sm: 1 },
                    '&:hover': {
                      backgroundColor: theme.palette.error.light,
                      color: theme.palette.error.contrastText,
                      transform: { xs: 'none', sm: 'rotate(-10deg) scale(1.1)' },
                    }
                  }}
                >
                  <DeleteIcon fontSize={isXsScreen ? "small" : "medium"} />
                </IconButton>
              </Box>
            </Box>
            
            <Typography 
              variant="body2" 
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.75rem', sm: '0.9rem' },
                animation: `${fadeIn} 0.8s ease-out forwards`,
                mb: { xs: 0.5, sm: 1 },
                wordBreak: 'break-word',
              }}
            >
              {getTriggerInfo()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default AutomationCard; 
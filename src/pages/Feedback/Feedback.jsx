import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  useTheme,
  Link,
  useMediaQuery
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Header from '../../components/Header/Header';
import { submitFeedback } from '../../redux/slices/userSlice';

const Feedback = ({ onOpenSidebar }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Отримуємо дані користувача з Redux
  const { userData } = useSelector(state => state.user);
  const { feedback: isLoading } = useSelector(state => state.ui.loaders);

  // Розширене логування для відладки
  useEffect(() => {
 
  }, [userData]);

  // Форма зі значеннями
  const [formData, setFormData] = useState({
    type: 'suggestion',
    subject: '',
    message: '',
    rating: 5,
    name: '',
    email: ''
  });

  // Для зберігання даних користувача окремо від форми
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: ''
  });

  // Встановлюємо значення даних користувача з Redux при монтуванні компонента
  useEffect(() => {
    if (userData) {
      const userName = userData.name || userData.displayName || userData.firstName || userData.fullName || 'Anonymous User';
      const userEmail = userData.email || userData.mail || userData.emailAddress || '';
      
      setUserInfo({
        name: userName,
        email: userEmail
      });
      
      // Автоматично заповнюємо форму даними користувача
      setFormData(prev => ({
        ...prev,
        name: userName,
        email: userEmail
      }));
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // eslint-disable-next-line no-unused-vars
  const handleRatingChange = (event, newValue) => {
    setFormData({
      ...formData,
      rating: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Додаємо дані користувача до форми перед відправкою
      const feedbackData = {
        ...formData,
        name: userData ? userInfo.name : formData.name,
        email: userData ? userInfo.email : formData.email
      };
      
      await dispatch(submitFeedback(feedbackData)).unwrap();
      setSnackbarMessage(t('feedback.successMessage'));
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setFormData({
        type: 'suggestion',
        subject: '',
        message: '',
        rating: 5,
        name: userData ? userInfo.name : '',
        email: userData ? userInfo.email : ''
      });
    } catch (error) {
      setSnackbarMessage(t('feedback.errorMessage'));
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box 
      sx={{ 
        display: "flex",
        flexDirection: "column",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(240, 245, 255, 0.8) 100%)',
      }}
    >
      <Header onOpenSidebar={onOpenSidebar} />
      <Container 
        maxWidth="lg"
        sx={{ 
          pt: 0,
          px: { xs: 1, sm: 2, md: 0 },
          display: 'flex',
          flexDirection: 'column', 
          flexGrow: 1
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 4 }, 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: '6px', 
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
              }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    width: 56, 
                    height: 56,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  <FeedbackIcon fontSize="large" />
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h5" component="h1" fontWeight="bold" color="primary.dark" gutterBottom sx={{ lineHeight: 1.2 }}>
                    {t('feedback.title')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('feedback.description')}
                  </Typography>
                </Box>
              </Box>
              
              <form onSubmit={handleSubmit}>
                {!userData && (
                  <>
                    <TextField
                      fullWidth
                      label={t('feedback.form.name')}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      variant="outlined"
                      margin="normal"
                      required
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '& fieldset': {
                            borderWidth: '1px',
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label={t('feedback.form.email')}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="outlined"
                      margin="normal"
                      required
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '& fieldset': {
                            borderWidth: '1px',
                          },
                        },
                      }}
                    />
                  </>
                )}
                <TextField
                  fullWidth
                  label={t('feedback.form.subject')}
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '& fieldset': {
                        borderWidth: '1px',
                      },
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label={t('feedback.form.message')}
                  name="message"
                  multiline
                  rows={8}
                  value={formData.message}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '& fieldset': {
                        borderWidth: '1px',
                      },
                    },
                  }}
                />
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 15px rgba(25, 118, 210, 0.3)',
                      }
                    }}
                  >
                    {t('feedback.form.submit')}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Card 
                elevation={0} 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <Box sx={{ 
                  p: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
                }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <SupportAgentIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600" color="secondary.dark">
                    {t('feedback.supportInfo.title')}
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3, pt: 2 }}>
                  <Typography variant="body2" paragraph color="text.secondary">
                    {t('feedback.supportInfo.description')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon 
                      sx={{ 
                        color: 'primary.main', 
                        mr: 1.5,
                        fontSize: '1.2rem',
                        transition: 'all 0.3s ease-in-out',
                      }} 
                    />
                    <Typography variant="body2" sx={{ fontWeight: '600', mr: 1 }} color="text.primary">
                      {t('feedback.supportInfo.email')}:
                    </Typography>
                    <Link
                      href="mailto:contact@smarthouse.com"
                      sx={{ 
                        color: 'primary.main', 
                        textDecoration: 'none',
                        transition: 'color 0.3s ease-in-out',
                        '&:hover': { 
                          color: 'primary.dark',
                        },
                      }}
                    >
                      {t('contactSection.email')}
                    </Link>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon 
                      sx={{ 
                        color: 'primary.main', 
                        mr: 1.5,
                        fontSize: '1.2rem',
                        transition: 'all 0.3s ease-in-out',
                      }} 
                    />
                    <Typography variant="body2" sx={{ fontWeight: '600', mr: 1 }} color="text.primary">
                      {t('feedback.supportInfo.phone')}:
                    </Typography>
                    <Link
                      href="tel:+380680944794"
                      sx={{ 
                        color: 'primary.main', 
                        textDecoration: 'none',
                        transition: 'color 0.3s ease-in-out',
                        '&:hover': { 
                          color: 'primary.dark',
                        },
                      }}
                    >
                      {t('contactSection.phone')}
                    </Link>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon 
                      sx={{ 
                        color: 'primary.main', 
                        mr: 1.5,
                        fontSize: '1.2rem',
                        transition: 'all 0.3s ease-in-out',
                      }} 
                    />
                    <Typography variant="body2" sx={{ fontWeight: '600', mr: 1 }} color="text.primary">
                      {t('feedback.supportInfo.hours')}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('contactSection.workingHours')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <Box sx={{ 
                  p: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
                }}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <CommentIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600" color="info.dark">
                    {t('feedback.tipsInfo.title')}
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3, pt: 2 }}>
                  <Typography variant="body2" paragraph color="text.secondary">
                    {t('feedback.tipsInfo.description')}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: '600', mb: 1 }} color="text.primary">
                      {t('feedback.tipsInfo.tips')}:
                    </Typography>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {t('feedback.tipsInfo.tip1')}
                      </Typography>
                      <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {t('feedback.tipsInfo.tip2')}
                      </Typography>
                      <Typography component="li" variant="body2" color="text.secondary">
                        {t('feedback.tipsInfo.tip3')}
                      </Typography>
                    </ul>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
        
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity} 
            variant="filled"
            sx={{ width: '100%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Feedback; 
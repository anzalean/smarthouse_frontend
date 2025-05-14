import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Link,
  Container,
  useMediaQuery,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { SECTION_PADDING } from '../../theme/constants';
import ScrollReveal from '../common/ScrollReveal';
import { slideInLeft, slideInRight, fadeIn } from '../../theme/animations';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { submitFeedback } from '../../redux/slices/userSlice';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const isExtraSmall = useMediaQuery('(max-width:360px)');
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { feedback: isLoading } = useSelector(state => state.ui.loaders);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(submitFeedback(formData));
  };

  return (
    <Box
      id="contact"
      sx={{
        ...SECTION_PADDING,
        bgcolor: 'background.default',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(25, 118, 210, 0.05) 0%, transparent 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <ScrollReveal animation={fadeIn}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 6,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('contactSection.title')}
          </Typography>
        </ScrollReveal>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ScrollReveal animation={slideInLeft}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                    '& .contact-icon': {
                      transform: 'scale(1.1)',
                      color: '#42a5f5',
                    },
                  },
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  {t('contactSection.contactInfo')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LocationOnIcon
                    className="contact-icon"
                    sx={{
                      color: 'primary.main',
                      mr: 2,
                      transition: 'all 0.3s ease-in-out',
                    }}
                  />
                  <Link
                    href="https://www.google.com/maps/place/%D0%9A%D0%9F%D0%86+%D0%9A%D0%BE%D1%80%D0%BF%D1%83%D1%81+5+%D0%A2%D0%95%D0%A4+i%D0%BC.+%D0%9D%D0%B5+%D0%90%D0%BD%D1%82%D0%BE%D0%BD%D0%B0+%D0%9C%D0%BE%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0/@50.449064,30.4652771,17z/data=!3m1!4b1!4m6!3m5!1s0x40d4ce8314fdfde3:0xd09dbe758a8cc765!8m2!3d50.449064!4d30.4652771!16s%2Fg%2F11bzz66xv0?entry=ttu&g_ep=EgoyMDI1MDQwNi4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease-in-out',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {t('contactSection.address')}
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PhoneIcon
                    className="contact-icon"
                    sx={{
                      color: 'primary.main',
                      mr: 2,
                      transition: 'all 0.3s ease-in-out',
                    }}
                  />
                  <Link
                    href="tel:+380680944794"
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease-in-out',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    +380 (68) 094-47-94
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon
                    className="contact-icon"
                    sx={{
                      color: 'primary.main',
                      mr: 2,
                      transition: 'all 0.3s ease-in-out',
                    }}
                  />
                  <Link
                    href="mailto:zablovskaya04@gmail.com"
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease-in-out',
                      fontSize: isExtraSmall ? '0.75rem' : 'inherit',
                      wordBreak: 'normal',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {t('contactSection.email')}
                  </Link>
                </Box>
              </Paper>
            </ScrollReveal>
          </Grid>

          <Grid item xs={12} md={6}>
            <ScrollReveal animation={slideInRight}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                  },
                }}
              >
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label={t('contactSection.form.name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t('contactSection.form.email')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t('contactSection.form.subject')}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label={t('contactSection.form.message')}
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      px: 4,
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                        background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                      },
                    }}
                  >
                    {isLoading
                      ? t('common.sending')
                      : t('contactSection.sendMessage')}
                  </Button>
                </form>
              </Paper>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection;

import { Box, Typography, Button, Container, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SECTION_PADDING } from '../../theme/constants';
import ScrollReveal from '../common/ScrollReveal';
import { floatingEffect } from '../../theme/animations';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        ...SECTION_PADDING,
        position: 'relative',
        minHeight: { xs: '80vh', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(
              rgba(255, 255, 255, 0.7),
              rgba(255, 255, 255, 0.8)
            ),
            url('/hero-house-bg.svg')
          `,
          backgroundSize: '120% auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
          opacity: 1,
        },
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <ScrollReveal>
          <Typography
            variant={isMobile ? "h3" : "h2"}
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: { xs: 2, md: 4 },
              fontSize: {
                xs: '2rem',
                sm: '2.5rem',
                md: '3rem'
              },
              textAlign: { xs: 'center', md: 'left' },
              background: 'linear-gradient(45deg, #1565c0, #1976d2)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {t('heroSection.title')}
          </Typography>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Typography
            variant={isMobile ? "body1" : "h5"}
            component="h2"
            sx={{
              mb: { xs: 4, md: 6 },
              maxWidth: '800px',
              mx: 'auto',
              px: { xs: 1, md: 0 },
              fontSize: {
                xs: '1rem',
                sm: '1.1rem',
                md: '1.25rem'
              },
              textAlign: { xs: 'center', md: 'left' },
              color: 'primary.dark',
              lineHeight: 1.6,
              fontWeight: 500,
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            {t('heroSection.subtitle')}
          </Typography>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 3 },
              justifyContent: 'center',
              '& .MuiButton-root': {
                px: { xs: 3, md: 4 },
                py: { xs: 1.2, md: 1.5 },
                borderRadius: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                },
              },
            }}
          >
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              onClick={() => navigate('/signup')}
              sx={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backdropFilter: 'blur(5px)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                },
              }}
            >
              {t('heroSection.getStarted')}
            </Button>
            <Button
              variant="outlined"
              size={isMobile ? "medium" : "large"}
              onClick={() => navigate('/login')}
              sx={{
                borderWidth: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {t('heroSection.login')}
            </Button>
          </Box>
        </ScrollReveal>
      </Container>

      {/* Декоративні елементи */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          '& > div': {
            position: 'absolute',
            background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(66, 165, 245, 0.1))',
            borderRadius: '50%',
            animation: `${floatingEffect} 3s infinite ease-in-out`,
          },
        }}
      >
        <Box sx={{ 
          width: { xs: 60, md: 100 }, 
          height: { xs: 60, md: 100 }, 
          top: '20%', 
          left: '10%', 
          animationDelay: '0s' 
        }} />
        <Box sx={{ 
          width: { xs: 90, md: 150 }, 
          height: { xs: 90, md: 150 }, 
          top: '60%', 
          right: '15%', 
          animationDelay: '1s' 
        }} />
        <Box sx={{ 
          width: { xs: 50, md: 80 }, 
          height: { xs: 50, md: 80 }, 
          bottom: '20%', 
          left: '20%', 
          animationDelay: '2s' 
        }} />
      </Box>
    </Box>
  );
};

export default HeroSection; 
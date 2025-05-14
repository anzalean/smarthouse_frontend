import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Logo from '../../components/Logo/Logo';
import { fadeIn, floatingEffect } from '../../theme/animations';
import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@mui/material';

function EmailVerification() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowX: 'hidden',
        background: `
          linear-gradient(
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.9)
          ),
          url('/hero-house-bg.svg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
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
        <Box sx={{ width: 80, height: 80, top: '20%', left: '10%', animationDelay: '0s' }} />
        <Box sx={{ width: 120, height: 120, top: '60%', right: '15%', animationDelay: '1s' }} />
        <Box sx={{ width: 60, height: 60, bottom: '20%', left: '20%', animationDelay: '2s' }} />
      </Box>

      <Container component="main" maxWidth="xs" sx={{ zIndex: 2, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            animation: `${fadeIn} 0.6s ease-out`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: { xs: 2, sm: 3 }
            }}
          >
            <Logo />
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'primary.light',
              color: 'white',
              width: isMobile ? 60 : 70,
              height: isMobile ? 60 : 70,
              borderRadius: '50%',
              mb: 2
            }}
          >
            <EmailIcon sx={{ fontSize: isMobile ? 30 : 35 }} />
          </Box>

          <Typography 
            component="h1" 
            variant={isMobile ? "h5" : "h4"} 
            align="center" 
            sx={{ 
              fontWeight: 600, 
              color: 'primary.dark', 
              mb: 1.5
            }}
          >
            {t('emailVerification.title')}
          </Typography>

          <Typography 
            variant="body2" 
            align="center" 
            sx={{ 
              mb: 1,
              color: 'text.primary',
              maxWidth: '95%'
            }}
          >
            {t('emailVerification.message')}
          </Typography>

          <Typography 
            variant="caption" 
            align="center" 
            sx={{ 
              mb: 3,
              color: 'text.secondary',
              fontStyle: 'italic',
              maxWidth: '95%'
            }}
          >
            {t('emailVerification.checkSpam')}
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              p: 1.5,
              backgroundColor: 'success.light',
              color: 'success.contrastText',
              borderRadius: 2,
              width: '100%'
            }}
          >
            <CheckCircleOutlineIcon sx={{ mr: 1, fontSize: isMobile ? 18 : 20 }} />
            <Typography variant="caption">
              {t('emailVerification.alreadyVerified')}
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {t('emailVerification.backToLogin')}
          </Button>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              align="center"
            >
              {t('emailVerification.noEmail')}{' '}
              <RouterLink 
                to="#" 
                style={{ 
                  color: 'var(--mui-palette-primary-main)',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                {t('emailVerification.resendEmail')}
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default EmailVerification; 
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TikTokIcon from '@mui/icons-material/MusicNote';
import Logo from '../Logo/Logo';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f5f7fa',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Logo />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('footer.description')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                href="https://www.facebook.com/dte.apeps.kpi/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#1976d2',
                  '&:hover': { 
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                    color: '#1a237e',
                  }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href="https://www.instagram.com/dte.kpi?igsh=ZjFnZWQ5cjNyNTJn"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#1976d2',
                  '&:hover': { 
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                    color: '#1a237e',
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href="https://www.linkedin.com/school/apeps-department-of-igor-sikorsky-kyiv-polytechnic-institute/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#1976d2',
                  '&:hover': { 
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                    color: '#1a237e',
                  }
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                href="https://www.tiktok.com/@dte.kpi?_t=ZS-8vMu8RsGPDB&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#1976d2',
                  '&:hover': { 
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                    color: '#1a237e',
                  }
                }}
              >
                <TikTokIcon sx={{ transform: 'scale(0.85)' }} />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="#1a237e" gutterBottom fontWeight={600}>
              {t('footer.quickLinks')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                onClick={() => scrollToSection('features')}
                sx={{ 
                  color: '#546e7a',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#1976d2',
                  }
                }}
              >
                {t('footer.links.features')}
              </Link>
              <Link
                onClick={() => scrollToSection('about')}
                sx={{ 
                  color: '#546e7a',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#1976d2',
                  }
                }}
              >
                {t('footer.links.aboutUs')}
              </Link>
              <Link
                onClick={() => scrollToSection('implementation')}
                sx={{ 
                  color: '#546e7a',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#1976d2',
                  }
                }}
              >
                {t('footer.links.implementation')}
              </Link>
              <Link
                onClick={() => scrollToSection('testimonials')}
                sx={{ 
                  color: '#546e7a',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#1976d2',
                  }
                }}
              >
                {t('footer.links.testimonials')}
              </Link>
              <Link
                onClick={() => scrollToSection('faq')}
                sx={{ 
                  color: '#546e7a',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#1976d2',
                  }
                }}
              >
                {t('footer.links.faq')}
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="#1a237e" gutterBottom fontWeight={600}>
              {t('footer.contactUs')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="https://www.google.com/maps/place/%D0%9A%D0%9F%D0%86+%D0%9A%D0%BE%D1%80%D0%BF%D1%83%D1%81+5+%D0%A2%D0%95%D0%A4+i%D0%BC.+%D0%9D%D0%B5+%D0%90%D0%BD%D1%82%D0%BE%D0%BD%D0%B0+%D0%9C%D0%BE%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0/@50.449064,30.4652771,17z"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#546e7a',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#1976d2',
                  }
                }}
              >
                {t('contactSection.address')}
              </Link>
              <Link
                href="tel:+380680944794"
                sx={{ 
                  color: '#546e7a',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#1976d2',
                  }
                }}
              >
                +380 (68) 094-47-94
              </Link>
              <Link
                href="mailto:zablovskaya04@gmail.com"
                sx={{ 
                  color: '#546e7a',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#1976d2',
                  }
                }}
              >
                {t('contactSection.email')}
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
        >
          © {new Date().getFullYear()} SmartHouse. {t('footer.copyright')}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 
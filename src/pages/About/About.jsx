import { useTranslation } from 'react-i18next';
import Header from '../../components/Header/Header';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  Divider,
  Link,
  useTheme
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const About = ({ onOpenSidebar, isSidebarOpen }) => {
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme();

  // Інформація про компанію
  const companyFeatures = [
    {
      id: 1,
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: t('about.features.security.title'),
      description: t('about.features.security.description')
    },
    {
      id: 2,
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: t('about.features.support.title'),
      description: t('about.features.support.description')
    },
    {
      id: 3,
      icon: <HandshakeIcon sx={{ fontSize: 40 }} />,
      title: t('about.features.reliability.title'),
      description: t('about.features.reliability.description')
    },
    {
      id: 4,
      icon: <SettingsSuggestIcon sx={{ fontSize: 40 }} />,
      title: t('about.features.customization.title'),
      description: t('about.features.customization.description')
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onOpenSidebar={onOpenSidebar} isSidebarOpen={isSidebarOpen} />
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
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            overflow: "hidden",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "5px",
              background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
            }
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ mb: 2, textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 64, 
                  height: 64,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <InfoIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                {t('about.title')}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
                {t('about.subtitle')}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom fontWeight="medium" color="primary">
                {t('about.mission.title')}
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                {t('about.mission.description')}
              </Typography>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h5" gutterBottom fontWeight="medium" color="primary" sx={{ mt: 2 }}>
                {t('about.featuresTitle')}
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {companyFeatures.map((feature) => (
                  <Grid item xs={12} sm={6} key={feature.id}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        height: '100%',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.light}40`
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                            {feature.icon}
                          </Avatar>
                          <Typography variant="h6" fontWeight="bold">
                            {feature.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h5" gutterBottom fontWeight="medium" color="primary">
                {t('about.contact.title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('about.contact.description')}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon 
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
                      '&:hover': { 
                        color: 'primary.main',
                      },
                    }}
                  >
                    zablovskaya04@gmail.com
                  </Link>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon 
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
                  <LocationOnIcon 
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
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default About; 
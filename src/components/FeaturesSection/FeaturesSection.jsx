import { Box, Typography, Grid, Paper, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SecurityIcon from '@mui/icons-material/Security';
import BatterySaverIcon from '@mui/icons-material/BatterySaver';
import DevicesIcon from '@mui/icons-material/Devices';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { SECTION_PADDING } from '../../theme/constants';
import ScrollReveal from '../common/ScrollReveal';
import { slideInLeft, slideInRight } from '../../theme/animations';
import { useTranslation } from 'react-i18next';

const FeaturesSection = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <HomeIcon sx={{ fontSize: 40 }} />,
      title: t('featuresSection.features.smartAutomation.title'),
      description: t('featuresSection.features.smartAutomation.description'),
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: t('featuresSection.features.advancedSecurity.title'),
      description: t('featuresSection.features.advancedSecurity.description'),
    },
    {
      icon: <BatterySaverIcon sx={{ fontSize: 40 }} />,
      title: t('featuresSection.features.energyEfficiency.title'),
      description: t('featuresSection.features.energyEfficiency.description'),
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      title: t('featuresSection.features.deviceIntegration.title'),
      description: t('featuresSection.features.deviceIntegration.description'),
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: t('featuresSection.features.support.title'),
      description: t('featuresSection.features.support.description'),
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: t('featuresSection.features.smartAnalytics.title'),
      description: t('featuresSection.features.smartAnalytics.description'),
    },
  ];

  return (
    <Box id="features" sx={{ 
      ...SECTION_PADDING,
      bgcolor: 'background.paper',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'linear-gradient(180deg, rgba(25, 118, 210, 0.05) 0%, transparent 100%)',
      },
    }}>
      <Container maxWidth="lg">
        <ScrollReveal>
          <Typography variant="h4" gutterBottom sx={{ 
            textAlign: 'center', 
            mb: 6,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {t('featuresSection.title')}
          </Typography>
        </ScrollReveal>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ScrollReveal 
                animation={index % 2 === 0 ? slideInLeft : slideInRight}
                delay={0.2 * index}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: { xs: 'auto', md: '300px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                      '& .icon': {
                        transform: 'scale(1.1)',
                        color: 'primary.main',
                      },
                    },
                    overflow: 'hidden',
                  }}
                >
                  <Box 
                    className="icon"
                    sx={{ 
                      color: 'primary.main',
                      mb: 2,
                      transition: 'all 0.3s ease-in-out',
                      transform: 'scale(1)',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden', width: '100%' }}>
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Paper>
              </ScrollReveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection; 
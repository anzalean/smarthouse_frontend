import { Box, Typography, Grid, Container, useMediaQuery } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import SchoolIcon from '@mui/icons-material/School';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { SECTION_PADDING } from '../../theme/constants';
import ScrollReveal from '../common/ScrollReveal';
import { fadeIn } from '../../theme/animations';
import { useTranslation } from 'react-i18next';

const ImplementationSteps = () => {
  const isExtraSmall = useMediaQuery('(max-width:360px)');
  const { t } = useTranslation();
  
  const steps = [
    {
      number: 1,
      icon: <EngineeringIcon sx={{ fontSize: isExtraSmall ? 32 : 48 }} />,
      title: t('implementationSteps.initialConsultation.title'),
      description: t('implementationSteps.initialConsultation.description'),
    },
    {
      number: 2,
      icon: <SettingsSuggestIcon sx={{ fontSize: isExtraSmall ? 32 : 48 }} />,
      title: t('implementationSteps.systemDesign.title'),
      description: t('implementationSteps.systemDesign.description'),
    },
    {
      number: 3,
      icon: <InstallMobileIcon sx={{ fontSize: isExtraSmall ? 32 : 48 }} />,
      title: t('implementationSteps.installation.title'),
      description: t('implementationSteps.installation.description'),
    },
    {
      number: 4,
      icon: <SchoolIcon sx={{ fontSize: isExtraSmall ? 32 : 48 }} />,
      title: t('implementationSteps.training.title'),
      description: t('implementationSteps.training.description'),
    },
    {
      number: 5,
      icon: <MonitorHeartIcon sx={{ fontSize: isExtraSmall ? 32 : 48 }} />,
      title: t('implementationSteps.testing.title'),
      description: t('implementationSteps.testing.description'),
    },
    {
      number: 6,
      icon: <SupportAgentIcon sx={{ fontSize: isExtraSmall ? 32 : 48 }} />,
      title: t('implementationSteps.support.title'),
      description: t('implementationSteps.support.description'),
    },
  ];

  return (
    <Box
      id="implementation"
      sx={{
        ...SECTION_PADDING,
        position: 'relative',
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
            radial-gradient(circle at 20% 20%, rgba(25, 118, 210, 0.05) 0%, transparent 20%),
            radial-gradient(circle at 80% 50%, rgba(66, 165, 245, 0.05) 0%, transparent 20%),
            radial-gradient(circle at 30% 80%, rgba(25, 118, 210, 0.05) 0%, transparent 20%)
          `,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <ScrollReveal animation={fadeIn}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              mb: { xs: 4, md: 8 },
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('implementationSteps.title')}
          </Typography>
        </ScrollReveal>

        <Box sx={{ position: 'relative', minHeight: { xs: 'auto', md: 600 } }}>
          <Grid container spacing={{ xs: 4, md: 0 }}>
            {steps.map((step, index) => (
              <Grid 
                item 
                xs={12} 
                md={6} 
                key={step.number}
                sx={{
                  position: 'relative',
                  mt: { md: index % 2 === 0 ? 0 : 20 },
                  mb: { md: index % 2 === 0 ? 20 : 0 },
                  pl: { xs: isExtraSmall ? 5 : 7, md: 0 },
                }}
              >
                <ScrollReveal
                  animation={fadeIn}
                  delay={index * 0.1}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: { xs: 'row', md: 'column' },
                      alignItems: { xs: 'flex-start', md: 'center' },
                      textAlign: { xs: 'left', md: 'center' },
                      p: { xs: isExtraSmall ? 2 : 3, md: 3 },
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        '& .step-icon': {
                          '& .number': {
                            transform: 'scale(1.2)',
                          },
                        },
                      },
                    }}
                  >
                    <Box
                      className="step-icon"
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { xs: isExtraSmall ? 60 : 80, md: 100 },
                        height: { xs: isExtraSmall ? 60 : 80, md: 100 },
                        minWidth: { xs: isExtraSmall ? 60 : 80, md: 100 },
                        mb: { xs: 0, md: 2 },
                        mr: { xs: 2, md: 0 },
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        color: 'white',
                        transition: 'all 0.6s ease-in-out',
                        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -4,
                          left: -4,
                          right: -4,
                          bottom: -4,
                          borderRadius: '50%',
                          border: '2px dashed',
                          borderColor: 'primary.main',
                          opacity: 0.5,
                          animation: 'spin 10s linear infinite',
                        },
                        '@keyframes spin': {
                          '0%': {
                            transform: 'rotate(0deg)',
                          },
                          '100%': {
                            transform: 'rotate(360deg)',
                          },
                        },
                      }}
                    >
                      {step.icon}
                      <Typography
                        className="number"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: { xs: isExtraSmall ? 24 : 32, md: 32 },
                          height: { xs: isExtraSmall ? 24 : 32, md: 32 },
                          fontSize: { xs: isExtraSmall ? '0.75rem' : '0.9rem', md: '0.9rem' },
                          borderRadius: '50%',
                          bgcolor: '#fff',
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          transition: 'transform 0.3s ease-in-out',
                          boxShadow: '0 2px 8px rgba(66, 165, 245, 0.4)',
                          border: '2px solid #42a5f5',
                        }}
                      >
                        {step.number}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1,
                          fontWeight: 600,
                          color: 'primary.main',
                          fontSize: { xs: isExtraSmall ? '0.95rem' : '1.1rem', md: '1.25rem' },
                          lineHeight: 1.3,
                          wordBreak: { xs: isExtraSmall ? 'break-word' : 'normal', md: 'normal' },
                          hyphens: { xs: isExtraSmall ? 'auto' : 'none', md: 'none' },
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.5,
                          fontSize: { xs: isExtraSmall ? '0.8rem' : '0.875rem', md: '0.875rem' },
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ImplementationSteps; 
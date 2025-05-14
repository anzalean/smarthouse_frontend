import { Box, Typography, Grid, Paper, Container } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { SECTION_PADDING } from '../../theme/constants';
import ScrollReveal from '../common/ScrollReveal';
import { slideInLeft, slideInRight, scaleIn } from '../../theme/animations';
import { useTranslation } from 'react-i18next';

const AboutSection = () => {
  const { t } = useTranslation();
  
  return (
    <Box id="about" sx={{ 
      ...SECTION_PADDING,
      bgcolor: 'background.default',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(0deg, rgba(25, 118, 210, 0.05) 0%, transparent 100%)',
        zIndex: 0,
      },
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <ScrollReveal animation={scaleIn}>
          <Typography variant="h4" gutterBottom sx={{ 
            textAlign: 'center', 
            mb: 6,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {t('aboutSection.title')}
          </Typography>
        </ScrollReveal>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ScrollReveal animation={slideInLeft}>
              <Paper elevation={3} sx={{ 
                p: 4,
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                  '& .icon': {
                    transform: 'rotate(360deg)',
                    color: '#42a5f5',
                  },
                },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <EngineeringIcon 
                    className="icon"
                    sx={{ 
                      fontSize: 40, 
                      color: 'primary.main', 
                      mr: 2,
                      transition: 'all 0.6s ease-in-out',
                    }} 
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('aboutSection.story.title')}
                  </Typography>
                </Box>
                <Typography paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {t('aboutSection.story.paragraph1')}
                </Typography>
                <Typography paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {t('aboutSection.story.paragraph2')}
                </Typography>
              </Paper>
            </ScrollReveal>
          </Grid>

          <Grid item xs={12} md={6}>
            <ScrollReveal animation={slideInRight}>
              <Paper elevation={3} sx={{ 
                p: 4,
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                  '& .icon': {
                    transform: 'rotate(360deg)',
                    color: '#42a5f5',
                  },
                },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <GroupsIcon 
                    className="icon"
                    sx={{ 
                      fontSize: 40, 
                      color: 'primary.main', 
                      mr: 2,
                      transition: 'all 0.6s ease-in-out',
                    }} 
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('aboutSection.team.title')}
                  </Typography>
                </Box>
                <Typography paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {t('aboutSection.team.paragraph1')}
                </Typography>
                <Typography paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {t('aboutSection.team.paragraph2')}
                </Typography>
              </Paper>
            </ScrollReveal>
          </Grid>

          <Grid item xs={12}>
            <ScrollReveal animation={scaleIn} delay={0.2}>
              <Paper elevation={3} sx={{ 
                p: 4,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                  '& .icon': {
                    transform: 'rotate(360deg)',
                    color: '#42a5f5',
                  },
                },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <EmojiObjectsIcon 
                    className="icon"
                    sx={{ 
                      fontSize: 40, 
                      color: 'primary.main', 
                      mr: 2,
                      transition: 'all 0.6s ease-in-out',
                    }} 
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('aboutSection.vision.title')}
                  </Typography>
                </Box>
                <Typography paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {t('aboutSection.vision.paragraph1')}
                </Typography>
                <Typography paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  {t('aboutSection.vision.paragraph2')}
                </Typography>
              </Paper>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection; 
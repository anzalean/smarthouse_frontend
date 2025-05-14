import { Box, Typography, Grid, Paper, Avatar, Container } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { SECTION_PADDING } from '../../theme/constants';
import ScrollReveal from '../common/ScrollReveal';
import { scaleIn, fadeIn } from '../../theme/animations';
import { useTranslation } from 'react-i18next';

const TestimonialsSection = () => {
  const { t } = useTranslation();
  
  const testimonials = [
    {
      image: 'https://i.pravatar.cc/150?img=1',
      name: t('testimonialsSection.testimonials.customer1.name'),
      role: t('testimonialsSection.testimonials.customer1.role'),
      quote: t('testimonialsSection.testimonials.customer1.quote'),
    },
    {
      image: 'https://i.pravatar.cc/150?img=2',
      name: t('testimonialsSection.testimonials.customer2.name'),
      role: t('testimonialsSection.testimonials.customer2.role'),
      quote: t('testimonialsSection.testimonials.customer2.quote'),
    },
    {
      image: 'https://i.pravatar.cc/150?img=3',
      name: t('testimonialsSection.testimonials.customer3.name'),
      role: t('testimonialsSection.testimonials.customer3.role'),
      quote: t('testimonialsSection.testimonials.customer3.quote'),
    },
  ];

  return (
    <Box id="testimonials" sx={{ 
      ...SECTION_PADDING,
      bgcolor: 'background.paper',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.05) 0%, transparent 70%)',
      },
    }}>
      <Container maxWidth="lg">
        <ScrollReveal animation={fadeIn}>
          <Typography variant="h4" gutterBottom sx={{ 
            textAlign: 'center', 
            mb: 6,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {t('testimonialsSection.title')}
          </Typography>
        </ScrollReveal>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <ScrollReveal animation={scaleIn} delay={0.2 * index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    height: { xs: 'auto', md: '450px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                      '& .quote-icon': {
                        opacity: 0.4,
                        transform: 'scale(1.1)',
                      },
                      '& .avatar': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                      },
                    },
                    overflow: 'hidden',
                  }}
                >
                  <FormatQuoteIcon
                    className="quote-icon"
                    sx={{
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      color: 'primary.main',
                      opacity: 0.2,
                      fontSize: 60,
                      transition: 'all 0.3s ease-in-out',
                    }}
                  />
                  <Avatar
                    src={testimonial.image}
                    className="avatar"
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mb: 2,
                      transition: 'all 0.3s ease-in-out',
                      border: '3px solid',
                      borderColor: 'primary.light',
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {testimonial.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ mb: 2, fontStyle: 'italic' }}
                  >
                    {testimonial.role}
                  </Typography>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden', width: '100%' }}>
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.8,
                        position: 'relative',
                        fontStyle: 'italic',
                        display: '-webkit-box',
                        WebkitLineClamp: 7,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        '&::before': {
                          content: 'open-quote',
                          color: 'primary.main',
                          fontSize: '1.2em',
                          fontWeight: 'bold',
                          marginRight: '4px',
                        },
                        '&::after': {
                          content: 'close-quote',
                          color: 'primary.main',
                          fontSize: '1.2em',
                          fontWeight: 'bold',
                          marginLeft: '4px',
                        },
                      }}
                    >
                      {testimonial.quote}
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

export default TestimonialsSection; 
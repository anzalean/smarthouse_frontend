import { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import SecurityIcon from '@mui/icons-material/Security';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import DevicesIcon from '@mui/icons-material/Devices';
import SupportIcon from '@mui/icons-material/Support';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { SECTION_PADDING } from '../../theme/constants';
import ScrollReveal from '../common/ScrollReveal';
import { fadeIn, scaleIn } from '../../theme/animations';
import { useTranslation } from 'react-i18next';

const SmartHomeFAQ = () => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const faqItems = [
    {
      icon: <HomeIcon />,
      question: t('faqSection.questions.whatIsSmartHome.question'),
      answer: t('faqSection.questions.whatIsSmartHome.answer'),
    },
    {
      icon: <DevicesIcon />,
      question: t('faqSection.questions.howItWorks.question'),
      answer: t('faqSection.questions.howItWorks.answer'),
    },
    {
      icon: <SecurityIcon />,
      question: t('faqSection.questions.benefits.question'),
      answer: (
        <List>
          <ListItem sx={{
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateX(10px)',
              '& .MuiListItemIcon-root': {
                color: '#42a5f5',
              },
            },
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            py: { xs: 0.5, sm: 2 },
            px: { xs: 0, sm: 2 },
          }}>
            <ListItemIcon sx={{ 
              transition: 'all 0.3s ease-in-out',
              minWidth: { xs: '32px', sm: 40 },
              mr: { xs: 0, sm: 2 },
              mb: { xs: 0, sm: 0 },
              '& > svg': {
                fontSize: { xs: '1.5rem', sm: '1.5rem' }
              }
            }}>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={t('faqSection.questions.benefits.benefits.convenience.title')} 
              secondary={t('faqSection.questions.benefits.benefits.convenience.description')}
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiListItemText-primary': {
                  fontWeight: 600,
                  color: 'primary.main',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                },
                '& .MuiListItemText-secondary': {
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                },
                m: 0,
              }}
            />
          </ListItem>
          <ListItem sx={{
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateX(10px)',
              '& .MuiListItemIcon-root': {
                color: '#42a5f5',
              },
            },
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            py: { xs: 0.5, sm: 2 },
            px: { xs: 0, sm: 2 },
          }}>
            <ListItemIcon sx={{ 
              transition: 'all 0.3s ease-in-out',
              minWidth: { xs: '32px', sm: 40 },
              mr: { xs: 0, sm: 2 },
              mb: { xs: 0, sm: 0 },
              '& > svg': {
                fontSize: { xs: '1.5rem', sm: '1.5rem' }
              }
            }}>
              <SecurityIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={t('faqSection.questions.benefits.benefits.security.title')} 
              secondary={t('faqSection.questions.benefits.benefits.security.description')}
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiListItemText-primary': {
                  fontWeight: 600,
                  color: 'primary.main',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                },
                '& .MuiListItemText-secondary': {
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                },
                m: 0,
              }}
            />
          </ListItem>
          <ListItem sx={{
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateX(10px)',
              '& .MuiListItemIcon-root': {
                color: '#42a5f5',
              },
            },
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            py: { xs: 0.5, sm: 2 },
            px: { xs: 0, sm: 2 },
          }}>
            <ListItemIcon sx={{ 
              transition: 'all 0.3s ease-in-out',
              minWidth: { xs: '32px', sm: 40 },
              mr: { xs: 0, sm: 2 },
              mb: { xs: 0, sm: 0 },
              '& > svg': {
                fontSize: { xs: '1.5rem', sm: '1.5rem' }
              }
            }}>
              <EnergySavingsLeafIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={t('faqSection.questions.benefits.benefits.energyEfficiency.title')} 
              secondary={t('faqSection.questions.benefits.benefits.energyEfficiency.description')}
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiListItemText-primary': {
                  fontWeight: 600,
                  color: 'primary.main',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                },
                '& .MuiListItemText-secondary': {
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                },
                m: 0,
              }}
            />
          </ListItem>
          <ListItem sx={{
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateX(10px)',
              '& .MuiListItemIcon-root': {
                color: '#42a5f5',
              },
            },
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            py: { xs: 0.5, sm: 2 },
            px: { xs: 0, sm: 2 },
          }}>
            <ListItemIcon sx={{ 
              transition: 'all 0.3s ease-in-out',
              minWidth: { xs: '32px', sm: 40 },
              mr: { xs: 0, sm: 2 },
              mb: { xs: 0, sm: 0 },
              '& > svg': {
                fontSize: { xs: '1.5rem', sm: '1.5rem' }
              }
            }}>
              <DevicesIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={t('faqSection.questions.benefits.benefits.scalability.title')} 
              secondary={t('faqSection.questions.benefits.benefits.scalability.description')}
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiListItemText-primary': {
                  fontWeight: 600,
                  color: 'primary.main',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                },
                '& .MuiListItemText-secondary': {
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                },
                m: 0,
              }}
            />
          </ListItem>
          <ListItem sx={{
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateX(10px)',
              '& .MuiListItemIcon-root': {
                color: '#42a5f5',
              },
            },
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            py: { xs: 0.5, sm: 2 },
            px: { xs: 0, sm: 2 },
          }}>
            <ListItemIcon sx={{ 
              transition: 'all 0.3s ease-in-out',
              minWidth: { xs: '32px', sm: 40 },
              mr: { xs: 0, sm: 2 },
              mb: { xs: 0, sm: 0 },
              '& > svg': {
                fontSize: { xs: '1.5rem', sm: '1.5rem' }
              }
            }}>
              <SupportIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={t('faqSection.questions.benefits.benefits.support.title')} 
              secondary={t('faqSection.questions.benefits.benefits.support.description')}
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiListItemText-primary': {
                  fontWeight: 600,
                  color: 'primary.main',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                },
                '& .MuiListItemText-secondary': {
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                },
                m: 0,
              }}
            />
          </ListItem>
        </List>
      ),
    },
    {
      icon: <DevicesIcon />,
      question: t('faqSection.questions.internetRequired.question'),
      answer: t('faqSection.questions.internetRequired.answer'),
    },
    {
      icon: <SupportIcon />,
      question: t('faqSection.questions.howToStart.question'),
      answer: t('faqSection.questions.howToStart.answer'),
    },
  ];

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      id="faq"
      sx={{
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
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <ScrollReveal animation={fadeIn}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <QuestionAnswerIcon
              sx={{
                fontSize: 48,
                color: 'primary.main',
                mb: 2,
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': {
                    transform: 'translateY(0)',
                  },
                  '50%': {
                    transform: 'translateY(-10px)',
                  },
                },
              }}
            />
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('faqSection.title')}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              {t('faqSection.subtitle')}
            </Typography>
          </Box>
        </ScrollReveal>

        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          {faqItems.map((item, index) => (
            <ScrollReveal
              key={index}
              animation={scaleIn}
              delay={index * 0.1}
            >
              <Accordion
                expanded={expanded === index}
                onChange={handleChange(index)}
                sx={{
                  mb: { xs: 1, sm: 2 },
                  mt: index > 0 && expanded === index - 1 ? { xs: 2, sm: 4 } : 0,
                  background: expanded === index 
                    ? 'linear-gradient(45deg, rgba(25, 118, 210, 0.08), rgba(66, 165, 245, 0.08))'
                    : 'transparent',
                  transition: 'all 0.3s ease-in-out',
                  border: '1px solid',
                  borderColor: expanded === index ? 'primary.main' : 'divider',
                  borderRadius: '8px !important',
                  boxShadow: expanded === index ? '0 8px 24px rgba(25, 118, 210, 0.15)' : 'none',
                  '&:before': {
                    display: 'none',
                  },
                  '&:hover': {
                    transform: { xs: 'translateX(4px)', sm: 'translateX(8px)' },
                    borderColor: 'primary.main',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: 'primary.main',
                        transform: expanded === index ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease-in-out',
                        fontSize: { xs: '1.2rem', sm: '1.5rem' }
                      }}
                    />
                  }
                  sx={{
                    backgroundColor: expanded === index ? 'rgba(25, 118, 210, 0.03)' : 'transparent',
                    '& .MuiAccordionSummary-content': {
                      transition: 'margin 0.3s ease-in-out',
                      margin: { xs: '12px 0', sm: '16px 0' },
                    },
                    minHeight: { xs: '48px !important', sm: 'auto' },
                    py: { xs: 0.5, sm: 1 },
                    px: { xs: 1, sm: 2 }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    width: '100%',
                    '& .question-icon': {
                      transition: 'all 0.3s ease-in-out',
                    },
                    '&:hover .question-icon': {
                      transform: 'scale(1.2)',
                      color: '#42a5f5',
                    },
                  }}>
                    <Box 
                      className="question-icon"
                      sx={{ 
                        mr: { xs: 0, sm: 2 },
                        color: expanded === index ? '#1976d2' : 'primary.main',
                        '& > svg': {
                          fontSize: { xs: '1.5rem', sm: '1.5rem' }
                        }
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        display: { xs: 'none', sm: 'block' },
                        fontSize: { xs: '0.9rem', sm: '1.1rem' },
                        fontWeight: expanded === index ? 600 : 500,
                        color: expanded === index ? '#1976d2' : 'text.primary',
                        transition: 'all 0.3s ease-in-out',
                        letterSpacing: expanded === index ? '0.3px' : 'normal',
                      }}
                    >
                      {item.question}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ 
                  backgroundColor: 'white',
                  pb: { xs: 2, sm: 4 },
                  px: { xs: 1.5, sm: 2 }
                }}>
                  <Box
                    sx={{
                      color: 'text.primary',
                      lineHeight: 1.8,
                      position: 'relative',
                      pl: { xs: 1.5, sm: 2 },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: { xs: 2, sm: 3 },
                        borderRadius: 4,
                        backgroundColor: '#1976d2',
                        opacity: 0.8,
                      },
                    }}
                  >
                    {typeof item.answer === 'string' ? (
                      item.answer.split('\n').map((line, i) => (
                        <Box
                          key={i}
                          sx={{
                            mb: line.trim() === '' ? { xs: 1.5, sm: 3 } : { xs: 1, sm: 2 },
                            opacity: 0,
                            animation: 'fadeIn 0.5s forwards',
                            animationDelay: `${i * 0.1}s`,
                            fontWeight: line.trim().startsWith('•') ? 500 : 400,
                            letterSpacing: '0.2px',
                            '@keyframes fadeIn': {
                              from: {
                                opacity: 0,
                                transform: 'translateY(10px)',
                              },
                              to: {
                                opacity: 1,
                                transform: 'translateY(0)',
                              },
                            },
                          }}
                        >
                          {line.trim() !== '' && (
                            <Typography
                              variant="body1"
                              component="div"
                              sx={{
                                color: 'text.primary',
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                lineHeight: { xs: 1.5, sm: 1.8 }
                              }}
                            >
                              {line}
                            </Typography>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ py: { xs: 0.5, sm: 1 } }}>
                        {item.answer}
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </ScrollReveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SmartHomeFAQ; 
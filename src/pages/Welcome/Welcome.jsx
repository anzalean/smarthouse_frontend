import { Box } from '@mui/material';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import HeroSection from '../../components/HeroSection/HeroSection';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import AboutSection from '../../components/AboutSection/AboutSection';
import TestimonialsSection from '../../components/TestimonialsSection/TestimonialsSection';
import ContactSection from '../../components/ContactSection/ContactSection';
import ImplementationSteps from '../../components/ImplementationSteps/ImplementationSteps';
import SmartHomeFAQ from '../../components/SmartHomeFAQ/SmartHomeFAQ';

const Welcome = () => {
  return (
    <Box>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          pt: 0
        }}
      >
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <ImplementationSteps />
        <SmartHomeFAQ />
        <TestimonialsSection />
        <ContactSection />
      </Box>
      <Footer />
    </Box>
  );
};

export default Welcome; 
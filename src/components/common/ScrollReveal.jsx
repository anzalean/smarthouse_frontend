import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { fadeIn } from '../../theme/animations';

const ScrollReveal = ({ children, animation = fadeIn, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <Box
      ref={elementRef}
      sx={{
        opacity: 0,
        animation: isVisible
          ? `${animation} 0.6s ease-out ${delay}s forwards`
          : 'none',
      }}
    >
      {children}
    </Box>
  );
};

export default ScrollReveal; 
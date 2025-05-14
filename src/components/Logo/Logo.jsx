import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { keyframes } from '@mui/system';

const logoAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const iconAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(0);
  }
  25% {
    transform: translateY(-2px) rotate(-5deg);
  }
  75% {
    transform: translateY(2px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0);
  }
`;

const Logo = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 0.5, sm: 0.75, md: 1 }, 
        cursor: 'pointer',
        width: 'fit-content',
        '&:hover': {
          '& .MuiTypography-root': {
            color: '#1a237e',
            animation: `${logoAnimation} 0.6s ease-in-out`,
            '& span': {
              color: '#1976d2',
            }
          },
          '& .MuiSvgIcon-root': {
            color: '#1a237e',
            animation: `${iconAnimation} 0.6s ease-in-out`,
          }
        }
      }}
      onClick={() => navigate('/')}
    >
      <HomeWorkIcon 
        sx={{ 
          color: '#1976d2', 
          fontSize: { xs: 24, sm: 28, md: 32 },
          transition: 'color 0.2s, transform 0.2s',
        }} 
        className="MuiSvgIcon-root" 
      />
      <Typography
        variant={isMobile ? "h6" : isTablet ? "h5" : "h5"}
        sx={{
          fontWeight: 700,
          color: '#1976d2',
          letterSpacing: '0.5px',
          fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
          transition: 'color 0.2s, transform 0.2s',
          '& span': {
            color: '#1a237e',
            transition: 'color 0.2s',
          }
        }}
      >
        Smart<span>House</span>
      </Typography>
    </Box>
  );
};

export default Logo; 
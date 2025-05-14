import { Box, Container } from '@mui/material';
import AutomationsList from '../../components/AutomationsList/AutomationsList';
import Header from '../../components/Header/Header';

const Automations = ({ onOpenSidebar, isSidebarOpen }) => {
  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(240, 245, 255, 0.8) 100%)',
    }}>
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
        <AutomationsList />
      </Container>
    </Box>
  );
};

export default Automations; 
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  CircularProgress,
  Avatar,
  Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import Header from "../../components/Header/Header";
import AddHomeDialog from "../../components/AddHomeDialog/AddHomeDialog";
import RoomsList from "../../components/common/RoomsList";
import { formatAddress } from '../../utils/formatters';
import { useAuth } from "../../hooks/useAuth";
import Admin from "../Admin/Admin";
import { fetchHomeById, fetchRoomsByHomeId } from "../../redux/slices/homesSlice";

function Home({ onOpenSidebar }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { list: homes = [], currentHome } = useSelector((state) => state.homes);
  const { homes: isHomesLoading } = useSelector(state => state.ui.loaders);
  const { user } = useAuth();
  const [openAddHomeDialog, setOpenAddHomeDialog] = useState(false);
  
  // Стан для відстеження змін будинку та його кімнат
  const [currentHomeId, setCurrentHomeId] = useState(currentHome?._id);
  
  // useEffect для оновлення кімнат при зміні будинку
  useEffect(() => {
    if (currentHome && currentHome._id !== currentHomeId) {
      // Якщо змінився поточний будинок, оновлюємо його ID в стані
      setCurrentHomeId(currentHome._id);
      
      // Також оновлюємо дані з сервера, щоб отримати актуальні відомості про роль та кімнати
      dispatch(fetchHomeById(currentHome._id));
      dispatch(fetchRoomsByHomeId(currentHome._id));
    }
  }, [currentHome, currentHomeId, dispatch]);
  
  // Якщо користувач є адміністратором, показуємо компонент Admin
  if (user?.isAdmin) {
    return <Admin />;
  }
  
  const handleOpenAddHomeDialog = () => {
    setOpenAddHomeDialog(true);
  };

  const handleCloseAddHomeDialog = () => {
    setOpenAddHomeDialog(false);
  };

  // Показуємо лоадер, коли відбувається завантаження даних про будинки
  if (isHomesLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header onOpenSidebar={onOpenSidebar} />
        <Container 
          maxWidth="lg" 
          sx={{ 
            pt: { xs: '58px', sm: '66px', md: '74px', lg: '82px' },
            mt: 4, 
            mb: 4, 
            flexGrow: 1, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" mt={2}>
              {t('common.loading')}
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(240, 245, 255, 0.8) 100%)',
    }}>
      <Header onOpenSidebar={onOpenSidebar} />
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
        {homes?.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "400px",
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
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
            <Avatar sx={{ width: 80, height: 80, mb: 3, bgcolor: 'primary.main' }}>
              <HomeIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold" color="primary.main">
              {t('home.noHomes')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleOpenAddHomeDialog}
              sx={{ 
                borderRadius: 2, 
                py: 1.5, 
                px: 4,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                }
              }}
            >
              {t('addHome.title')}
            </Button>
          </Paper>
        ) : currentHome ? (
          <Box sx={{ 
            animation: "fadeIn 0.5s ease-out",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" }
            }
          }}>
            <Paper 
              elevation={3} 
              sx={{
                p: { xs: 2, md: 4 },
                mb: 4,
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                position: "relative",
                overflow: "hidden",
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
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    width: { xs: 50, md: 64 }, 
                    height: { xs: 50, md: 64 },
                    mr: 2,
                    boxShadow: 2
                  }}
                >
                  <HomeIcon sx={{ fontSize: { xs: 30, md: 40 } }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" color="primary.dark">
                    {currentHome.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {formatAddress(currentHome, t)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", mt: 2, mb: 2, flexWrap: "wrap", gap: 2 }}>
                {currentHome.area && (
                  <Chip 
                    label={`${currentHome.area} м²`} 
                    variant="outlined" 
                    size="small" 
                    icon={<SquareFootIcon fontSize="small" />} 
                  />
                )}
              </Box>
            </Paper>

            <RoomsList homeRole={currentHome?.role} />
          </Box>
        ) : (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "300px",
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              textAlign: "center",
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
            <HomeIcon sx={{ fontSize: 60, color: "primary.main", mb: 2, opacity: 0.7 }} />
            <Typography variant="h5" fontWeight="medium" color="text.secondary" gutterBottom>
              {t('home.selectHome')}
            </Typography>
          </Paper>
        )}
      </Container>
      
      <AddHomeDialog 
        open={openAddHomeDialog} 
        onClose={handleCloseAddHomeDialog} 
      />
    </Box>
  );
}

export default Home; 
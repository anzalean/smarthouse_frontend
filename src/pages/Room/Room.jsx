import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  IconButton,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DevicesIcon from '@mui/icons-material/Devices';
import SensorsIcon from '@mui/icons-material/Sensors';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import DeviceCard from '../../components/DeviceCard';
import AddDeviceDialog from '../../components/AddDeviceDialog';
import EditDeviceDialog from '../../components/EditDeviceDialog';
import DeleteDeviceDialog from '../../components/DeleteDeviceDialog';
import SensorCard from '../../components/SensorCard';
import AddSensorDialog from '../../components/AddSensorDialog';
import EditSensorDialog from '../../components/EditSensorDialog';
import DeleteSensorDialog from '../../components/DeleteSensorDialog';
import { fetchHomeById } from '../../redux/slices/homesSlice';

// Компонент сторінки кімнати
const Room = ({ onOpenSidebar, isSidebarOpen }) => {
  const { t } = useTranslation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Отримуємо дані з Redux
  const homes = useSelector(state => state.homes.list);
  const currentHome = useSelector(state => state.homes.currentHome);
  const deviceLoading = useSelector(state => state.ui.loaders.devices);
  const sensorLoading = useSelector(state => state.ui.loaders.sensors);
  const roomLoading = useSelector(state => state.ui.loaders.rooms);
  
  // Знаходимо поточну кімнату в Redux-сторі
  let currentRoom = null;
  let actualHomeId = null;
  let actualHomeRole = null;
  
  // Спочатку шукаємо кімнату в поточному будинку
  if (currentHome?.rooms) {
    currentRoom = currentHome.rooms.find(room => room._id === roomId);
    if (currentRoom) {
      actualHomeId = currentHome._id;
      actualHomeRole = currentHome.role || 'guest';
    }
  }
  
  // Якщо кімнату не знайдено в поточному будинку, шукаємо у всіх будинках
  if (!currentRoom && homes) {
    for (const home of homes) {
      if (home.rooms) {
        currentRoom = home.rooms.find(room => room._id === roomId);
        if (currentRoom) {
          actualHomeId = home._id;
          actualHomeRole = home.role || 'guest';
          break;
        }
      }
    }
  }
  
  // Якщо ролі все ще немає, використовуємо запасне значення
  if (!actualHomeRole) {
    actualHomeRole = 'guest';
  }
  
  // Стан для відстеження ролі користувача в конкретному будинку
  const [ownerRole, setOwnerRole] = useState(actualHomeRole === 'owner');
  
  // Оновлена перевірка ролі - використовуємо роль користувача в будинку, до якого належить кімната
  const isOwner = ownerRole;
  
  // State для відстеження зміни ролі
  const [currentRole, setCurrentRole] = useState(currentHome?.role);
  
  // useEffect для відстеження змін ролі
  useEffect(() => {
    if (currentHome?.role !== currentRole) {
      setCurrentRole(currentHome?.role);
    }
  }, [currentHome, currentRole]);
  
  // useEffect для оновлення стану власника при зміні actualHomeRole
  useEffect(() => {
    setOwnerRole(actualHomeRole === 'owner');
  }, [actualHomeRole]);
  
  // Додаткова перевірка для визначення чи є користувач власником конкретного будинку
  const getOwnerStatus = () => {
    // Перевірка за actualHomeRole
    if (actualHomeRole === 'owner') return true;
    
    // Перевірка у списку всіх будинків
    if (actualHomeId && homes) {
      const matchingHome = homes.find(home => home._id === actualHomeId);
      if (matchingHome && matchingHome.role === 'owner') return true;
    }
    
    // Якщо всі перевірки не дали результату, повертаємо поточне значення
    return ownerRole;
  };
  
  // Оновлення isOwner з урахуванням додаткової перевірки
  const calculatedIsOwner = getOwnerStatus();
  
  // Застосовуємо нове значення, якщо воно відрізняється
  useEffect(() => {
    if (calculatedIsOwner !== ownerRole) {
      setOwnerRole(calculatedIsOwner);
    }
  }, [calculatedIsOwner, ownerRole]);
  
  // useEffect для оновлення стану відразу при рендерингу компонента
  useEffect(() => {
    // Встановлюємо правильне значення при першому рендерингу
    setOwnerRole(actualHomeRole === 'owner');
    
    // Силоміть оновлюємо дані будинку, до якого належить кімната
    if (actualHomeId && (!currentHome || currentHome._id !== actualHomeId)) {
      dispatch(fetchHomeById(actualHomeId))
        .unwrap()
        .then((updatedHome) => {
          // Примусово оновлюємо стан після отримання даних
          if (updatedHome && updatedHome.role) {
            setOwnerRole(updatedHome.role === 'owner');
          }
        });
    }
  }, [dispatch, actualHomeId, currentHome]);
  
  // useEffect для оновлення при зміні списку будинків
  useEffect(() => {
    // Оновлюємо власника при кожній зміні списку будинків
    if (actualHomeId && homes && homes.length > 0) {
      const matchingHome = homes.find(home => home._id === actualHomeId);
      if (matchingHome && matchingHome.role) {
        setOwnerRole(matchingHome.role === 'owner');
      }
    }
  }, [homes, actualHomeId]);
  
  // useEffect для отримання актуальних даних про будинок, до якого належить кімната 
  useEffect(() => {
    // Знаходимо поточну кімнату в Redux-сторі
    let roomFound = false;
    let actualHomeId = null;
    
    // Спочатку шукаємо кімнату в поточному будинку
    if (currentHome?.rooms) {
      const room = currentHome.rooms.find(r => r._id === roomId);
      if (room) {
        roomFound = true;
        actualHomeId = currentHome._id;
      }
    }
    
    // Якщо кімнату не знайдено в поточному будинку, шукаємо у всіх будинках
    if (!roomFound && homes) {
      for (const home of homes) {
        if (home.rooms) {
          const room = home.rooms.find(r => r._id === roomId);
          if (room) {
            roomFound = true;
            actualHomeId = home._id;
            break;
          }
        }
      }
    }
    
    // Якщо знайшли домашнє ID і це не поточний будинок, завантажуємо актуальні дані
    if (actualHomeId && (!currentHome || currentHome._id !== actualHomeId)) {
      dispatch(fetchHomeById(actualHomeId));
    }
  }, [roomId, homes, currentHome, dispatch]);
  
  // Стейт
  const [activeTab, setActiveTab] = useState(0);
  
  // Стейт для модальних вікон пристроїв
  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false);
  const [isEditDeviceDialogOpen, setIsEditDeviceDialogOpen] = useState(false);
  const [isDeleteDeviceDialogOpen, setIsDeleteDeviceDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  // Стейт для модальних вікон сенсорів
  const [isAddSensorDialogOpen, setIsAddSensorDialogOpen] = useState(false);
  const [isEditSensorDialogOpen, setIsEditSensorDialogOpen] = useState(false);
  const [isDeleteSensorDialogOpen, setIsDeleteSensorDialogOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  
  // Обробник зміни вкладки
  const handleTabChange = (event, newValue) => {
    // Оновлюємо статус власника за актуальною інформацією
    const freshOwnerStatus = getOwnerStatus();
    if (freshOwnerStatus !== ownerRole) {
      setOwnerRole(freshOwnerStatus);
    }
    
    // Встановлюємо нову вкладку
    setActiveTab(newValue);
  };
  
  // Повернення на попередню сторінку
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Обробники для роботи з модальними вікнами пристроїв
  const handleAddDeviceClick = () => {
    setIsAddDeviceDialogOpen(true);
  };
  
  const handleEditDeviceClick = (device) => {
    setSelectedDevice(device);
    setIsEditDeviceDialogOpen(true);
  };
  
  const handleDeleteDeviceClick = (device) => {
    setSelectedDevice(device);
    setIsDeleteDeviceDialogOpen(true);
  };
  
  const handleCloseAddDeviceDialog = () => {
    setIsAddDeviceDialogOpen(false);
  };
  
  const handleCloseEditDeviceDialog = () => {
    setSelectedDevice(null);
    setIsEditDeviceDialogOpen(false);
  };
  
  const handleCloseDeleteDeviceDialog = () => {
    setSelectedDevice(null);
    setIsDeleteDeviceDialogOpen(false);
  };

  // Обробники для роботи з модальними вікнами сенсорів
  const handleAddSensorClick = () => {
    setIsAddSensorDialogOpen(true);
  };
  
  const handleEditSensorClick = (sensor) => {
    setSelectedSensor(sensor);
    setIsEditSensorDialogOpen(true);
  };
  
  const handleDeleteSensorClick = (sensor) => {
    setSelectedSensor(sensor);
    setIsDeleteSensorDialogOpen(true);
  };
  
  const handleCloseAddSensorDialog = () => {
    setIsAddSensorDialogOpen(false);
  };
  
  const handleCloseEditSensorDialog = () => {
    setSelectedSensor(null);
    setIsEditSensorDialogOpen(false);
  };
  
  const handleCloseDeleteSensorDialog = () => {
    setSelectedSensor(null);
    setIsDeleteSensorDialogOpen(false);
  };

  // Компонент - картка для додавання пристрою/датчика
  const AddCard = ({ onAdd, isDevice }) => (
    <Paper
      elevation={2}
      onClick={onAdd}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          bgcolor: 'action.hover',
        },
      }}
    >
      <IconButton
        color={isDevice ? "primary" : "info"}
        sx={{
          mb: 2,
          width: 56,
          height: 56,
          backgroundColor: isDevice ? 'primary.light' : 'info.light',
          color: 'white',
          '&:hover': {
            backgroundColor: isDevice ? 'primary.main' : 'info.main',
          },
        }}
      >
        <AddIcon fontSize="large" />
      </IconButton>
      <Typography 
        variant="h6" 
        color={isDevice ? "primary.main" : "info.main"} 
        align="center" 
        gutterBottom
        sx={{
          fontWeight: 'bold',
          letterSpacing: '0.5px'
        }}
      >
        {isDevice ? t('device.addDevice', 'Додати пристрій') : t('sensor.addSensor', 'Додати датчик')}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{
          fontSize: '0.95rem'
        }}
      >
        {isDevice 
          ? t('device.addDeviceDescription', 'Додайте новий пристрій для керування у вашій кімнаті')
          : t('sensor.addSensorDescription', 'Додайте новий датчик для моніторингу у вашій кімнаті')
        }
      </Typography>
    </Paper>
  );

  // Відображення під час завантаження
  if (roomLoading) {
    return (
      <>
        <Header onOpenSidebar={onOpenSidebar} isSidebarOpen={isSidebarOpen} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh" flexDirection="column">
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {t('room.loading', 'Завантаження інформації про кімнату...')}
            </Typography>
          </Box>
        </Container>
      </>
    );
  }

  if (!currentRoom) {
    return (
      <>
        <Header onOpenSidebar={onOpenSidebar} isSidebarOpen={isSidebarOpen} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh" flexDirection="column">
            <Typography variant="h5" color="error" gutterBottom>
              {t('room.notFound', 'Кімнату не знайдено')}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{ mt: 2 }}
            >
              {t('common.back', 'Повернутися')}
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  // Отримуємо пристрої поточної кімнати
  const devices = currentRoom.devices || [];
  
  // Отримуємо сенсори поточної кімнати
  const sensors = currentRoom.sensors || [];

  // Дізнаємось homeId для поточної кімнати
  let homeId = actualHomeId;

 

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(240, 245, 255, 0.8) 100%)',
    }}>
      <Header onOpenSidebar={onOpenSidebar} isSidebarOpen={isSidebarOpen} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Верхня панель з назвою кімнати та кнопкою повернення */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 4
          }}
        >
          <IconButton
            onClick={handleGoBack}
            sx={{ 
              mr: 2,
              mt: 0.5,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(90deg, #3f51b5, #7986cb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
                letterSpacing: '0.5px'
              }}
            >
              {currentRoom?.name || t('room.loading', 'Завантаження...')}
            </Typography>
            {currentRoom && (
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  opacity: 0.8
                }}
              >
                {t(`roomTypes.${currentRoom.type}`, currentRoom.type)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Картка з вкладками */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '5px',
              background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
            }
          }}
        >
          {/* Вкладки */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                color: 'text.primary',
                opacity: 0.7,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                padding: { xs: 1, sm: 2, lg: 3 },
                minHeight: { xs: '56px', sm: 'auto', lg: '64px' },
                '&.Mui-selected': {
                  color: 'primary.main',
                  opacity: 1,
                  fontWeight: 'bold'
                },
                transition: 'all 0.3s ease',
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`
              }
            }}
          >
            <Tab
              icon={<DevicesIcon sx={{
                fontSize: { xs: '1.2rem', sm: '1.5rem', lg: '1.8rem' },
                color: activeTab === 0 ? 'primary.main' : 'text.secondary'
              }} />}
              label={t('device.devices', 'Пристрої')}
              iconPosition="start"
              sx={{
                fontWeight: activeTab === 0 ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            />
            <Tab
              icon={<SensorsIcon sx={{
                fontSize: { xs: '1.2rem', sm: '1.5rem', lg: '1.8rem' },
                color: activeTab === 1 ? 'primary.main' : 'text.secondary'
              }} />}
              label={t('sensor.sensors', 'Датчики')}
              iconPosition="start"
              sx={{
                fontWeight: activeTab === 1 ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            />
          </Tabs>

          {/* Контент вкладки пристроїв */}
          <Box sx={{ display: activeTab === 0 ? 'block' : 'none', p: { xs: 2, sm: 3, md: 4 } }}>
            {deviceLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : devices.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  textAlign="center"
                  sx={{ mb: 3, fontStyle: 'italic' }}
                >
                  {t('device.noDevices', 'У цій кімнаті ще немає пристроїв')}
                </Typography>
                {isOwner && <AddCard onAdd={handleAddDeviceClick} isDevice={true} />}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {devices.map((device) => (
                  <Grid item xs={12} sm={6} md={4} key={device._id}>
                    <DeviceCard 
                      device={device} 
                      onEdit={() => handleEditDeviceClick(device)} 
                      onDelete={() => handleDeleteDeviceClick(device)} 
                      userRole={actualHomeRole}
                    />
                  </Grid>
                ))}
                {isOwner && <Grid item xs={12} sm={6} md={4}>
                  <AddCard onAdd={handleAddDeviceClick} isDevice={true} />
                </Grid>}
              </Grid>
            )}
          </Box>

          {/* Контент вкладки датчиків */}
          <Box sx={{ display: activeTab === 1 ? 'block' : 'none', p: { xs: 2, sm: 3, md: 4 } }}>
            {sensorLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : sensors.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  textAlign="center"
                  sx={{ mb: 3, fontStyle: 'italic' }}
                >
                  {t('sensor.noSensors', 'У цій кімнаті ще немає датчиків')}
                </Typography>
                {isOwner && <AddCard onAdd={handleAddSensorClick} isDevice={false} />}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {sensors.map((sensor) => (
                  <Grid item xs={12} sm={6} md={4} key={sensor._id}>
                    <SensorCard 
                      sensor={sensor} 
                      onEdit={() => handleEditSensorClick(sensor)} 
                      onDelete={() => handleDeleteSensorClick(sensor)} 
                      userRole={actualHomeRole}
                    />
                  </Grid>
                ))}
                {isOwner && <Grid item xs={12} sm={6} md={4}>
                  <AddCard onAdd={handleAddSensorClick} isDevice={false} />
                </Grid>}
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>
      
      {/* Діалог додавання пристрою */}
      <AddDeviceDialog 
        open={isAddDeviceDialogOpen} 
        onClose={handleCloseAddDeviceDialog} 
        roomId={roomId}
        homeId={homeId}
        userRole={actualHomeRole}
      />
      
      {/* Діалог редагування пристрою */}
      <EditDeviceDialog 
        open={isEditDeviceDialogOpen} 
        onClose={handleCloseEditDeviceDialog} 
        device={selectedDevice}
        userRole={actualHomeRole}
      />
      
      {/* Діалог видалення пристрою */}
      <DeleteDeviceDialog 
        open={isDeleteDeviceDialogOpen} 
        onClose={handleCloseDeleteDeviceDialog} 
        device={selectedDevice}
        userRole={actualHomeRole}
      />
      
      {/* Діалог додавання сенсора */}
      <AddSensorDialog 
        open={isAddSensorDialogOpen} 
        onClose={handleCloseAddSensorDialog} 
        roomId={roomId}
        homeId={homeId}
        userRole={actualHomeRole}
      />
      
      {/* Діалог редагування сенсора */}
      <EditSensorDialog 
        open={isEditSensorDialogOpen} 
        onClose={handleCloseEditSensorDialog} 
        sensor={selectedSensor}
        userRole={actualHomeRole}
      />
      
      {/* Діалог видалення сенсора */}
      <DeleteSensorDialog 
        open={isDeleteSensorDialogOpen} 
        onClose={handleCloseDeleteSensorDialog} 
        sensor={selectedSensor}
        userRole={actualHomeRole}
      />
    </Box>
  );
};

export default Room; 
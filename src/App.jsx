import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, useMediaQuery, useTheme, Drawer } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Home from './pages/Home/Home';
import Welcome from './pages/Welcome/Welcome';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import UserSettings from './pages/UserSettings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';
import EditHome from './pages/EditHome/EditHome';
import Sidebar from './components/Sidebar/Sidebar';
import Help from './pages/Help/Help';
import About from './pages/About/About';
import Feedback from './pages/Feedback/Feedback';
import { DRAWER_WIDTH } from './theme/constants';
import NotFound from './pages/NotFound';
import Room from './pages/Room';
import Automations from './pages/Automations/Automations';
import Admin from './pages/Admin/Admin';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRoomsByHomeId,
  fetchDevicesByHomeId,
  fetchDevicesByRoomId,
  fetchSensorsByHomeId,
  fetchSensorsByRoomId,
  fetchAutomationsByHomeId,
} from './redux/slices/homesSlice';
// import NotificationsManager from './components/common/NotificationsManager';

export function App() {
  const theme = useTheme();
  const location = useLocation();
  const { currentHome } = useSelector(state => state.homes);
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Приватні маршрути, які потребують авторизації та мають бічну панель
  const privateRoutes = [
    '/main',
    '/settings',
    '/help',
    '/about',
    '/feedback',
    '/home',
    '/automations',
  ];

  // Всі валідні маршрути
  const validRoutes = [
    '/',
    '/login',
    '/signup',
    '/reset-password',
    '/forgot-password',
    '/email-verification',
    '/main',
    '/settings',
    '/help',
    '/about',
    '/feedback',
    '/automations',
    '/admin',
  ];

  // Визначаємо, чи це приватний маршрут
  const isPrivateRoute =
    privateRoutes.some(route => location.pathname.startsWith(route)) ||
    location.pathname.startsWith('/room/');

  // Визначаємо, чи це існуючий маршрут
  const isValidRoute =
    validRoutes.some(route => location.pathname === route) ||
    location.pathname.startsWith('/home/') || // Спеціальна перевірка для динамічних маршрутів
    location.pathname.startsWith('/room/');

  // Перевіряємо, чи є користувач адміністратором
  const isUserAdmin = userData && userData.isAdmin;

  // Визначаємо, чи потрібно показувати сайдбар
  // Не показуємо сайдбар якщо користувач адміністратор
  const shouldShowSidebar = isPrivateRoute && isValidRoute && !isUserAdmin;

  // Стан для мобільної/планшетної версії (коли сайдбар прихований за замовчуванням)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Загальний стан відкритості сайдбару
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Обробка зміни розміру екрану
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Обробка зміни маршруту
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [location.pathname, isMobile]);

  // Завантажуємо кімнати та пристрої при монтуванні компонента або зміні будинку
  useEffect(() => {
    if (currentHome?._id && !isUserAdmin) {
      // Запитуємо кімнати в будь-якому випадку при зміні будинку
      dispatch(fetchRoomsByHomeId(currentHome._id));

      // Запитуємо пристрої при зміні будинку
      dispatch(fetchDevicesByHomeId(currentHome._id));

      // Запитуємо сенсори при зміні будинку
      dispatch(fetchSensorsByHomeId(currentHome._id));

      // Запитуємо автоматизації при зміні будинку
      dispatch(fetchAutomationsByHomeId(currentHome._id));
    }
  }, [currentHome?._id, dispatch, isUserAdmin]);

  // Завантажуємо пристрої для конкретної кімнати при зміні URL
  useEffect(() => {
    // Отримуємо roomId з URL, якщо ми на сторінці кімнати
    const match = location.pathname.match(/\/room\/([^/]+)/);
    if (match && match[1] && !isUserAdmin) {
      const roomId = match[1];
      // Завантажуємо пристрої та сенсори для конкретної кімнати
      dispatch(fetchDevicesByRoomId(roomId));
      dispatch(fetchSensorsByRoomId(roomId));
    }
  }, [location.pathname, dispatch, isUserAdmin]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
      
    }
  };

  // Визначаємо висоту хедера для різних розмірів екрану
  const headerHeight = {
    xs: 48,
    sm: 56,
    md: 64,
    lg: 72,
  };

  // Тривалість анімації для швидшого відкриття/закриття
  const drawerTransitionDuration = 300; // 300ms для швидкої анімації

  // Стилі для різних типів сайдбара
  const persistentDrawerStyles = {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    display: { xs: 'none', md: 'block' },
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      boxSizing: 'border-box',
      marginTop: {
        xs: `${headerHeight.xs}px`,
        sm: `${headerHeight.sm}px`,
        md: `${headerHeight.md}px`,
        lg: `${headerHeight.lg}px`,
      },
      height: {
        xs: `calc(100% - ${headerHeight.xs}px)`,
        sm: `calc(100% - ${headerHeight.sm}px)`,
        md: `calc(100% - ${headerHeight.md}px)`,
        lg: `calc(100% - ${headerHeight.lg}px)`,
      },
      paddingTop: 0,
      overflow: 'auto',
      bgcolor: 'background.paper',
      borderRight: '1px solid rgba(0, 0, 0, 0.12)',
      borderRadius: 0,
      transition: theme.transitions.create(['transform', 'width', 'margin'], {
        easing: theme.transitions.easing.easeInOut,
        duration: drawerTransitionDuration,
      }),
    },
  };

  // Стилі для мобільного Drawer
  const temporaryDrawerStyles = {
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      boxSizing: 'border-box',
      marginTop: {
        xs: `${headerHeight.xs}px`,
        sm: `${headerHeight.sm}px`,
      },
      height: {
        xs: `calc(100% - ${headerHeight.xs}px)`,
        sm: `calc(100% - ${headerHeight.sm}px)`,
      },
      paddingTop: 2,
      overflow: 'auto',
      bgcolor: 'background.paper',
      borderRight: '1px solid rgba(0, 0, 0, 0.08)',
      transition: theme.transitions.create(['transform'], {
        easing: theme.transitions.easing.easeInOut,
        duration: drawerTransitionDuration,
      }),
    },
  };

  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            minHeight: '100vh',
            padding: 0,
            margin: 0,
            overflow: 'hidden',
          }}
        >
          {shouldShowSidebar && (
            <Drawer
              variant={isMobile ? 'temporary' : 'persistent'}
              open={sidebarOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              SlideProps={{
                timeout: drawerTransitionDuration,
              }}
              sx={isMobile ? temporaryDrawerStyles : persistentDrawerStyles}
              transitionDuration={drawerTransitionDuration}
            >
              <Sidebar />
            </Drawer>
          )}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              position: 'relative',
              padding: 0,
              margin: 0,
              width: shouldShowSidebar
                ? { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` }
                : '100%',
              marginLeft: shouldShowSidebar ? { xs: 0, md: 0 } : 0,
              transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeInOut,
                duration: drawerTransitionDuration,
              }),
              marginTop: 0,
              paddingTop: {
                xs: `${headerHeight.xs}px`,
                sm: `${headerHeight.sm}px`,
                md: `${headerHeight.md}px`,
                lg: `${headerHeight.lg}px`,
              },
              overflowY: 'auto',
              height: '100vh',
            }}
          >
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route
                path="/main"
                element={
                  <ProtectedRoute>
                    <Home
                      onOpenSidebar={handleDrawerToggle}
                      isSidebarOpen={sidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin
                      onOpenSidebar={handleDrawerToggle}
                      isSidebarOpen={sidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <UserSettings
                      onOpenSidebar={handleDrawerToggle}
                      isSidebarOpen={sidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help"
                element={
                  <ProtectedRoute>
                    <Help
                      onOpenSidebar={handleDrawerToggle}
                      isSidebarOpen={sidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <About
                      onOpenSidebar={handleDrawerToggle}
                      isSidebarOpen={sidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <Feedback
                      onOpenSidebar={handleDrawerToggle}
                      isSidebarOpen={sidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/automations"
                element={
                  <ProtectedRoute>
                    <Automations
                      onOpenSidebar={handleDrawerToggle}
                      isSidebarOpen={sidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/email-verification"
                element={<EmailVerification />}
              />
              <Route
                path="/home/:id"
                element={
                  <ProtectedRoute>
                    <Home
                      onOpenSidebar={handleDrawerToggle}
                      isSidebarOpen={sidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/home/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditHome
                      onOpenSidebar={handleDrawerToggle}
                      isSidebarOpen={sidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/room/:roomId"
                element={
                  <ProtectedRoute>
                    <Room
                      onOpenSidebar={handleDrawerToggle}
                      isSidebarOpen={sidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              {/* Тут будуть додаткові маршрути, коли відповідні сторінки будуть створені */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          {/* <NotificationsManager /> */}
        </Box>
      </LocalizationProvider>
    </AuthProvider>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header/Header';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Tabs,
  Tab,
  Divider,
  useTheme,
  Card,
  CardContent,
  alpha,
  Alert,
  AlertTitle
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { Link as RouterLink } from 'react-router-dom';

const Help = ({ onOpenSidebar, isSidebarOpen }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setExpanded(false); // Закрити всі акордеони при зміні вкладки
  };

  // Розширені детальні відповіді для FAQ
  const getEnhancedAnswer = (category, question) => {
    const answers = {
      'general-1': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.general.a1')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('help.faq.general.additionalInfo.smartHomeDefinition')}
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.light, 0.1), borderRadius: 2, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
              {t('help.faq.general.additionalInfo.mainComponents.title')}
            </Typography>
            <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
              <li><Typography variant="body2">{t('help.faq.general.additionalInfo.mainComponents.hub')}</Typography></li>
              <li><Typography variant="body2">{t('help.faq.general.additionalInfo.mainComponents.sensors')}</Typography></li>
              <li><Typography variant="body2">{t('help.faq.general.additionalInfo.mainComponents.devices')}</Typography></li>
              <li><Typography variant="body2">{t('help.faq.general.additionalInfo.mainComponents.app')}</Typography></li>
              <li><Typography variant="body2">{t('help.faq.general.additionalInfo.mainComponents.voiceAssistants')}</Typography></li>
            </ul>
          </Box>
        </>
      ),
      'general-2': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.general.a2')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('help.faq.general.additionalInfo.gettingStarted')}
          </Typography>
          <Box sx={{ mt: 2, mb: 3, bgcolor: alpha(theme.palette.success.light, 0.1), borderRadius: 2, p: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="success.main" gutterBottom>
              {t('help.faq.general.additionalInfo.steps.title')}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: alpha(theme.palette.success.light, 0.1), height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="medium" color="success.main" gutterBottom>1</Typography>
                    <Typography variant="body2">{t('help.faq.general.additionalInfo.steps.register')}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: alpha(theme.palette.success.light, 0.1), height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="medium" color="success.main" gutterBottom>2</Typography>
                    <Typography variant="body2">{t('help.faq.general.additionalInfo.steps.addHome')}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: alpha(theme.palette.success.light, 0.1), height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="medium" color="success.main" gutterBottom>3</Typography>
                    <Typography variant="body2">{t('help.faq.general.additionalInfo.steps.setupRooms')}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={0} sx={{ bgcolor: alpha(theme.palette.success.light, 0.1), height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="medium" color="success.main" gutterBottom>4</Typography>
                    <Typography variant="body2">{t('help.faq.general.additionalInfo.steps.automation')}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      ),
      'general-3': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.general.a3')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('help.faq.general.additionalInfo.internetConnection')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Box sx={{ flex: '1 1 45%', p: 2, bgcolor: alpha(theme.palette.info.light, 0.1), borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="info.main" gutterBottom>
                {t('help.faq.general.additionalInfo.offlineFunctions.title')}
              </Typography>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.offlineFunctions.lighting')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.offlineFunctions.sensors')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.offlineFunctions.temperature')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.offlineFunctions.localAutomation')}</Typography></li>
              </ul>
            </Box>
            <Box sx={{ flex: '1 1 45%', p: 2, bgcolor: alpha(theme.palette.warning.light, 0.1), borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="warning.main" gutterBottom>
                {t('help.faq.general.additionalInfo.onlineFunctions.title')}
              </Typography>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.onlineFunctions.remoteAccess')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.onlineFunctions.voice')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.onlineFunctions.notifications')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.onlineFunctions.updates')}</Typography></li>
              </ul>
            </Box>
          </Box>
        </>
      ),
      'home-1': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.home.a1')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('help.faq.home.additionalInfo.addingHome')}
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.light, 0.1), borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
              {t('help.faq.home.additionalInfo.detailedInstructions')}
            </Typography>
            <ol style={{ paddingLeft: '20px', marginBottom: '0' }}>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>{t('help.faq.home.additionalInfo.steps.openDashboard.title')}</strong> - {t('help.faq.home.additionalInfo.steps.openDashboard.description')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>{t('help.faq.home.additionalInfo.steps.findButton.title')}</strong> - {t('help.faq.home.additionalInfo.steps.findButton.description')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>{t('help.faq.home.additionalInfo.steps.fillInfo.title')}</strong> - {t('help.faq.home.additionalInfo.steps.fillInfo.description')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>{t('help.faq.home.additionalInfo.steps.addDetails.title')}</strong> - {t('help.faq.home.additionalInfo.steps.addDetails.description')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>{t('help.faq.home.additionalInfo.steps.confirm.title')}</strong> - {t('help.faq.home.additionalInfo.steps.confirm.description')}
                </Typography>
              </li>
            </ol>
          </Box>
        </>
      ),
      'home-2': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.home.a2')}
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.light, 0.1), borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight="bold" color="info.main" gutterBottom>
                  Типи користувачів:
                </Typography>
                <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                  <li><Typography variant="body2">Адміністратор - повний доступ</Typography></li>
                  <li><Typography variant="body2">Стандартний користувач - обмежений доступ</Typography></li>
                  <li><Typography variant="body2">Гість - доступ тільки для перегляду</Typography></li>
                </ul>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight="bold" color="info.main" gutterBottom>
                  Керування доступом:
                </Typography>
                <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                  <li><Typography variant="body2">Запрошення через email</Typography></li>
                  <li><Typography variant="body2">Налаштування прав доступу</Typography></li>
                  <li><Typography variant="body2">Видалення користувачів</Typography></li>
                </ul>
              </Grid>
            </Grid>
          </Box>
        </>
      ),
      'home-3': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.home.a3')}
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            <AlertTitle>Застереження</AlertTitle>
            <Typography variant="body2">
              Видалення будинку призведе до видалення всіх пов&apos;язаних даних, включаючи кімнати, пристрої та історію використання. Ця дія не може бути скасована.
            </Typography>
          </Alert>
        </>
      ),
      'devices-1': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.devices.a1')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('help.faq.devices.additionalInfo.supportedDevices')}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={1} sx={{ height: '100%', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-5px)' } }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary.dark" gutterBottom>
                    {t('help.faq.devices.additionalInfo.categories.lighting.title')}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" paragraph>
                    {t('help.faq.devices.additionalInfo.categories.lighting.description')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={1} sx={{ height: '100%', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-5px)' } }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary.dark" gutterBottom>
                    {t('help.faq.devices.additionalInfo.categories.climate.title')}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" paragraph>
                    {t('help.faq.devices.additionalInfo.categories.climate.description')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={1} sx={{ height: '100%', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-5px)' } }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary.dark" gutterBottom>
                    {t('help.faq.devices.additionalInfo.categories.security.title')}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" paragraph>
                    {t('help.faq.devices.additionalInfo.categories.security.description')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      ),
      'devices-2': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.devices.a2')}
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.light, 0.1), borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
              Кроки підключення:
            </Typography>
            <ol style={{ paddingLeft: '20px', marginBottom: '0' }}>
              <li><Typography variant="body2" sx={{ mb: 1 }}>Переконайтеся, що пристрій увімкнено і він у режимі підключення</Typography></li>
              <li><Typography variant="body2" sx={{ mb: 1 }}>Відкрийте додаток SmartHouse і перейдіть у розділ &quot;Пристрої&quot;</Typography></li>
              <li><Typography variant="body2" sx={{ mb: 1 }}>Натисніть кнопку &quot;+&quot; або &quot;Додати пристрій&quot;</Typography></li>
              <li><Typography variant="body2" sx={{ mb: 1 }}>Виберіть тип пристрою зі списку</Typography></li>
              <li><Typography variant="body2">Дотримуйтесь інструкцій на екрані для завершення підключення</Typography></li>
            </ol>
          </Box>
        </>
      ),
      'devices-3': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.devices.a3')}
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.light, 0.1), borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
              Поширені проблеми з підключенням:
            </Typography>
            <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
              <li><Typography variant="body2" sx={{ mb: 1 }}>Пристрій не в режимі підключення</Typography></li>
              <li><Typography variant="body2" sx={{ mb: 1 }}>Слабкий Wi-Fi сигнал</Typography></li>
              <li><Typography variant="body2" sx={{ mb: 1 }}>Несумісний пристрій</Typography></li>
              <li><Typography variant="body2">Застаріла версія програмного забезпечення</Typography></li>
            </ul>
          </Box>
        </>
      ),
      'account-1': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.account.a1')}
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
              {t('help.faq.account.additionalInfo.steps.title')}
            </Typography>
            <ol style={{ paddingLeft: '20px', marginBottom: '0' }}>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('help.faq.account.additionalInfo.steps.goToSettings')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('help.faq.account.additionalInfo.steps.findProfile')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('help.faq.account.additionalInfo.steps.clickEdit')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('help.faq.account.additionalInfo.steps.makeChanges')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  {t('help.faq.account.additionalInfo.steps.saveChanges')}
                </Typography>
              </li>
            </ol>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>{t('help.faq.account.additionalInfo.securityNote.title')}</AlertTitle>
            <Typography variant="body2">
              {t('help.faq.account.additionalInfo.securityNote.description')}
            </Typography>
          </Alert>
        </>
      ),
      'account-2': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.account.a2')}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary.main" gutterBottom>
              {t('help.faq.account.additionalInfo.passwordReset.title')}
            </Typography>
            <ol style={{ paddingLeft: '20px', marginBottom: '0' }}>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('help.faq.account.additionalInfo.passwordReset.goToLogin')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('help.faq.account.additionalInfo.passwordReset.clickForgot')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('help.faq.account.additionalInfo.passwordReset.enterEmail')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t('help.faq.account.additionalInfo.passwordReset.checkEmail')}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  {t('help.faq.account.additionalInfo.passwordReset.createNew')}
                </Typography>
              </li>
            </ol>
          </Box>
        </>
      ),
      'account-3': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.account.a3')}
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.error.light, 0.1), borderRadius: 2, border: `1px solid ${alpha(theme.palette.error.main, 0.3)}` }}>
            <Typography variant="subtitle2" fontWeight="bold" color="error.main" gutterBottom>
              Важливо
            </Typography>
            <Typography variant="body2" paragraph>
              Видалення облікового запису призведе до:
            </Typography>
            <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
              <li><Typography variant="body2" sx={{ mb: 1 }}>Втрати доступу до всіх ваших будинків та пристроїв</Typography></li>
              <li><Typography variant="body2" sx={{ mb: 1 }}>Видалення всіх ваших персональних даних</Typography></li>
              <li><Typography variant="body2" sx={{ mb: 1 }}>Скасування всіх активних підписок</Typography></li>
              <li><Typography variant="body2">Ця дія є незворотною</Typography></li>
            </ul>
          </Box>
        </>
      ),
      'general-4': (
        <>
          <Typography variant="body1" paragraph>
            {t('help.faq.general.a4')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Box sx={{ flex: '1 1 45%', p: 2, bgcolor: alpha(theme.palette.info.light, 0.1), borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="info.main" gutterBottom>
                {t('help.faq.general.additionalInfo.offlineFunctions.title')}
              </Typography>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.offlineFunctions.lighting')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.offlineFunctions.sensors')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.offlineFunctions.temperature')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.offlineFunctions.localAutomation')}</Typography></li>
              </ul>
            </Box>
            <Box sx={{ flex: '1 1 45%', p: 2, bgcolor: alpha(theme.palette.warning.light, 0.1), borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" color="warning.main" gutterBottom>
                {t('help.faq.general.additionalInfo.onlineFunctions.title')}
              </Typography>
              <ul style={{ paddingLeft: '20px', marginBottom: '0' }}>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.onlineFunctions.remoteAccess')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.onlineFunctions.voice')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.onlineFunctions.notifications')}</Typography></li>
                <li><Typography variant="body2">{t('help.faq.general.additionalInfo.onlineFunctions.updates')}</Typography></li>
              </ul>
            </Box>
          </Box>
        </>
      ),
      // За замовчуванням
      default: (
        <Typography variant="body1">{t(`help.faq.${category}.${question}`)}</Typography>
      )
    };

    return answers[`${category}-${question}`] || answers.default;
  };

  // FAQ по різним категоріям
  const faqCategories = [
    {
      id: 'general',
      questions: [
        {
          id: 'general-1',
          question: t('help.faq.general.q1'),
          answer: getEnhancedAnswer('general', '1')
        },
        {
          id: 'general-2',
          question: t('help.faq.general.q2'),
          answer: getEnhancedAnswer('general', '2')
        },
        {
          id: 'general-3',
          question: t('help.faq.general.q3'),
          answer: getEnhancedAnswer('general', '3')
        },
        {
          id: 'general-4',
          question: t('help.faq.general.q4'),
          answer: getEnhancedAnswer('general', '4')
        }
      ]
    },
    {
      id: 'home',
      questions: [
        {
          id: 'home-1',
          question: t('help.faq.home.q1'),
          answer: getEnhancedAnswer('home', '1')
        },
        {
          id: 'home-2',
          question: t('help.faq.home.q2'),
          answer: getEnhancedAnswer('home', '2')
        },
        {
          id: 'home-3',
          question: t('help.faq.home.q3'),
          answer: getEnhancedAnswer('home', '3')
        }
      ]
    },
    {
      id: 'devices',
      questions: [
        {
          id: 'devices-1',
          question: t('help.faq.devices.q1'),
          answer: getEnhancedAnswer('devices', '1')
        },
        {
          id: 'devices-2',
          question: t('help.faq.devices.q2'),
          answer: getEnhancedAnswer('devices', '2')
        },
        {
          id: 'devices-3',
          question: t('help.faq.devices.q3'),
          answer: getEnhancedAnswer('devices', '3')
        }
      ]
    },
    {
      id: 'account',
      questions: [
        {
          id: 'account-1',
          question: t('help.faq.account.q1'),
          answer: getEnhancedAnswer('account', '1')
        },
        {
          id: 'account-2',
          question: t('help.faq.account.q2'),
          answer: getEnhancedAnswer('account', '2')
        },
        {
          id: 'account-3',
          question: t('help.faq.account.q3'),
          answer: getEnhancedAnswer('account', '3')
        }
      ]
    }
  ];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(240, 245, 255, 0.8) 100%)',
      }}
    >
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
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
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
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ mb: 2, textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  width: 80, 
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                }}
              >
                <HelpIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="bold" 
                gutterBottom
                color="primary.dark"
                sx={{ 
                  mb: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2
                }}
              >
                {t('help.title')}
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: '800px', 
                  mx: 'auto', 
                  mb: 4,
                  px: 2,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                {t('help.subtitle')}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 4 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    mb: 4,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTabs-flexContainer': {
                      display: 'flex',
                      justifyContent: 'space-between',
                    },
                    '& .MuiTab-root': {
                      minWidth: 'auto',
                      flex: 1,
                      px: { xs: 1, md: 2 },
                      py: { xs: 1, md: 1.5 },
                    }
                  }}
                >
                  <Tab
                    label={
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}>
                        <SearchIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '1.25rem' } }} />
                        <Typography sx={{ display: { xs: 'none', md: 'block' } }}>
                          {t('help.tabs.general')}
                        </Typography>
                      </Box>
                    }
                  />
                  <Tab
                    label={
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}>
                        <HomeIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '1.25rem' } }} />
                        <Typography sx={{ display: { xs: 'none', md: 'block' } }}>
                          {t('help.tabs.home')}
                        </Typography>
                      </Box>
                    }
                  />
                  <Tab
                    label={
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}>
                        <DevicesIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '1.25rem' } }} />
                        <Typography sx={{ display: { xs: 'none', md: 'block' } }}>
                          {t('help.tabs.devices')}
                        </Typography>
                      </Box>
                    }
                  />
                  <Tab
                    label={
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}>
                        <AccountCircleIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '1.25rem' } }} />
                        <Typography sx={{ display: { xs: 'none', md: 'block' } }}>
                          {t('help.tabs.account')}
                        </Typography>
                      </Box>
                    }
                  />
                </Tabs>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                {faqCategories[tabValue].questions.map((faq) => (
                  <Accordion 
                    key={faq.id} 
                    expanded={expanded === faq.id}
                    onChange={handleAccordionChange(faq.id)}
                    elevation={0} 
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: expanded === faq.id ? 'primary.main' : 'rgba(0, 0, 0, 0.08)',
                      boxShadow: expanded === faq.id ? `0 4px 15px rgba(0, 0, 0, 0.1)` : 'none',
                      transition: 'all 0.3s ease',
                      '&:before': {
                        display: 'none',
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon 
                          sx={{ 
                            color: expanded === faq.id ? 'primary.main' : 'text.secondary',
                            fontSize: '1.5rem',
                            transition: 'transform 0.3s ease',
                            transform: expanded === faq.id ? 'rotate(180deg)' : 'rotate(0deg)'
                          }} 
                        />
                      }
                      aria-controls={`panel-${faq.id}-content`}
                      id={`panel-${faq.id}-header`}
                      sx={{ 
                        backgroundColor: expanded === faq.id ? alpha(theme.palette.primary.light, 0.1) : 'transparent',
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                          backgroundColor: expanded === faq.id ? alpha(theme.palette.primary.light, 0.1) : alpha(theme.palette.primary.light, 0.03),
                        },
                        '& .MuiAccordionSummary-content': {
                          display: 'flex',
                          alignItems: 'center',
                        }
                      }}
                    >
                      <LightbulbIcon 
                        sx={{ 
                          mr: 1.5, 
                          color: expanded === faq.id ? 'primary.main' : 'text.secondary',
                          opacity: expanded === faq.id ? 1 : 0.6,
                          transition: 'color 0.3s ease, opacity 0.3s ease'
                        }}
                      />
                      <Typography 
                        fontWeight={expanded === faq.id ? 'bold' : 'medium'} 
                        color={expanded === faq.id ? 'primary.main' : 'text.primary'}
                        sx={{ transition: 'color 0.3s ease' }}
                      >
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ 
                        p: { xs: 2, sm: 3 },
                        bgcolor: 'rgba(255, 255, 255, 0.5)',
                        borderTop: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1)
                      }}
                    >
                      {faq.answer}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              
              <Divider sx={{ my: 4, borderColor: alpha(theme.palette.primary.main, 0.2) }} />
              
              <Box sx={{ 
                textAlign: 'center', 
                mt: 4, 
                p: 4, 
                borderRadius: 3,
                bgcolor: alpha(theme.palette.info.light, 0.08),
                boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.03)'
              }}>
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: 'info.main',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <ContactSupportIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  fontWeight="bold"
                  color="info.dark"
                >
                  {t('help.notFound')}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 3, 
                    maxWidth: '650px',
                    mx: 'auto'
                  }}
                >
                  {t('help.contactUs')}
                </Typography>
                
                <Button 
                  variant="contained" 
                  component={RouterLink}
                  to="/feedback"
                  color="info"
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                    transition: 'all 0.3s ease',
                    background: `linear-gradient(45deg, ${theme.palette.info.dark}, ${theme.palette.info.main})`,
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 15px rgba(25, 118, 210, 0.3)',
                    }
                  }}
                >
                  {t('help.goToContact')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Help; 
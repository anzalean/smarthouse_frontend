import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import Header from '../../components/Header/Header';
import { fetchHomeById, updateHomeDetails } from '../../redux/slices/homesSlice';
import { formatAddress } from '../../utils/formatters';
import { setLoader, addNotification } from '../../redux/slices/uiSlice';
import MembersList from '../../components/MembersList/MembersList';

// Функція для безпечного перетворення значень в числа
const safeNumberConversion = (value, defaultValue = 0) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  
  const number = Number(value);
  return isNaN(number) ? defaultValue : number;
};

// Компонент, що представляє панель з вмістом вкладки
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

// Функція для визначення атрибутів для вкладок
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const EditHome = ({ onOpenSidebar, isSidebarOpen }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentHome } = useSelector((state) => state.homes);
  const { homes: homesLoading, saveHome: saveHomeLoading } = useSelector((state) => state.ui.loaders);
  
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  // Визначення isLoading через редакс
  const isLoading = homesLoading || !formData;
  
  // Завантаження даних будинку при монтуванні компонента
  useEffect(() => {
    if (id) {
      dispatch(fetchHomeById(id));
    }
  }, [id, dispatch]);
  
  // Встановлення даних форми коли будинок завантажено
  useEffect(() => {
    if (currentHome && currentHome._id === id) {
      // Забезпечуємо, що об'єкт configuration існує
      const configuration = currentHome.configuration || {};
      
      // Виводимо дані про площу для діагностики
      
      
      // Визначаємо площу будинку
      const area = safeNumberConversion(configuration.totalArea, 0);
      
      
      
      const homeData = {
        name: currentHome.name || '',
        type: currentHome.type || 'house',
        configuration: {
          floors: configuration.floors || 1,
          totalArea: area,
          timezone: configuration.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        status: currentHome.status || 'active'
      };
      
      let addressData = {};
      if (currentHome.addressId) {
        addressData = {
          country: currentHome.addressId.country || '',
          region: currentHome.addressId.region || '',
          city: currentHome.addressId.city || '',
          street: currentHome.addressId.street || '',
          buildingNumber: currentHome.addressId.buildingNumber || '',
          isApartment: currentHome.addressId.isApartment || false,
          apartmentNumber: currentHome.addressId.apartmentNumber || '',
          postalCode: currentHome.addressId.postalCode || '',
          floor: currentHome.addressId.floor || '',
          entrance: currentHome.addressId.entrance || '',
          additionalInfo: currentHome.addressId.additionalInfo || ''
        };
      } else if (currentHome.address) {
        addressData = {
          country: currentHome.address.country || '',
          region: currentHome.address.region || '',
          city: currentHome.address.city || '',
          street: currentHome.address.street || '',
          buildingNumber: currentHome.address.buildingNumber || '',
          isApartment: currentHome.address.isApartment || false,
          apartmentNumber: currentHome.address.apartmentNumber || '',
          postalCode: currentHome.address.postalCode || '',
          floor: currentHome.address.floor || '',
          entrance: currentHome.address.entrance || '',
          additionalInfo: currentHome.address.additionalInfo || ''
        };
      }
      
      // Встановлюємо дані форми
      setFormData({
        homeData,
        addressData
      });
      
      // Очищаємо помилки при завантаженні даних
      setErrors({});
      setTouchedFields({});
    }
  }, [currentHome, id]);
  
  // Обробник зміни вкладки
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Обробник зміни значень форми
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      const [section, field, subField] = parts;
      
      if (parts.length === 2) {
        if (section === 'homeData' && field === 'type') {
          // Якщо змінюється тип будинку, оновлюємо також isApartment
          const isApartment = value === 'apartment';
          setFormData(prev => ({
            ...prev,
            [section]: {
              ...prev[section],
              [field]: value,
            },
            addressData: {
              ...prev.addressData,
              isApartment: isApartment
            }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [section]: {
              ...prev[section],
              [field]: value,
            }
          }));
        }
      } else if (parts.length === 3) {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: {
              ...prev[section][field],
              [subField]: value
            }
          }
        }));
      }
      
      // Відзначаємо поле як таке, з яким взаємодіяв користувач
      setTouchedFields(prev => ({
        ...prev,
        [name]: true
      }));
      
      // Валідація поля лише якщо це зміна від користувача
      validateField(name, value);
    }
  };
  
  // Валідація окремого поля
  const validateField = (fieldName, value) => {
    let error = null;
    
    // Розбиваємо ім'я поля
    const parts = fieldName.split('.');
    const [parent, child, subChild] = parts;
    
    if (parent === 'homeData') {
      if (child === 'name') {
        if (!value || value.trim() === '') {
          error = t('addHome.validation.required.name');
        } else if (value.trim().length < 2 || value.trim().length > 50) {
          error = t('addHome.validation.length.name');
        }
      } else if (child === 'configuration' && subChild === 'floors') {
        if (value < 1) {
          error = t('addHome.validation.minValue.floors');
        } else if (value > 200) {
          error = t('addHome.validation.maxValue.floors');
        }
      } else if (child === 'configuration' && subChild === 'totalArea') {
        if (value <= 0) {
          error = t('addHome.validation.minValue.area');
        }
      }
    } else if (parent === 'addressData') {
      switch (child) {
        case 'country':
          if (!value || value.trim() === '') {
            error = t('addHome.validation.required.country');
          } else if (value.trim().length < 2 || value.trim().length > 50) {
            error = t('addHome.validation.length.country');
          }
          break;
          
        case 'region':
          if (!value || value.trim() === '') {
            error = t('addHome.validation.required.region');
          } else if (value.trim().length < 2 || value.trim().length > 50) {
            error = t('addHome.validation.length.region');
          }
          break;
          
        case 'city':
          if (!value || value.trim() === '') {
            error = t('addHome.validation.required.city');
          } else if (value.trim().length < 2 || value.trim().length > 50) {
            error = t('addHome.validation.length.city');
          }
          break;
          
        case 'street':
          if (!value || value.trim() === '') {
            error = t('addHome.validation.required.street');
          } else if (value.trim().length < 2 || value.trim().length > 100) {
            error = t('addHome.validation.length.street');
          }
          break;
          
        case 'buildingNumber':
          if (!value || value.trim() === '') {
            error = t('addHome.validation.required.buildingNumber');
          } else if (value.trim().length < 1 || value.trim().length > 20) {
            error = t('addHome.validation.length.buildingNumber');
          }
          break;
          
        case 'apartmentNumber':
          if (formData.homeData.type === 'apartment' && (!value || value.trim() === '')) {
            error = t('addHome.validation.required.apartmentNumber');
          }
          break;
          
        case 'postalCode':
          if (value && (value.length < 5 || value.length > 10 || !/^[a-zA-Z0-9\s-]+$/.test(value))) {
            error = t('addHome.validation.format.postalCode');
          }
          break;
          
        default:
          break;
      }
    }
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    
    return !error;
  };
  
  // Валідація всієї форми
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    // Валідація деталей будинку
    if (!formData.homeData.name || formData.homeData.name.trim() === '') {
      newErrors['homeData.name'] = t('addHome.validation.required.name');
      isValid = false;
    } else if (formData.homeData.name.trim().length < 2 || formData.homeData.name.trim().length > 50) {
      newErrors['homeData.name'] = t('addHome.validation.length.name');
      isValid = false;
    }
    
    // Перевіряємо тип будинку
    if (!['house', 'apartment'].includes(formData.homeData.type)) {
      newErrors['homeData.type'] = t('addHome.validation.invalid.type');
      isValid = false;
    }
    
    // Перевіряємо статус будинку
    if (!['active', 'maintenance', 'inactive'].includes(formData.homeData.status)) {
      newErrors['homeData.status'] = t('addHome.validation.invalid.status');
      isValid = false;
    }
    
    // Перевірка кількості поверхів для будинку
    if (formData.homeData.type === 'house') {
      const floors = Number(formData.homeData.configuration.floors);
      if (isNaN(floors) || floors < 1) {
        newErrors['homeData.configuration.floors'] = t('addHome.validation.minValue.floors');
        isValid = false;
      } else if (floors > 200) {
        newErrors['homeData.configuration.floors'] = t('addHome.validation.maxValue.floors');
        isValid = false;
      }
    }
    
    // Перевірка площі будинку
    const totalArea = Number(formData.homeData.configuration.totalArea);
    if (isNaN(totalArea) || totalArea <= 0) {
      newErrors['homeData.configuration.totalArea'] = t('addHome.validation.minValue.area');
      isValid = false;
    }
    
    // Валідація адреси
    const requiredAddressFields = [
      { field: 'country', minLength: 2, maxLength: 50 },
      { field: 'region', minLength: 2, maxLength: 50 },
      { field: 'city', minLength: 2, maxLength: 50 },
      { field: 'street', minLength: 2, maxLength: 100 },
      { field: 'buildingNumber', minLength: 1, maxLength: 20 }
    ];
    
    // Перевіряємо кожне обов'язкове поле адреси
    requiredAddressFields.forEach(({ field, minLength, maxLength }) => {
      const value = formData.addressData[field]?.trim() || '';
      
      if (!value) {
        newErrors[`addressData.${field}`] = t(`addHome.validation.required.${field}`);
        isValid = false;
      } else if (value.length < minLength || value.length > maxLength) {
        newErrors[`addressData.${field}`] = t(`addHome.validation.length.${field}`);
        isValid = false;
      }
    });
    
    // Для апартаментів перевіряємо номер квартири
    if (formData.homeData.type === 'apartment') {
      const apartmentNumber = formData.addressData.apartmentNumber?.trim() || '';
      if (!apartmentNumber) {
        newErrors['addressData.apartmentNumber'] = t('addHome.validation.required.apartmentNumber');
        isValid = false;
      }
    }
    
    // Перевірка поштового індексу, якщо він вказаний
    if (formData.addressData.postalCode) {
      const postalCode = formData.addressData.postalCode.trim();
      if (postalCode && (postalCode.length < 5 || postalCode.length > 10 || !/^[a-zA-Z0-9\s-]+$/.test(postalCode))) {
        newErrors['addressData.postalCode'] = t('addHome.validation.format.postalCode');
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Обробник збереження змін
  const handleSave = async () => {
    if (!validateForm()) {
      // Якщо є помилки, переключаємось на вкладку з першою помилкою
      const hasHomeDataErrors = Object.keys(errors).some(key => key.startsWith('homeData.') && errors[key]);
      const hasAddressDataErrors = Object.keys(errors).some(key => key.startsWith('addressData.') && errors[key]);
      
      if (hasHomeDataErrors && tabValue !== 0) {
        setTabValue(0);
      } else if (hasAddressDataErrors && tabValue !== 1) {
        setTabValue(1);
      }
      
      // Встановлюємо всі поля як такі, з якими взаємодіяв користувач
      const touchedFields = {};
      Object.keys(errors).forEach(field => {
        touchedFields[field] = true;
      });
      
      setTouchedFields(prev => ({
        ...prev,
        ...touchedFields
      }));
      
      return;
    }
    
    // Замінюємо на dispatching лоадера через редакс
    dispatch(setLoader({ name: 'saveHome', active: true }));
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      // Підготовка даних перед відправкою, гарантуємо правильні типи даних та очищення від пробілів
      const preparedData = {
        homeData: {
          ...formData.homeData,
          name: formData.homeData.name.trim(),
          configuration: {
            ...formData.homeData.configuration,
            totalArea: Number(formData.homeData.configuration.totalArea) || 0,
            floors: formData.homeData.type === 'house' 
              ? (Number(formData.homeData.configuration.floors) || 1) 
              : 1
          }
        },
        addressData: {
          ...formData.addressData,
          // Очищаємо всі текстові поля від початкових і кінцевих пробілів
          country: formData.addressData.country.trim(),
          region: formData.addressData.region.trim(),
          city: formData.addressData.city.trim(),
          street: formData.addressData.street.trim(),
          buildingNumber: formData.addressData.buildingNumber.trim(),
          apartmentNumber: formData.addressData.apartmentNumber?.trim() || '',
          postalCode: formData.addressData.postalCode?.trim() || '',
          isApartment: formData.homeData.type === 'apartment',
          floor: formData.addressData.floor ? `${Number(formData.addressData.floor) || 0}` : '',
          entrance: formData.addressData.entrance?.trim() || '',
          additionalInfo: formData.addressData.additionalInfo?.trim() || ''
        }
      };
      
    
      
      await dispatch(updateHomeDetails({ id, data: preparedData })).unwrap();
      // Встановлюємо стан успішного збереження
      dispatch(setLoader({ name: 'saveHome', active: false }));
      setSaveSuccess(true);
      
      // Показуємо сповіщення через редакс
      dispatch(addNotification({
        type: 'success',
        message: t('editHome.success')
      }));
      
      // Перезавантажуємо дані будинку
      dispatch(fetchHomeById(id));
      
      // Перехід на сторінку будинку після успішного збереження
      setTimeout(() => {
        navigate(`/home/${id}`);
      }, 1500);
    } catch (error) {
      // Встановлюємо стан помилки
      dispatch(setLoader({ name: 'saveHome', active: false }));
      const errorMessage = error.message || t('editHome.error');
      setSaveError(errorMessage);
      
      // Показуємо сповіщення про помилку через редакс
      dispatch(addNotification({
        type: 'error',
        message: errorMessage
      }));
    }
  };
  
  // Обробник повернення назад
  const handleBack = () => {
    navigate(-1); // Повернення на попередню сторінку
  };
  
  // Підготовка UI в залежності від стану завантаження
  if (isLoading && (!currentHome || currentHome._id !== id || !formData)) {
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
  
  if (!currentHome) {
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
            pt: { xs: '58px', sm: '66px', md: '74px', lg: '82px' },
            mt: 4, 
            mb: 4 
          }}
        >
          <Alert severity="error">{t('editHome.notFound')}</Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            {t('common.back')}
          </Button>
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
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            {t('common.back')}
          </Button>
          <Typography variant="h4" component="h1">
            {t('editHome.title')}
          </Typography>
        </Box>
        
        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t('editHome.success')}
          </Alert>
        )}
        
        {saveError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {saveError}
          </Alert>
        )}
        
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {currentHome.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {formatAddress(currentHome, t)}
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleChangeTab} 
              aria-label="edit home tabs"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 100,
                  fontSize: '1rem',
                  fontWeight: 500,
                  py: 1.5,
                },
              }}
            >
              <Tab 
                label={t('editHome.tabs.details')} 
                icon={<HomeIcon />} 
                iconPosition="start" 
                {...a11yProps(0)} 
              />
              <Tab 
                label={t('editHome.tabs.address')} 
                icon={<LocationOnIcon />} 
                iconPosition="start" 
                {...a11yProps(1)} 
              />
              <Tab 
                label={t('home.members.title')} 
                icon={<PeopleIcon />} 
                iconPosition="start" 
                {...a11yProps(2)} 
              />
            </Tabs>
          </Box>
          
          {/* Вкладка з деталями будинку */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('addHome.details.name')}
                  name="homeData.name"
                  value={formData.homeData.name}
                  onChange={handleChange}
                  error={touchedFields['homeData.name'] && !!errors['homeData.name']}
                  helperText={(touchedFields['homeData.name'] && errors['homeData.name']) || t('addHome.validation.helperText.name')}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="home-type-label">{t('addHome.houseType.typeLabel')}</InputLabel>
                  <Select
                    labelId="home-type-label"
                    name="homeData.type"
                    value={formData.homeData.type}
                    onChange={handleChange}
                    label={t('addHome.houseType.typeLabel')}
                  >
                    <MenuItem value="house">{t('addHome.houseType.house')}</MenuItem>
                    <MenuItem value="apartment">{t('addHome.houseType.apartment')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {formData.homeData.type === 'house' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label={t('addHome.details.floors')}
                    name="homeData.configuration.floors"
                    value={formData.homeData.configuration.floors}
                    onChange={handleChange}
                    error={touchedFields['homeData.configuration.floors'] && !!errors['homeData.configuration.floors']}
                    helperText={(touchedFields['homeData.configuration.floors'] && errors['homeData.configuration.floors']) || t('addHome.validation.helperText.floors')}
                    margin="normal"
                    inputProps={{ min: 1, max: 200 }}
                  />
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('addHome.details.area')}
                  name="homeData.configuration.totalArea"
                  value={formData.homeData.configuration.totalArea}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = safeNumberConversion(value, 0);
                    setFormData(prev => ({
                      ...prev,
                      homeData: {
                        ...prev.homeData,
                        configuration: {
                          ...prev.homeData.configuration,
                          totalArea: numValue
                        }
                      }
                    }));
                    
                    // Відзначаємо поле як таке, з яким взаємодіяв користувач
                    setTouchedFields(prev => ({
                      ...prev,
                      'homeData.configuration.totalArea': true
                    }));
                    
                    // Валідація
                    validateField('homeData.configuration.totalArea', numValue);
                  }}
                  error={touchedFields['homeData.configuration.totalArea'] && !!errors['homeData.configuration.totalArea']}
                  helperText={(touchedFields['homeData.configuration.totalArea'] && errors['homeData.configuration.totalArea']) || t('addHome.validation.helperText.area')}
                  margin="normal"
                  inputProps={{ min: 1 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">м²</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="home-status-label">{t('addHome.details.status')}</InputLabel>
                  <Select
                    labelId="home-status-label"
                    name="homeData.status"
                    value={formData.homeData.status}
                    onChange={handleChange}
                    label={t('addHome.details.status')}
                  >
                    <MenuItem value="active">{t('addHome.details.statusActive')}</MenuItem>
                    <MenuItem value="maintenance">{t('addHome.details.statusMaintenance')}</MenuItem>
                    <MenuItem value="inactive">{t('addHome.details.statusInactive')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('addHome.details.timezone')}
                  name="homeData.configuration.timezone"
                  value={formData.homeData.configuration.timezone}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Вкладка з адресою */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('addHome.address.country')}
                  name="addressData.country"
                  value={formData.addressData.country}
                  onChange={handleChange}
                  error={touchedFields['addressData.country'] && !!errors['addressData.country']}
                  helperText={(touchedFields['addressData.country'] && errors['addressData.country']) || t('addHome.validation.helperText.country')}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('addHome.address.region')}
                  name="addressData.region"
                  value={formData.addressData.region}
                  onChange={handleChange}
                  error={touchedFields['addressData.region'] && !!errors['addressData.region']}
                  helperText={(touchedFields['addressData.region'] && errors['addressData.region']) || t('addHome.validation.helperText.region')}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('addHome.address.city')}
                  name="addressData.city"
                  value={formData.addressData.city}
                  onChange={handleChange}
                  error={touchedFields['addressData.city'] && !!errors['addressData.city']}
                  helperText={(touchedFields['addressData.city'] && errors['addressData.city']) || t('addHome.validation.helperText.city')}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('addHome.address.street')}
                  name="addressData.street"
                  value={formData.addressData.street}
                  onChange={handleChange}
                  error={touchedFields['addressData.street'] && !!errors['addressData.street']}
                  helperText={(touchedFields['addressData.street'] && errors['addressData.street']) || t('addHome.validation.helperText.street')}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('addHome.address.buildingNumber')}
                  name="addressData.buildingNumber"
                  value={formData.addressData.buildingNumber}
                  onChange={handleChange}
                  error={touchedFields['addressData.buildingNumber'] && !!errors['addressData.buildingNumber']}
                  helperText={(touchedFields['addressData.buildingNumber'] && errors['addressData.buildingNumber']) || t('addHome.validation.helperText.buildingNumber')}
                  margin="normal"
                />
              </Grid>
              
              {formData.homeData.type === 'apartment' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('addHome.address.apartmentNumber')}
                    name="addressData.apartmentNumber"
                    value={formData.addressData.apartmentNumber}
                    onChange={handleChange}
                    error={touchedFields['addressData.apartmentNumber'] && !!errors['addressData.apartmentNumber']}
                    helperText={(touchedFields['addressData.apartmentNumber'] && errors['addressData.apartmentNumber']) || t('addHome.validation.helperText.apartmentNumber')}
                    margin="normal"
                  />
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('addHome.address.postalCode')}
                  name="addressData.postalCode"
                  value={formData.addressData.postalCode}
                  onChange={handleChange}
                  error={touchedFields['addressData.postalCode'] && !!errors['addressData.postalCode']}
                  helperText={(touchedFields['addressData.postalCode'] && errors['addressData.postalCode']) || t('addHome.validation.helperText.postalCode')}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('addHome.address.floor')}
                  name="addressData.floor"
                  value={formData.addressData.floor}
                  onChange={handleChange}
                  margin="normal"
                  type="number"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('addHome.address.entrance')}
                  name="addressData.entrance"
                  value={formData.addressData.entrance}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('addHome.address.additionalInfo')}
                  name="addressData.additionalInfo"
                  value={formData.addressData.additionalInfo}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Нова вкладка для управління учасниками */}
          <TabPanel value={tabValue} index={2}>
            <MembersList />
          </TabPanel>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSave}
              disabled={saveHomeLoading}
              startIcon={saveHomeLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {saveHomeLoading ? t('common.saving') : t('common.save')}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditHome; 
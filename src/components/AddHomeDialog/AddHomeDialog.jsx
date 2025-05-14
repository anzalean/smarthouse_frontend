import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Grid,
  Divider,
  IconButton,
  FormHelperText,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createHome } from '../../redux/slices/homesSlice';

const AddHomeDialog = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { saveHome: isLoading } = useSelector(state => state.ui.loaders);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  
  const STEPS = [
    t('addHome.steps.houseType'),
    t('addHome.steps.address'),
    t('addHome.steps.details')
  ];
  
  const [formData, setFormData] = useState({
    homeData: {
      name: '',
      type: 'house', // 'house' або 'apartment'
      configuration: {
        floors: 1,
        totalArea: 0,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      status: 'active'
    },
    addressData: {
      country: '',
      region: '',
      city: '',
      postalCode: '',
      street: '',
      buildingNumber: '',
      isApartment: false,
      apartmentNumber: '',
      floor: '',
      entrance: '',
      additionalInfo: ''
    }
  });

  // Валідація полів для кожного кроку
  const validateStep = useCallback((step) => {
    const newErrors = {};
    let isValid = true;
    
    switch (step) {
      case 0:
        // Валідація типу будинку
        if (!formData.homeData.type) {
          newErrors['homeData.type'] = 'Тип будинку обов\'язковий';
          isValid = false;
        }
        break;
        
      case 1:
        // Валідація адреси
        if (!formData.addressData.country || formData.addressData.country.trim().length < 2) {
          newErrors['addressData.country'] = t('addHome.validation.required.country');
          isValid = false;
        } else if (formData.addressData.country.trim().length > 50) {
          newErrors['addressData.country'] = t('addHome.validation.length.country');
          isValid = false;
        }
        
        if (!formData.addressData.region || formData.addressData.region.trim().length < 2) {
          newErrors['addressData.region'] = t('addHome.validation.required.region');
          isValid = false;
        } else if (formData.addressData.region.trim().length > 50) {
          newErrors['addressData.region'] = t('addHome.validation.length.region');
          isValid = false;
        }
        
        if (!formData.addressData.city || formData.addressData.city.trim().length < 2) {
          newErrors['addressData.city'] = t('addHome.validation.required.city');
          isValid = false;
        } else if (formData.addressData.city.trim().length > 50) {
          newErrors['addressData.city'] = t('addHome.validation.length.city');
          isValid = false;
        }
        
        if (!formData.addressData.street || formData.addressData.street.trim().length < 2) {
          newErrors['addressData.street'] = t('addHome.validation.required.street');
          isValid = false;
        } else if (formData.addressData.street.trim().length > 100) {
          newErrors['addressData.street'] = t('addHome.validation.length.street');
          isValid = false;
        }
        
        if (!formData.addressData.buildingNumber || formData.addressData.buildingNumber.trim() === '') {
          newErrors['addressData.buildingNumber'] = t('addHome.validation.required.buildingNumber');
          isValid = false;
        } else if (formData.addressData.buildingNumber.trim().length > 20) {
          newErrors['addressData.buildingNumber'] = t('addHome.validation.length.buildingNumber');
          isValid = false;
        }
        
        if (formData.homeData.type === 'apartment' && 
            (!formData.addressData.apartmentNumber || formData.addressData.apartmentNumber.trim() === '')) {
          newErrors['addressData.apartmentNumber'] = t('addHome.validation.required.apartmentNumber');
          isValid = false;
        }
        
        // Валідація поштового індексу, якщо він заповнений
        if (formData.addressData.postalCode && !/^[a-zA-Z0-9\s-]+$/.test(formData.addressData.postalCode)) {
          newErrors['addressData.postalCode'] = t('addHome.validation.format.postalCode');
          isValid = false;
        }
        break;
        
      case 2:
        // Валідація деталей будинку
        if (!formData.homeData.name || formData.homeData.name.trim() === '') {
          newErrors['homeData.name'] = t('addHome.validation.required.name');
          isValid = false;
        } else if (formData.homeData.name.trim().length < 2 || formData.homeData.name.trim().length > 50) {
          newErrors['homeData.name'] = t('addHome.validation.length.name');
          isValid = false;
        }
        
        if (formData.homeData.type === 'house') {
          if (formData.homeData.configuration.floors < 1) {
            newErrors['homeData.configuration.floors'] = t('addHome.validation.minValue.floors');
            isValid = false;
          } else if (formData.homeData.configuration.floors > 200) {
            newErrors['homeData.configuration.floors'] = t('addHome.validation.maxValue.floors');
            isValid = false;
          }
        }
        
        if (formData.homeData.configuration.totalArea <= 0) {
          newErrors['homeData.configuration.totalArea'] = t('addHome.validation.minValue.area');
          isValid = false;
        }
        break;
        
      default:
        return true;
    }
    
    setErrors(newErrors);
    return isValid;
  }, [formData, t]);

  // Модифікуємо useEffect, щоб він не викликав валідацію при відкритті форми
  useEffect(() => {
    // Скидаємо стан полів, з якими взаємодіяв користувач, при зміні кроку
    if (open) {
      setTouchedFields({});
      setErrors({});
    }
  }, [activeStep, open]);

  // Функція для повної валідації полів
  const validateField = (name, value) => {
    let error = null;
    
    // Розділення імені поля на родителя та дочірнє значення
    const [parent, child, subChild] = name.includes('.') ? name.split('.') : ['homeData', name];
    
    // Валідація на основі поля
    if (parent === 'homeData') {
      if (child === 'type') {
        if (!value) {
          error = t('addHome.validation.required.type');
        }
      } else if (child === 'name') {
        if (!value || value.trim() === '') {
          error = t('addHome.validation.required.name');
        } else if (value.trim().length < 2) {
          error = t('addHome.validation.minLength.name');
        } else if (value.trim().length > 50) {
          error = t('addHome.validation.length.name');
        }
      } else if (child === 'configuration') {
        if (subChild === 'floors') {
          if (value < 1) {
            error = t('addHome.validation.minValue.floors');
          } else if (value > 200) {
            error = t('addHome.validation.maxValue.floors');
          }
        } else if (subChild === 'totalArea') {
          if (value <= 0) {
            error = t('addHome.validation.minValue.area');
          }
        }
      }
    } else if (parent === 'addressData') {
      switch (child) {
        case 'country':
          if (!value || value.trim() === '') {
            error = t('addHome.validation.required.country');
          } else if (value.trim().length < 2) {
            error = t('addHome.validation.minLength.country');
          } else if (value.trim().length > 50) {
            error = t('addHome.validation.length.country');
          }
          break;
          
        case 'region':
          if (!value || value.trim() === '') {
            error = t('addHome.validation.required.region');
          } else if (value.trim().length < 2) {
            error = t('addHome.validation.minLength.region');
          } else if (value.trim().length > 50) {
            error = t('addHome.validation.length.region');
          }
          break;
          
        case 'city':
          if (!value || value.trim() === '') {
            error = t('addHome.validation.required.city');
          } else if (value.trim().length < 2) {
            error = t('addHome.validation.minLength.city');
          } else if (value.trim().length > 50) {
            error = t('addHome.validation.length.city');
          }
          break;
          
        case 'street':
          if (!value || value.trim() === '') {
            error = t('addHome.validation.required.street');
          } else if (value.trim().length < 2) {
            error = t('addHome.validation.minLength.street');
          } else if (value.trim().length > 100) {
            error = t('addHome.validation.length.street');
          }
          break;
          
        case 'buildingNumber':
          if (!value || value.trim() === '') {
            error = t('addHome.validation.required.buildingNumber');
          } else if (value.trim().length > 20) {
            error = t('addHome.validation.length.buildingNumber');
          }
          break;
          
        case 'apartmentNumber':
          if (formData.homeData.type === 'apartment' && (!value || value.trim() === '')) {
            error = t('addHome.validation.required.apartmentNumber');
          } else if (value && value.trim().length > 20) {
            error = t('addHome.validation.length.apartmentNumber');
          }
          break;
          
        case 'postalCode':
          if (value && !/^[a-zA-Z0-9\s-]+$/.test(value)) {
            error = t('addHome.validation.format.postalCode');
          }
          break;
          
        default:
          break;
      }
    }
    
    // Оновлюємо помилки
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    return !error;
  };
  
  const handleNext = () => {
    // Позначаємо всі поля поточного кроку як такі, з якими взаємодіяв користувач
    const fieldsToTouch = {};
    switch (activeStep) {
      case 0:
        fieldsToTouch['homeData.type'] = true;
        break;
      case 1:
        fieldsToTouch['addressData.country'] = true;
        fieldsToTouch['addressData.region'] = true;
        fieldsToTouch['addressData.city'] = true;
        fieldsToTouch['addressData.street'] = true;
        fieldsToTouch['addressData.buildingNumber'] = true;
        if (formData.homeData.type === 'apartment') {
          fieldsToTouch['addressData.apartmentNumber'] = true;
        }
        fieldsToTouch['addressData.postalCode'] = true;
        break;
      case 2:
        fieldsToTouch['homeData.name'] = true;
        if (formData.homeData.type === 'house') {
          fieldsToTouch['homeData.configuration.floors'] = true;
        }
        fieldsToTouch['homeData.configuration.totalArea'] = true;
        break;
      default:
        break;
    }
    
    setTouchedFields(prev => ({
      ...prev,
      ...fieldsToTouch
    }));
    
    // Валідуємо поточний крок перед переходом до наступного
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      const [parent, child, subChild] = parts;
      
      if (parts.length === 2) {
        if (parent === 'homeData' && child === 'type') {
          // Якщо змінюється тип будинку, оновлюємо також isApartment
          const isApartment = value === 'apartment';
          setFormData({
            ...formData,
            [parent]: {
              ...formData[parent],
              [child]: value,
            },
            addressData: {
              ...formData.addressData,
              isApartment: isApartment
            }
          });
        } else {
          setFormData({
            ...formData,
            [parent]: {
              ...formData[parent],
              [child]: value,
            },
          });
        }
      } else if (parts.length === 3) {
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: {
              ...formData[parent][child],
              [subChild]: value
            }
          }
        });
      }
      
      // Валідація та оновлення помилок при зміні поля
      validateField(name, value);
      
    } else {
      setFormData({
        ...formData,
        homeData: {
          ...formData.homeData,
          [name]: value,
        }
      });
      
      // Валідація та оновлення помилок при зміні поля
      validateField(`homeData.${name}`, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Відзначаємо поле як таке, з яким взаємодіяв користувач
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Валідуємо поле при втраті фокусу
    validateField(name, value);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      // Перевіряємо всі обов'язкові поля ще раз
      const allErrors = {};
      
      // Валідація обов'язкових полів будинку
      if (!formData.homeData.name || formData.homeData.name.trim() === '') {
        allErrors['homeData.name'] = t('addHome.validation.required.name');
      }
      
      if (formData.homeData.type === 'house' && 
          (formData.homeData.configuration.floors < 1 || 
           formData.homeData.configuration.floors > 200)) {
        allErrors['homeData.configuration.floors'] = t('addHome.validation.minValue.floors');
      }
      
      if (formData.homeData.configuration.totalArea <= 0) {
        allErrors['homeData.configuration.totalArea'] = t('addHome.validation.minValue.area');
      }
      
      // Валідація обов'язкових полів адреси
      const requiredAddressFields = ['country', 'region', 'city', 'street', 'buildingNumber'];
      requiredAddressFields.forEach(field => {
        if (!formData.addressData[field] || formData.addressData[field].trim() === '') {
          allErrors[`addressData.${field}`] = t(`addHome.validation.required.${field}`);
        }
      });
      
      // Для апартаментів перевіряємо номер квартири
      if (formData.homeData.type === 'apartment' && 
          (!formData.addressData.apartmentNumber || formData.addressData.apartmentNumber.trim() === '')) {
        allErrors['addressData.apartmentNumber'] = t('addHome.validation.required.apartmentNumber');
      }
      
      // Якщо є помилки, показуємо їх і зупиняємо відправку
      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        
        // Встановлюємо поля як такі, з якими взаємодіяв користувач
        const touchedFields = {};
        Object.keys(allErrors).forEach(field => {
          touchedFields[field] = true;
        });
        
        setTouchedFields(prev => ({
          ...prev,
          ...touchedFields
        }));
        
        return;
      }
      
      // Перетворюємо числові значення і забезпечуємо правильну структуру даних
      const preparedData = {
        homeData: {
          ...formData.homeData,
          // Перевірка і очистка імені
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
          isApartment: formData.homeData.type === 'apartment'
        }
      };
      
      
      
      dispatch(createHome(preparedData))
        .unwrap()
        .then(() => {
          resetForm();
          onClose();
        })
        .catch((error) => {
          console.error('Error creating home:', error);
          
          // Показуємо повідомлення про помилку
          const errorMessage = error.message || 'Не вдалося створити будинок. Перевірте введені дані.';
          setErrors(prev => ({
            ...prev,
            general: errorMessage
          }));
        });
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setErrors({});
    setTouchedFields({});
    setFormData({
      homeData: {
        name: '',
        type: 'house',
        configuration: {
          floors: 1,
          totalArea: 0,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        status: 'active'
      },
      addressData: {
        country: '',
        region: '',
        city: '',
        postalCode: '',
        street: '',
        buildingNumber: '',
        isApartment: false,
        apartmentNumber: '',
        floor: '',
        entrance: '',
        additionalInfo: ''
      }
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Визначаємо, чи кнопка "Далі" має бути неактивною - лише для відображення, не для валідації
  const isLastStep = activeStep === STEPS.length - 1;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2.5,
          px: 3,
        }}
      >
        <Typography variant="h5" component="div">
          {t('addHome.title')}
        </Typography>
        <IconButton onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ py: 3, px: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label, index) => (
            <Step key={label}>
              <StepLabel error={index === activeStep && (
                (index === 0 && touchedFields['homeData.type'] && errors['homeData.type']) ||
                (index === 1 && (
                  (touchedFields['addressData.country'] && errors['addressData.country']) || 
                  (touchedFields['addressData.region'] && errors['addressData.region']) || 
                  (touchedFields['addressData.city'] && errors['addressData.city']) || 
                  (touchedFields['addressData.street'] && errors['addressData.street']) || 
                  (touchedFields['addressData.buildingNumber'] && errors['addressData.buildingNumber']) || 
                  (touchedFields['addressData.apartmentNumber'] && errors['addressData.apartmentNumber']) || 
                  (touchedFields['addressData.postalCode'] && errors['addressData.postalCode'])
                )) ||
                (index === 2 && (
                  (touchedFields['homeData.name'] && errors['homeData.name']) || 
                  (touchedFields['homeData.configuration.floors'] && errors['homeData.configuration.floors']) || 
                  (touchedFields['homeData.configuration.totalArea'] && errors['homeData.configuration.totalArea'])
                ))
              )}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Загальне повідомлення про помилку, якщо воно є */}
        {errors.general && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="error">{errors.general}</Alert>
          </Box>
        )}

        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('addHome.houseType.title')}
            </Typography>
            <FormControl component="fieldset" sx={{ mt: 2 }} error={touchedFields['homeData.type'] && !!errors['homeData.type']}>
              <FormLabel component="legend">{t('addHome.houseType.typeLabel')}</FormLabel>
              <RadioGroup
                name="homeData.type"
                value={formData.homeData.type}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{ mt: 1 }}
              >
                <FormControlLabel
                  value="house"
                  control={<Radio />}
                  label={t('addHome.houseType.house')}
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4, mb: 2 }}
                >
                  {t('addHome.houseType.houseDescription')}
                </Typography>

                <FormControlLabel
                  value="apartment"
                  control={<Radio />}
                  label={t('addHome.houseType.apartment')}
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4, mb: 2 }}
                >
                  {t('addHome.houseType.apartmentDescription')}
                </Typography>
              </RadioGroup>
              {touchedFields['homeData.type'] && errors['homeData.type'] && <FormHelperText error>{errors['homeData.type']}</FormHelperText>}
            </FormControl>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('addHome.address.title')}
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="addressData.country"
                  label={t('addHome.address.country')}
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.addressData.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touchedFields['addressData.country'] && !!errors['addressData.country']}
                  helperText={touchedFields['addressData.country'] && errors['addressData.country'] || t('addHome.validation.helperText.country')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="addressData.region"
                  label={t('addHome.address.region')}
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.addressData.region}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touchedFields['addressData.region'] && !!errors['addressData.region']}
                  helperText={touchedFields['addressData.region'] && errors['addressData.region'] || t('addHome.validation.helperText.region')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="addressData.city"
                  label={t('addHome.address.city')}
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.addressData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touchedFields['addressData.city'] && !!errors['addressData.city']}
                  helperText={touchedFields['addressData.city'] && errors['addressData.city'] || t('addHome.validation.helperText.city')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="addressData.postalCode"
                  label={t('addHome.address.postalCode')}
                  fullWidth
                  variant="outlined"
                  value={formData.addressData.postalCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touchedFields['addressData.postalCode'] && !!errors['addressData.postalCode']}
                  helperText={touchedFields['addressData.postalCode'] && errors['addressData.postalCode'] || t('addHome.validation.helperText.postalCode')}
                />
              </Grid>
              <Grid item xs={12} sm={formData.homeData.type === 'house' ? 12 : 6}>
                <TextField
                  name="addressData.street"
                  label={t('addHome.address.street')}
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.addressData.street}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touchedFields['addressData.street'] && !!errors['addressData.street']}
                  helperText={touchedFields['addressData.street'] && errors['addressData.street'] || t('addHome.validation.helperText.street')}
                />
              </Grid>
              {formData.homeData.type === 'house' ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="addressData.buildingNumber"
                    label={t('addHome.address.buildingNumber')}
                    fullWidth
                    variant="outlined"
                    required
                    value={formData.addressData.buildingNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touchedFields['addressData.buildingNumber'] && !!errors['addressData.buildingNumber']}
                    helperText={touchedFields['addressData.buildingNumber'] && errors['addressData.buildingNumber'] || t('addHome.validation.helperText.buildingNumber')}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      name="addressData.buildingNumber"
                      label={t('addHome.address.buildingNumber')}
                      fullWidth
                      variant="outlined"
                      required
                      value={formData.addressData.buildingNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touchedFields['addressData.buildingNumber'] && !!errors['addressData.buildingNumber']}
                      helperText={touchedFields['addressData.buildingNumber'] && errors['addressData.buildingNumber'] || t('addHome.validation.helperText.buildingNumber')}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      name="addressData.apartmentNumber"
                      label={t('addHome.address.apartmentNumber')}
                      fullWidth
                      variant="outlined"
                      required
                      value={formData.addressData.apartmentNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touchedFields['addressData.apartmentNumber'] && !!errors['addressData.apartmentNumber']}
                      helperText={touchedFields['addressData.apartmentNumber'] && errors['addressData.apartmentNumber'] || t('addHome.validation.helperText.apartmentNumber')}
                    />
                  </Grid>
                </>
              )}
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="addressData.floor"
                  label={t('addHome.address.floor')}
                  fullWidth
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 0 }}
                  value={formData.addressData.floor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="addressData.entrance"
                  label={t('addHome.address.entrance')}
                  fullWidth
                  variant="outlined"
                  value={formData.addressData.entrance}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="addressData.additionalInfo"
                  label={t('addHome.address.additionalInfo')}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  value={formData.addressData.additionalInfo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {t('addHome.details.title')}
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="homeData.name"
                  label={t('addHome.details.name')}
                  placeholder={t('addHome.details.namePlaceholder')}
                  fullWidth
                  variant="outlined"
                  required
                  value={formData.homeData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touchedFields['homeData.name'] && !!errors['homeData.name']}
                  helperText={touchedFields['homeData.name'] && errors['homeData.name'] || t('addHome.validation.helperText.name')}
                />
              </Grid>

              {formData.homeData.type === 'house' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="homeData.configuration.floors"
                    label={t('addHome.details.floors')}
                    type="number"
                    fullWidth
                    variant="outlined"
                    InputProps={{ inputProps: { min: 1 } }}
                    value={formData.homeData.configuration.floors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touchedFields['homeData.configuration.floors'] && !!errors['homeData.configuration.floors']}
                    helperText={touchedFields['homeData.configuration.floors'] && errors['homeData.configuration.floors'] || t('addHome.validation.helperText.floors')}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  name="homeData.configuration.totalArea"
                  label={t('addHome.details.area')}
                  type="number"
                  fullWidth
                  variant="outlined"
                  required
                  InputProps={{ inputProps: { min: 1 } }}
                  value={formData.homeData.configuration.totalArea}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touchedFields['homeData.configuration.totalArea'] && !!errors['homeData.configuration.totalArea']}
                  helperText={touchedFields['homeData.configuration.totalArea'] && errors['homeData.configuration.totalArea'] || t('addHome.validation.helperText.area')}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          p: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={activeStep === 0 ? handleClose : handleBack}
          color={activeStep === 0 ? 'inherit' : 'primary'}
          variant={activeStep === 0 ? 'text' : 'outlined'}
          disabled={isLoading}
        >
          {activeStep === 0 ? t('common.cancel') : t('common.back')}
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          onClick={isLastStep ? handleSubmit : handleNext}
          disabled={isLoading}
          startIcon={isLoading && isLastStep ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLastStep 
            ? (isLoading ? t('common.saving') : t('common.create')) 
            : t('common.next')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddHomeDialog; 
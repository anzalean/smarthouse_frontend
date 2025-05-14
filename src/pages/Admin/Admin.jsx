import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination, 
  Toolbar, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Chip, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Breadcrumbs
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import AdminHeader from '../../components/AdminHeader/AdminHeader';
import { getAllUsers, updateUserStatus, deleteUser } from '../../redux/slices/userSlice';
import { Link } from 'react-router-dom';

function Admin() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { admin: { users, isLoading } } = useSelector((state) => state.user);
  const { currentHome } = useSelector(state => state.homes);
  
  // Локальний стан
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  // Отримання всіх користувачів при завантаженні сторінки
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  
  // Фільтрація користувачів за пошуковим запитом
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || email.includes(query);
  });
  
  // Обробники пагінації
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Обробники діалогу видалення
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };
  
  const handleDeleteUser = () => {
    if (selectedUser) {
      
      
      // Використовуємо id, якщо є, інакше _id
      const userId = selectedUser.id || selectedUser._id;
      
      dispatch(deleteUser(userId));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };
  
  // Обробники діалогу зміни статусу
  const handleOpenStatusDialog = (user, initialStatus) => {
    
    setSelectedUser(user);
    setNewStatus(initialStatus);
    setStatusDialogOpen(true);
  };
  
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedUser(null);
  };
  
  const handleUpdateUserStatus = () => {
    if (selectedUser && newStatus) {
      
      
      // Використовуємо id, якщо є, інакше _id
      const userId = selectedUser.id || selectedUser._id;
      
      dispatch(updateUserStatus({ id: userId, status: newStatus }));
      setStatusDialogOpen(false);
      setSelectedUser(null);
    }
  };
  
  // Функція для відображення кольору статусу
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'blocked':
        return 'error';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  // Відображення завантаження
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AdminHeader />
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
      <AdminHeader />
      <Container 
        maxWidth="lg" 
        sx={{ 
          pt: { xs: '58px', sm: '66px', md: '74px', lg: '82px' },
          mt: 4, 
          mb: 4, 
          flexGrow: 1,
          overflow: 'auto',
          height: '100%'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{
            p: { xs: 2, md: 4 },
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
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link 
              to={currentHome ? `/home/${currentHome._id}` : '/main'} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: 'inherit' 
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
              {t('common.home')}
            </Link>
            <Typography color="primary.main" fontWeight="medium">
              {t('admin.title')}
            </Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary.dark" mb={3}>
            {t('admin.title')}
          </Typography>
          
          <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, mb: 2 }}>
            <TextField
              fullWidth
              placeholder={t('admin.searchUsers')}
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 500 }}
            />
          </Toolbar>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('admin.name')}</TableCell>
                  <TableCell>{t('admin.email')}</TableCell>
                  <TableCell>{t('admin.status')}</TableCell>
                  <TableCell>{t('admin.registrationDate')}</TableCell>
                  <TableCell align="center">{t('admin.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => {
                    // Використовуємо _id якщо є, або індекс для унікального ключа
                    const rowKey = user._id || `user-${index}`;
                    return (
                      <TableRow key={rowKey}>
                        <TableCell>
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.email || t('common.unknown')}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={t(`admin.statuses.${user.status}`)} 
                            color={getStatusColor(user.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <IconButton 
                              color="primary"
                              onClick={() => handleOpenStatusDialog(user, user.status)}
                            >
                              {user.status === 'blocked' ? <CheckCircleIcon /> : <BlockIcon />}
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredUsers.length === 0 && (
                  <TableRow key="no-users-found">
                    <TableCell colSpan={5} align="center">
                      {t('admin.noUsersFound')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={t('admin.rowsPerPage')}
          />
        </Paper>
      </Container>
      
      {/* Діалог підтвердження видалення користувача */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>{t('admin.deleteUserTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedUser && t('admin.deleteUserConfirmation', { 
              name: selectedUser.firstName && selectedUser.lastName 
                ? `${selectedUser.firstName} ${selectedUser.lastName}` 
                : selectedUser.email || t('common.unknown')
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Діалог зміни статусу користувача */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
      >
        <DialogTitle>{t('admin.changeStatusTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            {selectedUser && t('admin.changeStatusDescription', { 
              name: selectedUser.firstName && selectedUser.lastName 
                ? `${selectedUser.firstName} ${selectedUser.lastName}` 
                : selectedUser.email || t('common.unknown')
            })}
          </DialogContentText>
          <FormControl fullWidth>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="active">{t('admin.statuses.active')}</MenuItem>
              <MenuItem value="blocked">{t('admin.statuses.blocked')}</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} color="primary">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleUpdateUserStatus} color="primary" variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Admin; 
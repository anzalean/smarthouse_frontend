import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddMemberDialog from '../AddMemberDialog/AddMemberDialog';
import EditMemberDialog from '../EditMemberDialog/EditMemberDialog';
import RemoveMemberDialog from '../RemoveMemberDialog/RemoveMemberDialog';
import { fetchHomePermissions } from '../../redux/slices/homesSlice';
import { formatDate } from '../../utils/formatters';

const MembersList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Стани для відкриття/закриття діалогів
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Отримуємо дані з Redux
  const { currentHome, homeAccesses } = useSelector(state => state.homes);
  const { homePermissions: homePermissionsLoading } = useSelector(
    state => state.ui.loaders
  );

  // Завантажуємо дозволи користувачів при монтуванні компонента
  useEffect(() => {
    if (currentHome?._id) {
      dispatch(fetchHomePermissions(currentHome._id));
    }
  }, [dispatch, currentHome]);

  // Функція для отримання масиву учасників
  const getMembers = () => {
    if (!currentHome || !homeAccesses || !Array.isArray(homeAccesses))
      return [];

    return homeAccesses
      .map(access => {
        // Витягуємо дані з об'єктів user та role
        const userEmail = access.user?.email || '';
        const roleName = access.role?.name || '';

        // Визначаємо роль для відображення
        let displayRole;
        if (roleName === 'owner') {
          displayRole = 'owner';
        } else if (roleName === 'member') {
          displayRole = 'user';
        } else {
          displayRole = 'guest';
        }

        return {
          _id: access.userId,
          email: userEmail,
          role: displayRole,
          unlimited: !access.expiresAt,
          accessPeriodStart: access.grantedAt || access.createdAt,
          accessPeriodEnd: access.expiresAt,
          // Зберігаємо оригінальний об'єкт для потенційного використання
          originalData: access,
        };
      })
      .sort((a, b) => {
        // Сортування членів: власник першим, потім користувачі, потім гості
        if (a.role === 'owner') return -1;
        if (b.role === 'owner') return 1;
        if (a.role === 'user' && b.role === 'guest') return -1;
        if (a.role === 'guest' && b.role === 'user') return 1;
        return a.email?.localeCompare(b.email) || 0;
      });
  };

  // Форматування періоду доступу
  const formatAccessPeriod = member => {
    if (
      member.unlimited ||
      (!member.accessPeriodStart && !member.accessPeriodEnd)
    ) {
      return t('home.members.unlimited');
    }

    const start = member.accessPeriodStart
      ? formatDate(member.accessPeriodStart)
      : '';
    const end = member.accessPeriodEnd
      ? formatDate(member.accessPeriodEnd)
      : '';

    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return `${t('home.members.from')} ${start}`;
    } else if (end) {
      return `${t('home.members.until')} ${end}`;
    }

    return t('home.members.unlimited');
  };

  // Функції для відкриття/закриття діалогів
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleOpenEditDialog = member => {
    setSelectedMember(member);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedMember(null);
    setEditDialogOpen(false);
  };

  const handleOpenRemoveDialog = member => {
    setSelectedMember(member);
    setRemoveDialogOpen(true);
  };

  const handleCloseRemoveDialog = () => {
    setSelectedMember(null);
    setRemoveDialogOpen(false);
  };

  // Отримуємо учасників
  const members = getMembers();

  // Відображення при завантаженні
  if (homePermissionsLoading) {
    return (
      <Box>
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">{t('home.members.title')}</Typography>
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('home.members.email')}</TableCell>
                <TableCell>{t('home.members.role')}</TableCell>
                <TableCell>{t('home.members.accessPeriod')}</TableCell>
                <TableCell align="right">{t('home.members.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={150} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="rectangular" width={80} height={30} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">{t('home.members.title')}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          {t('home.members.addMember')}
        </Button>
      </Box>

      {members.length === 0 ? (
        <Alert severity="info">{t('home.members.noMembers')}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('home.members.email')}</TableCell>
                <TableCell>{t('home.members.role')}</TableCell>
                <TableCell>{t('home.members.accessPeriod')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map(member => (
                <TableRow key={member._id}>
                  <TableCell>{member.email || ''}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`home.members.roles.${member.role}`)}
                      color={
                        member.role === 'owner'
                          ? 'primary'
                          : member.role === 'user'
                            ? 'secondary'
                            : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatAccessPeriod(member)}</TableCell>
                  <TableCell align="right">
                    {member.role !== 'owner' && (
                      <>
                        <Tooltip title={t('common.edit')}>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenEditDialog(member)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.delete')}>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenRemoveDialog(member)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Діалог додавання учасника */}
      <AddMemberDialog open={addDialogOpen} onClose={handleCloseAddDialog} />

      {/* Діалог редагування учасника */}
      {selectedMember && (
        <EditMemberDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          member={selectedMember}
        />
      )}

      {/* Діалог видалення учасника */}
      {selectedMember && (
        <RemoveMemberDialog
          open={removeDialogOpen}
          onClose={handleCloseRemoveDialog}
          member={selectedMember}
        />
      )}
    </Box>
  );
};

export default MembersList;

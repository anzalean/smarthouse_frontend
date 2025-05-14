import { useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Stack, Fade } from '@mui/material';
import { removeNotification } from '../../redux/slices/uiSlice';

const NotificationItem = memo(({ notification, onClose }) => {
  return (
    <Fade in={true}>
      <Alert
        elevation={6}
        variant="filled"
        onClose={() => onClose(notification.id)}
        severity={notification.type || 'info'}
        sx={{
          width: '100%',
          mb: 1,
          '& .MuiAlert-icon': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {notification.message}
      </Alert>
    </Fade>
  );
});

const NotificationsManager = () => {
  const notifications = useSelector(state => state.ui.notifications);
  const dispatch = useDispatch();

  const handleClose = id => {
    dispatch(removeNotification(id));
  };

  // Auto-dismiss notifications after their duration
  useEffect(() => {
    if (notifications.length > 0) {
      const timers = notifications.map(notification => {
        return setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration || 2000); // Default duration: 2 seconds
      });

      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <Stack
      spacing={1}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: '350px',
        maxHeight: '80vh',
        overflowY: 'auto',
        // Hide scrollbar
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={handleClose}
        />
      ))}
    </Stack>
  );
};

export default NotificationsManager;

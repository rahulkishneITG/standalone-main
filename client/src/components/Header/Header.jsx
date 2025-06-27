import React, { useContext } from 'react';
import { Avatar, Text, Button, Icon } from '@shopify/polaris';
import styles from './Header.module.css';
import { ArrowLeftIcon, MenuIcon } from '@shopify/polaris-icons';
import useSidebarStore from '../../store/sidebarStore';
import { AuthContext } from '../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FullPageLoader from '../Loader';
import { exportToCSV } from '../../utils/exportCsv.js';
import { useAttendeeStore } from '../../store/attendeeStore';

const Header = () => {
  const { toggleSidebar } = useSidebarStore();
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const { attendees } = useAttendeeStore();
  const navigate = useNavigate();

  if (loading) {
    return <FullPageLoader />;
  }

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === '/') return 'Home';
    if (path.startsWith('/event/create')) return 'Create Event';
    if (path.startsWith('/event/edit')) return 'Edit Event';
    if (path.startsWith('/event')) return 'All Event';
    if (path.startsWith('/attendee')) return 'All Attendee';

    return 'Dashboard';
  };

  const getPageActions = () => {
    const path = location.pathname;
    if (path === '/') {
      return (
        <>
          <Link to="/event/create">
            <Button variant="primary" tone="primary">Create Event</Button>
          </Link>
          <Link to="/attendee">
            <Button variant="primary" tone="primary">View Attendee List</Button>
          </Link>
        </>
      );
    }
    if (path.startsWith('/event/create') || path.startsWith('/event/edit')) {
      return null;
    }

    if (path.startsWith('/event')) {
      return (
        <Link to="/event/create">
          <Button variant="primary" tone="primary">Create Event</Button>
        </Link>
      );
    }

    if (path.startsWith('/attendee')) {
      return (
        <>
          <Link to="/attendee">
            <Button onClick={() => exportToCSV(attendees, 'attendees.csv')} variant="primary" tone="primary">Export as CSV</Button>
          </Link>
          <Link to="/attendee/import">
            <Button variant="primary" tone="primary">Bulk import attendees</Button>
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerAvatar}>
          <div className={styles.sidebarToggle} onClick={toggleSidebar}>
            <Icon source={MenuIcon} />
          </div>
          <div className={styles.headerAvatarInfo}>
            <div className={styles.headerAvatarIcon}>
              <Avatar customer size="large" name={`${user?.name || 'User'}`} />
            </div>
            <Text variant="bodyMd" fontWeight="medium">
              {user?.name || 'User'}
            </Text>
          </div>
        </div>
        <div className={styles.headerBottom}>
          <Text variant="headingLg" as="h2" fontWeight="semibold">
            <div className={styles.headerBottomTitle}>
              {(location.pathname.startsWith('/event/create') || location.pathname.startsWith('/event/edit')) && (
                <div className={styles.backButton} onClick={() => navigate('/event')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon source={ArrowLeftIcon} tone="base" />
                </div>
              )}
              {getPageTitle()}
            </div>
          </Text>
          <div className={styles.headerBottomButtons}>
            {getPageActions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

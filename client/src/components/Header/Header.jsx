import React, { useContext } from 'react';
import { Avatar, Text, Button, Icon } from '@shopify/polaris';
import styles from './Header.module.css';
import { MenuIcon } from '@shopify/polaris-icons';
import useSidebarStore from '../../store/sidebarStore';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import FullPageLoader from '../Loader';

const Header = () => {
  const { toggleSidebar } = useSidebarStore();
  const { user, loading } = useContext(AuthContext);
  console.log(user);
  if (loading) {
    return <FullPageLoader />;
  }
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
            Home
          </Text>
          <div className={styles.headerBottomButtons}>
            <Link to="/event/create">
              <Button variant="primary" tone="primary">Create Event</Button>
            </Link>
            <Link to="/attendee">
              <Button variant="primary" tone="primary">View Attendee List</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
import React, { useContext } from 'react';
import styles from './Sidebar.module.css';
import { HomeIcon, CalendarIcon, PersonIcon, EmailIcon, ProductIcon, SettingsIcon, ExitIcon } from '@shopify/polaris-icons';
import { Icon, Text } from '@shopify/polaris';
import { Link, useLocation } from 'react-router-dom';
import useSidebarStore from '../../store/sidebarStore';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { isSidebarOpen } = useSidebarStore();
  const location = useLocation();
  const { logout } = useContext(AuthContext);


  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/event', label: 'Events', icon: CalendarIcon },
    { path: '/attendee', label: 'Attendees', icon: PersonIcon },
    { path: '/email', label: 'Emails', icon: EmailIcon },
    { path: '/walkin', label: 'Walk-ins', icon: ProductIcon },
  ];

  const bottomNavItems = [
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
    { path: '/logout', label: 'Logout', icon: ExitIcon },
  ];

  return (
    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
      <div className={styles.logo}>
        <Text variant="headingXl" as="h1">
          STANDALONE
        </Text>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${item.path === '/'
                ? location.pathname === '/' ? styles.active : ''
                : location.pathname.startsWith(item.path) ? styles.active : ''
              }`}
          >
            <span className={styles.icon}>
              <Icon source={item.icon} tone="base" />
            </span>
            <Text variant="headingSm" fontWeight="medium">
              {item.label}
            </Text>
          </Link>
        ))}
      </nav>
      <div className={styles.bottomNav}>
        {bottomNavItems.map((item) =>
          item.label === 'Logout' ? (
            <div
              key={item.path}
              className={styles.navItem}
              onClick={logout}
              style={{ cursor: 'pointer' }}
            >
              <span className={styles.icon}>
                <Icon source={item.icon} tone="base" />
              </span>
              <Text variant="headingSm" fontWeight="medium">
                {item.label}
              </Text>
            </div>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.icon}>
                <Icon source={item.icon} tone="base" />
              </span>
              <Text variant="headingSm" fontWeight="medium">
                {item.label}
              </Text>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;

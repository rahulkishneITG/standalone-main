import React from 'react';
import styles from './ProtectedLayout.module.css';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/footer';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header'; 
import useSidebarStore from '../store/sidebarStore';
import { XIcon } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

const ProtectedLayouts = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();

  return (
    <div className={styles.protectedLayout}>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>  
        <div className={styles.sidebarHeader}>  
          {isSidebarOpen && (
            <button
              className={styles.closeButton}
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <Icon source={XIcon} tone="base" />
            </button>
          )}
          <Sidebar />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <Header />
        </div>
        <main className={styles.main}>
          <Outlet />
        </main>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayouts;
import React from 'react';
import styles from './Footer.module.css';
import { Text } from '@shopify/polaris';

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <Text variant="bodyLg"  fontWeight="normal" color="subdued">
        © All Rights Reserved | Standalone Web App | 2025
      </Text>
    </footer>
  );
};

export default Footer;
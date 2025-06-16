import React from 'react';
import { Layout, Card, Text, BlockStack } from '@shopify/polaris';
import styles from './Dashboard.module.css';


const Dashboard = () => {
   

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardCard}>
        <Card sectioned>
          <BlockStack vertical spacing="tight">
            <div className={styles.dashboardCardContentContainer}>
              <div className={styles.dashboardCardHeader}>
                <Text variant="headingMd" color="subdued">
                  <span className={styles.dashboardCardHeaderText}> Total Events</span>
                </Text>
              </div>
              <div className={styles.dashboardCardContent}>
                <Text variant="headingLg" as="h5">
                  10 <Text as="span" color="subdued" fontWeight="regular">—</Text>
                </Text>
              </div>
              <div className={styles.dashboardCardContentFooter}>
                <Text variant="bodyMd" color="subdued">
                  Total Events: 10
                </Text>
              </div>

            </div>
          </BlockStack>
        </Card>
      </div>
      <div className={styles.dashboardCard}>
        <Card sectioned>
          <BlockStack vertical spacing="tight">
            <div className={styles.dashboardCardContentContainer}>
              <div className={styles.dashboardCardHeader}>
                <Text variant="headingMd" color="subdued" >
                  <span className={styles.dashboardCardHeaderText}> Total Registrations</span>
                </Text>
              </div>
              <div className={styles.dashboardCardContent}>
                <Text variant="headingLg" as="h5">
                  350 <Text as="span" color="subdued" fontWeight="regular">—</Text>
                </Text>
              </div>
              <div className={styles.dashboardCardContentFooter}>
                <Text variant="bodyMd" color="subdued">
                  Online: 275 / Walk-in: 75
                </Text>
              </div>
            </div>
          </BlockStack>
        </Card>
      </div>
      <div className={styles.dashboardCard}>
        <Card sectioned >
          <BlockStack vertical spacing="tight">
            <div className={styles.dashboardCardContentContainer}>
              <div className={styles.dashboardCardHeader}>
                <Text variant="headingMd" color="subdued">
                    <span className={styles.dashboardCardHeaderText}> Total Revenue Summary</span>
                </Text>
              </div>
              <div className={styles.dashboardCardContent}>
                <Text variant="headingLg" as="h5">
                  $12,450 <Text as="span" color="subdued" fontWeight="regular">—</Text>
                </Text>
              </div>
              <div className={styles.dashboardCardContentFooter}>
                <Text variant="bodyMd" color="subdued">
                  Online: $10,750 / Offline: $1,700
                </Text>
              </div>

            </div>
          </BlockStack>
        </Card>
      </div>
        
    </div>
  );
};

export default Dashboard;
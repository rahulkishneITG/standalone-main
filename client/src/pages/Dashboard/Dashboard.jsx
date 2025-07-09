import React, { useEffect } from 'react';
import { Layout, Card, Text, BlockStack } from '@shopify/polaris';
import styles from './Dashboard.module.css';
import useDashboardStore from '../../store/dasboardStore.js';
import FullPageLoader from '../../components/Loader.jsx';


const Dashboard = () => {
    const { eventData, loading, error, fetchEventData } = useDashboardStore();
    useEffect(() => {
      fetchEventData();
    }, [fetchEventData]);

    if (loading) {
      return <FullPageLoader/>
    }
  
    if (error) {
      return <Text color="critical">{error}</Text>;
    }
  
    const {
      Online_count,
      TotalPrePrice,    
      TotalRegister,
      TotalRevenu,
      TotalWalkinPrice,
      Total_events,
      Walkin,
    } = eventData || {};
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
                  {Total_events} <Text as="span" color="subdued" fontWeight="regular">—</Text>
                </Text>
              </div>
              <div className={styles.dashboardCardContentFooter}>
                <Text variant="bodyMd" color="subdued">
                  Total Events: {Total_events}
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
                  {TotalRegister} <Text as="span" color="subdued" fontWeight="regular">—</Text>
                </Text>
              </div>
              <div className={styles.dashboardCardContentFooter}>
                <Text variant="bodyMd" color="subdued">
                  Online: {Online_count} / Walk-in: {Walkin}
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
                  ${TotalRevenu} <Text as="span" color="subdued" fontWeight="regular">—</Text>
                </Text>
              </div>
              <div className={styles.dashboardCardContentFooter}>
                <Text variant="bodyMd" color="subdued">
                  Online: ${TotalPrePrice} / Offline: ${TotalWalkinPrice}
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
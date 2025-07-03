import { Card, Text, Image, BlockStack } from '@shopify/polaris';
import styles from './EventDetails.module.css';
import WalkinFormComponent from '../WalkinFormComponent';

export default function EventDetails({ event }) {
  return (
    <Card>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
            <Image source={event?.imageUrl || ''} alt={event?.title || ''} />
        </div>
        <div className={styles.info}>
          <Text variant="headingLg">{event?.title}</Text>
          <Text>{event?.description}</Text>
          <Text fontWeight="bold">Price: ${event?.walkin_price}</Text>
          <WalkinFormComponent />
        </div>
      </div>
    </Card>
  );
}

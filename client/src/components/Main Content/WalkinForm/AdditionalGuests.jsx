import { Button, Text } from '@shopify/polaris';
import GuestItem from './GuestItem';
import styles from './WalkinFormComponent.module.css';
export default function AdditionalGuests({ guests, addGuest, removeGuest, updateGuest, maxGuests }) {
  return (
    <>
    <div className={styles.heading}>
      <Text variant="headingMd" >Additional Guests</Text>
    </div>
      {guests.map((guest, index) => (
        <GuestItem
          key={index}
          index={index}
          guest={guest}
          removeGuest={removeGuest}
          updateGuest={updateGuest}
        />
      ))}
      <div className={styles.additionButton}>
        <Button onClick={addGuest} disabled={guests.length + 1 >= maxGuests}>Add Another Guest</Button>
      </div>
    </>
  );
}

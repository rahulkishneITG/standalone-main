// components/EventForm/EventForm.jsx
import React, { useState } from 'react';
import { Button, Card, FormLayout, Text } from '@shopify/polaris';
import MainGuestSection from './MainGuestSection';
import EmailPreferences from './EmailPreferences';
import AdditionalGuests from './AdditionalGuests';
import CHMAffiliation from './CHMAffiliation';
import styles from './WalkinFormComponent.module.css';

const WalkinFormComponent = () => {
  const [guests, setGuests] = useState([]);
  const [optIn, setOptIn] = useState(false);
  const [isCHM, setIsCHM] = useState('');

  const maxGuests = 5;

  const addGuest = () => {
    if (guests.length + 1 >= maxGuests) return;
    setGuests([...guests, { first_name: '', last_name: '', email: '', preferences: {} }]);
  };

  const removeGuest = (index) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const updateGuest = (index, data) => {
    const updated = [...guests];
    updated[index] = data;
    setGuests(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      event_id: form.event_id.value,
      main_guest: {
        first_name: form.main_first_name.value,
        last_name: form.main_last_name.value,
        email: form.main_email.value,
      },
      email_preferences: {
        opt_in: form.opt_in.checked,
        dr_brownstein: form.updates_dr_brownstein.checked,
        chm: form.updates_chm.checked,
      },
      additional_guests: guests,
      is_chm_patient: form.is_chm_patient.value,
      provider_name: form.provider_name?.value || '',
      registration_type: form.registration_type.value,
    };
    console.log(payload);
    alert("Submitted. Check console for payload.");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input type="hidden" name="event_id" value="custom_event_id" className={styles.hidden}/>
      <input type="hidden" name="registration_type" value="walkin" className={styles.hidden}/>
      <Card>
        <FormLayout gap="2">
          <Text variant="headingMd">Walkin Form</Text>
          <MainGuestSection />
          <EmailPreferences optIn={optIn} setOptIn={setOptIn} />
          <AdditionalGuests
            guests={guests}
            addGuest={addGuest}
            removeGuest={removeGuest}
            updateGuest={updateGuest}
            maxGuests={maxGuests}
          />
          <CHMAffiliation isCHM={isCHM} setIsCHM={setIsCHM} />
          <Button submit primary>Submit Registration</Button>

        </FormLayout>
      </Card>
    </form>
  );
};

export default WalkinFormComponent;

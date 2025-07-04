  import React, { useState,useEffect } from 'react';
  import { Button, Card, FormLayout, Text } from '@shopify/polaris';
  import MainGuestSection from './MainGuestSection';
  import EmailPreferences from './EmailPreferences';
  import AdditionalGuests from './AdditionalGuests';
  import CHMAffiliation from './CHMAffiliation';
  import styles from './WalkinFormComponent.module.css';
  import { submitWalkinForm } from '../../../api/walkinApi';
import useEventStore from '../../../store/eventStore';

  const WalkinFormComponent = ({ event_id }) => {
    const [mainGuest, setMainGuest] = useState({ first_name: '', last_name: '', email: '' });
    const [optIn, setOptIn] = useState(false);
    const [emailPrefs, setEmailPrefs] = useState({ dr_brownstein: false, chm: false });
    const [guests, setGuests] = useState([]);
    const [isCHM, setIsCHM] = useState('');
    const [providerName, setProviderName] = useState('');
    const [errors, setErrors] = useState({});

    const {
      eventDetails,
      fetchEventDetails,
      loading: eventLoading,
    } = useEventStore();
  
    // Fetch event data on mount
    useEffect(() => {
      if (event_id) fetchEventDetails(event_id);
    }, [event_id]);
    console.log("eventdetails",eventDetails);
    const maxGuests = 5;

    const allowRegistration = eventDetails?.data?.allow_group_registration || false;

    console.log("allowRegistration",!allowRegistration);
    const addGuest = () => {
      if (guests.length + 1 >= maxGuests) return;
      setGuests([...guests, { first_name: '', last_name: '', email: '', preferences: {} }]);
    };

    const removeGuest = (index) => {
      const updated = guests.filter((_, i) => i !== index);
      setGuests(updated);
      const updatedErrors = { ...errors };
      delete updatedErrors[`guest_${index}_first`];
      delete updatedErrors[`guest_${index}_last`];
      delete updatedErrors[`guest_${index}_email`];

      for (let i = index + 1; i < guests.length; i++) {
        updatedErrors[`guest_${i - 1}_first`] = updatedErrors[`guest_${i}_first`];
        updatedErrors[`guest_${i - 1}_last`] = updatedErrors[`guest_${i}_last`];
        updatedErrors[`guest_${i - 1}_email`] = updatedErrors[`guest_${i}_email`];
        delete updatedErrors[`guest_${i}_first`];
        delete updatedErrors[`guest_${i}_last`];
        delete updatedErrors[`guest_${i}_email`];
      }

      setErrors(updatedErrors);
    };

    const updateGuest = (index, data) => {
      const updated = [...guests];
      updated[index] = data;
      setGuests(updated);
    };

    const validate = () => {
      const newErrors = {};
      if (!mainGuest.first_name) newErrors.main_first_name = 'First name is required';
      if (!mainGuest.last_name) newErrors.main_last_name = 'Last name is required';
      if (!mainGuest.email) newErrors.main_email = 'Email is required';

      guests.forEach((guest, i) => {
        if (!guest.first_name) newErrors[`guest_${i}_first`] = 'Required';
        if (!guest.last_name) newErrors[`guest_${i}_last`] = 'Required';
        if (!guest.email) newErrors[`guest_${i}_email`] = 'Required';
      });

      if (!isCHM) newErrors.isCHM = 'Please select an option';
      if (isCHM === 'yes' && !providerName) newErrors.provider_name = 'Provider name is required';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      if (!validate()) return;

      const payload = {
        event_id,
        registration_type: form.registration_type.value, 
        main_guest: {
          ...mainGuest,
          email_preferences: {
            opt_in: optIn,
            dr_brownstein: emailPrefs.dr_brownstein,
            chm: emailPrefs.chm,
          },
        },
        additional_guests: guests,
        is_chm_patient: isCHM,
        provider_name: providerName || '',
      };

      console.log('Final Payload:', payload);
      await submitWalkinForm(payload);
      alert('Submitted. Check console for payload.');
    };

    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" name="event_id" value="custom_event_id" className={styles.hidden}/>
        <input type="hidden" name="registration_type" value="walkin" className={styles.hidden}/>
        <Card>
          <FormLayout>
            <Text variant="headingMd">Pre-Registration Form</Text>

            <MainGuestSection
              mainGuest={mainGuest}
              setMainGuest={setMainGuest}
              errors={errors}
              setErrors={setErrors}
            />
            <EmailPreferences
              optIn={optIn}
              setOptIn={setOptIn}
              emailPrefs={emailPrefs}
              setEmailPrefs={setEmailPrefs}
            />
            <AdditionalGuests
              guests={guests}
              addGuest={addGuest}
              removeGuest={removeGuest}
              updateGuest={updateGuest}
              errors={errors}
              setErrors={setErrors}
              maxGuests={maxGuests}
              isDisabled={!allowRegistration}
            />
            <CHMAffiliation
              isCHM={isCHM}
              setIsCHM={setIsCHM}
              providerName={providerName}
              setProviderName={setProviderName}
              errors={errors}
              setErrors={setErrors}
            />

            <Button submit primary>Submit Registration</Button>
          </FormLayout>
        </Card>
      </form>
    );
  };

  export default WalkinFormComponent;

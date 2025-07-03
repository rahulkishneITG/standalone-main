// // components/EventForm/EventForm.jsx
// import React, { useState } from 'react';
// import { Button, Card, FormLayout, Text } from '@shopify/polaris';
// import MainGuestSection from './MainGuestSection';
// import EmailPreferences from './EmailPreferences';
// import AdditionalGuests from './AdditionalGuests';
// import CHMAffiliation from './CHMAffiliation';
// import styles from './WalkinFormComponent.module.css';

// const WalkinFormComponent = () => {
//   const [guests, setGuests] = useState([]);
//   const [optIn, setOptIn] = useState(false);
//   const [isCHM, setIsCHM] = useState('');

//   const maxGuests = 5;

//   const addGuest = () => {
//     if (guests.length + 1 >= maxGuests) return;
//     setGuests([...guests, { first_name: '', last_name: '', email: '', preferences: {} }]);
//   };

//   const removeGuest = (index) => {
//     setGuests(guests.filter((_, i) => i !== index));
//   };

//   const updateGuest = (index, data) => {
//     const updated = [...guests];
//     updated[index] = data;
//     setGuests(updated);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const payload = {
//       event_id: form.event_id.value,
//       main_guest: {
//         first_name: form.main_first_name.value,
//         last_name: form.main_last_name.value,
//         email: form.main_email.value,
//       },
//       email_preferences: {
//         opt_in: form.opt_in.checked,
//         dr_brownstein: form.updates_dr_brownstein.checked,
//         chm: form.updates_chm.checked,
//       },
//       additional_guests: guests,
//       is_chm_patient: form.is_chm_patient.value,
//       provider_name: form.provider_name?.value || '',
//       registration_type: form.registration_type.value,
//     };
//     console.log(payload);
//     alert("Submitted. Check console for payload.");
//   };

//   return (
//     <form onSubmit={handleSubmit} className={styles.form}>
//       <input type="hidden" name="event_id" value="custom_event_id" className={styles.hidden}/>
//       <input type="hidden" name="registration_type" value="walkin" className={styles.hidden}/>
//       <Card>
//         <FormLayout gap="2">
//           <Text variant="headingMd">Walkin Form</Text>
//           <MainGuestSection />
//           <EmailPreferences optIn={optIn} setOptIn={setOptIn} />
//           <AdditionalGuests
//             guests={guests}
//             addGuest={addGuest}
//             removeGuest={removeGuest}
//             updateGuest={updateGuest}
//             maxGuests={maxGuests}
//           />
//           <CHMAffiliation isCHM={isCHM} setIsCHM={setIsCHM} />
//           <Button submit primary>Submit Registration</Button>

//         </FormLayout>
//       </Card>
//     </form>
//   );
// };

// export default WalkinFormComponent;
// components/WalkinForm/WalkinFormComponent.jsx
import React, { useState } from 'react';
import { Button, Card, FormLayout, Text } from '@shopify/polaris';
import MainGuestSection from './MainGuestSection';
import EmailPreferences from './EmailPreferences';
import AdditionalGuests from './AdditionalGuests';
import CHMAffiliation from './CHMAffiliation';
import styles from './WalkinFormComponent.module.css';

const WalkinFormComponent = () => {
  const [mainGuest, setMainGuest] = useState({ first_name: '', last_name: '', email: '' });
  const [optIn, setOptIn] = useState(false);
  const [emailPrefs, setEmailPrefs] = useState({ dr_brownstein: false, chm: false });
  const [guests, setGuests] = useState([]);
  const [isCHM, setIsCHM] = useState('');
  const [providerName, setProviderName] = useState('');
  const [errors, setErrors] = useState({});

  const maxGuests = 5;

  const addGuest = () => {
    if (guests.length + 1 >= maxGuests) return;
    setGuests([...guests, { first_name: '', last_name: '', email: '', preferences: {} }]);
  };

  const removeGuest = (index) => {
    const newGuests = guests.filter((_, i) => i !== index);
    setGuests(newGuests);
    const newErrors = { ...errors };
    delete newErrors[`guest_${index}_first`];
    delete newErrors[`guest_${index}_last`];
    delete newErrors[`guest_${index}_email`];

    for (let i = index + 1; i < guests.length; i++) {
      newErrors[`guest_${i - 1}_first`] = newErrors[`guest_${i}_first`];
      newErrors[`guest_${i - 1}_last`] = newErrors[`guest_${i}_last`];
      newErrors[`guest_${i - 1}_email`] = newErrors[`guest_${i}_email`];
      delete newErrors[`guest_${i}_first`];
      delete newErrors[`guest_${i}_last`];
      delete newErrors[`guest_${i}_email`];
    }

    setErrors(newErrors);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      event_id: 'custom_event_id',
      registration_type: 'walkin',
      main_guest: mainGuest,
      email_preferences: {
        opt_in: optIn,
        dr_brownstein: emailPrefs.dr_brownstein,
        chm: emailPrefs.chm,
      },
      additional_guests: guests,
      is_chm_patient: isCHM,
      provider_name: providerName || '',
    };

    console.log(payload);
    alert('Submitted. Check console for payload.');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Card>
        <FormLayout>
          <Text variant="headingMd">Walkin Form</Text>

          <MainGuestSection mainGuest={mainGuest} setMainGuest={setMainGuest} errors={errors} setErrors={setErrors} />
          <EmailPreferences optIn={optIn} setOptIn={setOptIn} emailPrefs={emailPrefs} setEmailPrefs={setEmailPrefs} />
          <AdditionalGuests
            guests={guests}
            addGuest={addGuest}
            removeGuest={removeGuest}
            updateGuest={updateGuest}
            errors={errors}
            setErrors={setErrors}
            maxGuests={maxGuests}
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

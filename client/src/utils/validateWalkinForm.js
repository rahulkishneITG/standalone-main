export default function validateWalkinForm(form) {
    const errors = {};
  
    // Helper to validate email
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  
    // === Main Guest ===
    const firstName = form.main_first_name?.value.trim();
    const lastName = form.main_last_name?.value.trim();
    const email = form.main_email?.value.trim();
  
    if (!firstName) {
      errors.main_first_name = 'First name is required';
    }
  
    if (!lastName) {
      errors.main_last_name = 'Last name is required';
    }
  
    if (!email) {
      errors.main_email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.main_email = 'Invalid email format';
    }
  
    // === CHM Affiliation ===
    const affiliation = form.is_chm_patient?.value.trim();
    if (!affiliation) {
      errors.is_chm_patient = 'Please select CHM affiliation';
    }
  
    // === Additional Guests ===
    const guestInputs = Array.from(form.elements).filter((el) =>
      el.name?.startsWith('guest_')
    );
  
    const guestData = {};
  
    guestInputs.forEach((input) => {
      const match = input.name.match(/^guest_(\d+)_(first_name|last_name|email)$/);
      if (match) {
        const [_, index, field] = match;
        if (!guestData[index]) guestData[index] = {};
        guestData[index][field] = input.value.trim();
      }
    });
  
    Object.entries(guestData).forEach(([index, guest]) => {
      const guestNum = Number(index) + 1;
  
      const hasAnyValue = guest.first_name || guest.last_name || guest.email;
  
      if (hasAnyValue) {
        if (!guest.first_name) {
          errors[`guest_${index}_first_name`] = `Guest ${guestNum} first name is required`;
        }
  
        if (!guest.last_name) {
          errors[`guest_${index}_last_name`] = `Guest ${guestNum} last name is required`;
        }
  
        if (guest.email && !isValidEmail(guest.email)) {
          errors[`guest_${index}_email`] = `Guest ${guestNum} email is invalid`;
        }
      }
    });
  
    return errors;
  }
  
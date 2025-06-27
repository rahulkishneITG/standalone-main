import { TextField } from '@shopify/polaris';
export default function MainGuestSection() {
  return (
    <>
      <TextField label="First Name" name="main_first_name" required autoComplete="given-name" />
      <TextField label="Last Name" name="main_last_name" required autoComplete="family-name" />
      <TextField type="email" label="Email" name="main_email" required autoComplete="email" />
    </>
  );
}

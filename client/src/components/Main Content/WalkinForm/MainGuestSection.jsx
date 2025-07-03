import { TextField } from '@shopify/polaris';

const MainGuestSection = ({ mainGuest, setMainGuest, errors, setErrors }) => (
  <>
    <TextField
      label="First Name"
      value={mainGuest.first_name}
      onChange={(val) => {
        setMainGuest({ ...mainGuest, first_name: val });
        if (errors.main_first_name) setErrors(prev => ({ ...prev, main_first_name: undefined }));
      }}
      error={errors.main_first_name}
    />
    <TextField
      label="Last Name"
      value={mainGuest.last_name}
      onChange={(val) => {
        setMainGuest({ ...mainGuest, last_name: val });
        if (errors.main_last_name) setErrors(prev => ({ ...prev, main_last_name: undefined }));
      }}
      error={errors.main_last_name}
    />
    <TextField
      type="email"
      label="Email"
      value={mainGuest.email}
      onChange={(val) => {
        setMainGuest({ ...mainGuest, email: val });
        if (errors.main_email) setErrors(prev => ({ ...prev, main_email: undefined }));
      }}
      error={errors.main_email}
    />
  </>
);

export default MainGuestSection;


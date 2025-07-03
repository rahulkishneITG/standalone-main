import { Select, TextField } from '@shopify/polaris';

const CHMAffiliation = ({ isCHM, setIsCHM, providerName, setProviderName, errors, setErrors }) => (
  <>
    <Select
      label="Are you a current patient at CHM?"
      options={[
        { label: 'Select', value: '' },
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ]}
      value={isCHM}
      onChange={(val) => {
        setIsCHM(val);
        if (errors.isCHM) setErrors(prev => ({ ...prev, isCHM: undefined }));
        if (val !== 'yes' && errors.provider_name) {
          setErrors(prev => ({ ...prev, provider_name: undefined }));
        }
      }}
      error={errors.isCHM}
    />
    {isCHM === 'yes' && (
      <TextField
        label="Provider Name"
        value={providerName}
        onChange={(val) => {
          setProviderName(val);
          if (errors.provider_name) setErrors(prev => ({ ...prev, provider_name: undefined }));
        }}
        error={errors.provider_name}
      />
    )}
  </>
);

export default CHMAffiliation;

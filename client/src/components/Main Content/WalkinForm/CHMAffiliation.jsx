import { Select, TextField } from '@shopify/polaris';

export default function CHMAffiliation({ isCHM, setIsCHM }) {
  return (
    <>
      <Select
        label="Are you a current patient at CHM?"
        name="is_chm_patient"
        options={[
          { label: 'Select', value: '' },
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        value={isCHM}
        onChange={setIsCHM}
      />
      {isCHM === 'yes' && (
        <TextField
          label="Provider Name"
          name="provider_name"
          autoComplete="off"
        />
      )}
    </>
  );
}

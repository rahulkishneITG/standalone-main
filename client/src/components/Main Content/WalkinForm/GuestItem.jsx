import {
    TextField,
    Checkbox,
    Card,
    Button,
    FormLayout,
    InlineStack,
    Box,
  } from '@shopify/polaris';
  
  export default function GuestItem({ index, guest, removeGuest, updateGuest }) {
    const handleChange = (field, value) => {
      updateGuest(index, { ...guest, [field]: value });
    };
  
    const handleCheckbox = (field, checked) => {
      updateGuest(index, {
        ...guest,
        preferences: { ...guest.preferences, [field]: checked },
      });
    };
  
    return (
      <Card>
        <FormLayout gap="4">
          <TextField
            label={`Guest ${index + 1} - First Name`}
            value={guest.first_name}
            onChange={(val) => handleChange('first_name', val)}
            autoComplete="off"
          />
          <TextField
            label="Last Name"
            value={guest.last_name}
            onChange={(val) => handleChange('last_name', val)}
            autoComplete="off"
          />
          <TextField
            type="email"
            label="Email"
            value={guest.email}
            onChange={(val) => handleChange('email', val)}
            autoComplete="off"
          />
  
          <FormLayout gap="2">
            <Checkbox
              label="Receive event updates"
              checked={guest.preferences?.opt_in || false}
              onChange={(checked) => handleCheckbox('opt_in', checked)}
            />
            {guest.preferences?.opt_in && (
              <Box paddingInlineStart="4">
                <FormLayout gap="2">
                  <Checkbox
                    label="Dr. Brownstein"
                    checked={guest.preferences?.dr_brownstein || false}
                    onChange={(checked) => handleCheckbox('dr_brownstein', checked)}
                  />
                  <Checkbox
                    label="CHM"
                    checked={guest.preferences?.chm || false}
                    onChange={(checked) => handleCheckbox('chm', checked)}
                  />
                </FormLayout>
              </Box>
            )}
          </FormLayout>
  
          <InlineStack align="end">
            <Button tone="critical" onClick={() => removeGuest(index)}>
              Remove
            </Button>
          </InlineStack>
        </FormLayout>
      </Card>
    );
  }
  
import { Card, FormLayout, TextField, Checkbox, InlineStack, Box, Button } from '@shopify/polaris';

const AdditionalGuests = ({ guests, addGuest, removeGuest, updateGuest, errors, setErrors, maxGuests,isDisabled }) => (
  <>
  
    {guests.map((guest, index) => (
      <Card key={index} padding="4" style={{ marginBottom: '10px' }}>
        <div style={{ padding: '10px',margin: '10px' }}>
        <FormLayout gap="4">
          <TextField
            label={`Guest ${index + 1} - First Name`}
            value={guest.first_name}
            onChange={(val) => {
              updateGuest(index, { ...guest, first_name: val });
              if (errors[`guest_${index}_first`]) {
                const copy = { ...errors };
                delete copy[`guest_${index}_first`];
                setErrors(copy);
              }
            }}
            error={errors[`guest_${index}_first`]}
          />
          <TextField
            label="Last Name"
            value={guest.last_name}
            onChange={(val) => {
              updateGuest(index, { ...guest, last_name: val });
              if (errors[`guest_${index}_last`]) {
                const copy = { ...errors };
                delete copy[`guest_${index}_last`];
                setErrors(copy);
              }
            }}
            error={errors[`guest_${index}_last`]}
          />
          <TextField
            type="email"
            label="Email"
            value={guest.email}
            onChange={(val) => {
              updateGuest(index, { ...guest, email: val });
              if (errors[`guest_${index}_email`]) {
                const copy = { ...errors };
                delete copy[`guest_${index}_email`];
                setErrors(copy);
              }
            }}
            error={errors[`guest_${index}_email`]}
          />
          <Checkbox
            label="Receive event updates"
            checked={guest.preferences?.opt_in || false}
            onChange={(checked) =>
              updateGuest(index, {
                ...guest,
                preferences: { ...guest.preferences, opt_in: checked },
              })
            }
          />
          {guest.preferences?.opt_in && (
            <Box paddingInlineStart="4">
              <Checkbox
                label="Dr. Brownstein"
                checked={guest.preferences?.dr_brownstein || false}
                onChange={(checked) =>
                  updateGuest(index, {
                    ...guest,
                    preferences: { ...guest.preferences, dr_brownstein: checked },
                  })
                }
              />
              <Checkbox
                label="CHM"
                checked={guest.preferences?.chm || false}
                onChange={(checked) =>
                  updateGuest(index, {
                    ...guest,
                    preferences: { ...guest.preferences, chm: checked },
                  })
                }
              />
            </Box>
          )}
          <InlineStack align="end">
            <Button tone="critical" onClick={() => removeGuest(index)}>Remove Guest</Button>
          </InlineStack>
        </FormLayout>
        </div>
      </Card>
    ))}
    <Button onClick={addGuest} disabled={isDisabled || guests.length >= maxGuests}>Add Another Guest</Button>
    
  </>
);

export default AdditionalGuests;

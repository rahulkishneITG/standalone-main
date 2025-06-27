import { Checkbox, InlineStack } from '@shopify/polaris';

export default function EmailPreferences({ optIn, setOptIn }) {
  return (
    <>
      <Checkbox
        label="Receive updates about future events"
        checked={optIn}
        name="opt_in"
        onChange={setOptIn}
      />
      {optIn && (
        <InlineStack gap="4">
          <Checkbox label="Dr. Brownstein’s events" name="updates_dr_brownstein" />
          <Checkbox label="Center for Holistic Medicine" name="updates_chm" />
        </InlineStack>
      )}
    </>
  );
}

import { Checkbox, InlineStack } from '@shopify/polaris';

const EmailPreferences = ({ emailPrefs, setEmailPrefs }) => (
  <InlineStack gap="4">
    <Checkbox
      label="Dr. Brownstein’s events"
      checked={emailPrefs.dr_brownstein}
      onChange={(val) => setEmailPrefs({ ...emailPrefs, dr_brownstein: val })}
    />
    <Checkbox
      label="Center for Holistic Medicine"
      checked={emailPrefs.chm}
      onChange={(val) => setEmailPrefs({ ...emailPrefs, chm: val })}
    />
  </InlineStack>
);

export default EmailPreferences;

import { TextField, Button, FormLayout, InlineStack, Text, Spinner } from '@shopify/polaris';
import { useState } from 'react';
import useUserSettingsStore from '../../../store/userSettingsStore';

export default function PasswordChanger() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { updatePassword, passwordMessage, passwordLoading, setPasswordMessage } = useUserSettingsStore();

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage('New password and confirm password do not match.');
      return;
    }

    await updatePassword({ currentPassword, newPassword });
  };

  return (
    <FormLayout>
      <TextField
        type="password"
        label="Current Password"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="off"
      />
      <TextField
        type="password"
        label="New Password"
        value={newPassword}
        onChange={setNewPassword}
        autoComplete="off"
      />
      <TextField
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="off"
      />

      {passwordMessage && (
        <Text color="subdued" as="p">
          {passwordMessage}
        </Text>
      )}

      <InlineStack align="end">
        <Button onClick={handleSubmit} size="slim" primary loading={passwordLoading}>
          {passwordLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </InlineStack>
    </FormLayout>
  );
}

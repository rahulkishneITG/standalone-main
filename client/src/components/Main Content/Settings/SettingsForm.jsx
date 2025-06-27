import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormLayout,
  Avatar,
  Card,
  BlockStack,
  Text,
  Layout,
  InlineStack,
  Divider,
} from '@shopify/polaris';
import PasswordChanger from './PasswordChanger';
import ProfileImageUploader from './ProfileImageUploader';
import { getUserProfile, updateUserProfile } from '../../../api/userApi';

export default function SettingsForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const user = await getUserProfile();
      setName(user.name);
      setEmail(user.email);
      setImageUrl(user.imageUrl);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    await updateUserProfile({ name, imageUrl });
  };

  return (
    <Layout >
      <Layout.Section>
        <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
          <Card title="Profile" sectioned>
            <BlockStack spacing="tight" alignment="center">
                <div className="" style={{width: '100px', height:"100px", margin: '0 auto'} }>

                        <Avatar size='medium' source={imageUrl} name={name} />
                </div>
              <Text variant="headingSm">{name}</Text>
            </BlockStack>

            <div style={{ marginTop: '1rem' }}>
              <FormLayout>
                <TextField label="Full Name" value={name} onChange={setName} autoComplete="off" />
                <TextField label="Email Address" value={email} disabled />
                <ProfileImageUploader setImageUrl={setImageUrl} />
              </FormLayout>
            </div>
          </Card>

          <Card title="Password" sectioned subdued>
            <PasswordChanger />
          </Card>

  
          <div style={{ marginTop: '1rem' }}>
            <InlineStack align="end">
              <Button size="slim" onClick={handleSubmit} primary>
                Save Changes
              </Button>
            </InlineStack>
          </div>
        </div>
      </Layout.Section>
    </Layout>
  );
}

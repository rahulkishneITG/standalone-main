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
} from '@shopify/polaris';
import { useEffect, useState } from 'react';
import PasswordChanger from './PasswordChanger';
import ProfileImageUploader from './ProfileImageUploader';
import { useUserProfileStore } from '../../../store/userSettingsStore.js';
import toast from 'react-hot-toast';
import FullPageLoader from '../../Loader.jsx';

export default function SettingsForm() {
  const {
    userProfile,
    fetchUserProfile,
    updateUserProfile,
    profileLoading,
    profileMessage,
  } = useUserProfileStore();

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (userProfile) {
      console.log(userProfile);
      setName(userProfile.name || '');
      setImageUrl(userProfile.imageUrl || '');
    }
  }, [userProfile]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (file) formData.append('image', file);
      
      await updateUserProfile(formData);
      toast.success('Profile updated successfully!');
  
      fetchUserProfile();
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update profile.');
    }
  };

  if(profileLoading){
    return <FullPageLoader/>;
  }

  return (
    <Layout>
      <Layout.Section>
        <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
          <Card title="Profile" sectioned>
            <BlockStack spacing="tight" alignment="center">
              
              <div style={{ width: '100px', height: '100px', margin: '0 auto' }}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <Avatar size="large" name={name} />
                )}
              </div>
              <Text variant="headingSm">{name}</Text>
            </BlockStack>

            <div style={{ marginTop: '1rem' }}>
              <FormLayout>
                <TextField label="Full Name" value={name} onChange={setName} autoComplete="off" />
                <TextField label="Email Address" value={userProfile?.email || ''} disabled />
                <ProfileImageUploader setImageUrl={setImageUrl} setFile={setFile} />
              </FormLayout>
            </div>
          </Card>

          <Card title="Password" sectioned subdued>
            <PasswordChanger />
          </Card>

          <div style={{ marginTop: '1rem' }}>
            <InlineStack align="end">
              <Button size="slim" onClick={handleSubmit} loading={profileLoading} primary>
                Save Changes
              </Button>
            </InlineStack>
            {profileMessage && (
              <Text variant="bodySm" tone="subdued" as="p" alignment="end">
                {profileMessage}
              </Text>
            )}
          </div>
        </div>
      </Layout.Section>
    </Layout>
  );
}

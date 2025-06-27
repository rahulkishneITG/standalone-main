import { Page, Layout, Card } from '@shopify/polaris';
import SettingsForm from '../../components/Main Content/Settings/SettingsForm';

export default function SettingsPage() {
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
            <SettingsForm />
        </Layout.Section>
      </Layout>
    </Page>
  );
}

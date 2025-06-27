import { Page, Layout, Text } from '@shopify/polaris';
import CreateEventForm from '../../../components/Main Content/CreateEvent/CreateEventForm';
import EditEventStore from '../../../store/EditEventStore';
import FullPageLoader from '../../../components/Loader';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditEvent = () => {
  const { eventData, loading, error, fetchEventDataById } = EditEventStore();
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    if (id) {
      fetchEventDataById(id);
    }
  }, [id]);

  if (loading) {
    return <FullPageLoader />
  }

  if (error) {
    return <Text color="critical">{error}</Text>;
  }

  console.log(eventData);

  return (
    <Page>
      <Layout >
        <CreateEventForm eventdata={eventData.data} />
      </Layout>
    </Page>
  );
};

export default EditEvent;

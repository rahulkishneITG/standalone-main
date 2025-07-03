import { Page, Layout, Spinner } from '@shopify/polaris';
import EventDetails from '../../../components/Main Content/WalkinForm/EventDetails/EventDetails';
import { useEffect } from 'react';
import FullPageLoader from '../../../components/Loader';
import useWalkinStore from '../../../store/walkinStore';
import { useParams } from 'react-router-dom';



const WalkinForm = () => {
      const { walkinId } = useParams();
      const { walkinDetails, loading, error, fetchWalkinById } = useWalkinStore();

      useEffect(() => {
        fetchWalkinById(walkinId);
      }, [walkinId]);

      if (loading) {  
        return <FullPageLoader/>;
      }

      if (!walkinDetails) {
        return <p>Walkin not found.</p>;
      }
  return (
    <Page>
      <Layout >
        <div style={{ maxWidth: 'max-content', margin: '0 auto',display:"flex",marginBlock:"24px"}}>
          <EventDetails event={walkinDetails.event_details} />
        </div>
      </Layout>
    </Page>
  );
};
export default WalkinForm;

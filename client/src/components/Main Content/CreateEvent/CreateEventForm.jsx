import {
    Card,
    TextField,
    FormLayout,
    Button,
    Layout,
    DropZone,
    Text,
  } from '@shopify/polaris';
  import { useCallback, useState, useEffect } from 'react';
  import { useLocation } from 'react-router-dom';
  import useEventStore from '../../../store/CreateEventStore.js';
  import ProductSearch from './ProductSearch';
  import SwitchCheckbox from './SwitchCheckbox.jsx';
  
  const CreateEventForm = ({ eventdata = {} }) => {
    const { eventData, setField, setMultipleFields, resetEventForm } = useEventStore();
    const [file, setFile] = useState(null);
    const location = useLocation();
  
    useEffect(() => {
        const isCreate = location.pathname.includes('/event/create');
      
        if (isCreate) {
          resetEventForm(); 
        }
      }, [location.pathname]);

    const {
      allow_group_registration = false,
      created_at = '',
      created_by = '',
      description = '',
      draftStatus = false,
      enable_marketing_email = false,
      event_date = '',
      event_time = '',
      image_url = '',
      location: event_location = '',
      max_capacity = '',
      name = '',
      pre_registration_capacity = '',
      pre_registration_end = '',
      pre_registration_start = '',
      pricing_pre_registration = { $numberDecimal: '' },
      pricing_walk_in = { $numberDecimal: '' },
      shopify_product_id = '',
      status = '',
      updated_at = '',
      walk_in_capacity = '',
      __v = '',
      _id = '',
    } = eventdata;
    
    
    // ✅ Auto-fill store if eventdata is passed (edit mode)
    useEffect(() => {
        const isEdit = location.pathname.includes('/event/edit') && eventdata?._id;
      
        if (isEdit) {
          setMultipleFields({
            name,
            dateTime: event_date ? `${event_date.substring(0, 10)}T${event_time}` : '',
            location: event_location,
            maxCapacity: max_capacity?.toString(),
            walkInSlot: walk_in_capacity?.toString(),
            closingDate: pre_registration_end ? pre_registration_end.substring(0, 16) : '',
            description,
            groupRegistration: allow_group_registration,
            collectEmails: enable_marketing_email,
            prePrice: pricing_pre_registration?.$numberDecimal || '',
            walkInPrice: pricing_walk_in?.$numberDecimal || '',
            shopifyProductId: shopify_product_id,
          });
        }
      }, [eventdata, location.pathname]);
      
  
    const handleChange = useCallback((field) => (value) => setField(field, value), []);
    const handleDrop = useCallback((files, accepted) => setFile(accepted[0]), []);
  
    return (
      <Layout>
        <div style={{ display: 'flex', gap: '16px', marginBlock: '24px', alignItems: 'stretch' }}>
          {/* Left side 70% */}
          <div style={{ flex: '0 0 70%' }}>
            <Card title="Create Event">
              <div style={{ marginBottom: '16px' }}>
                <Text variant="headingMd" as="h2">
                  {location.pathname.startsWith('/event/create') ? 'Create Event' : 'Edit Event'}
                </Text>
              </div>
              <FormLayout>
                <ProductSearch />
                <FormLayout.Group condensed>
                  <TextField label="Event Name" value={eventData.name} onChange={handleChange('name')} />
                  <TextField type="datetime-local" label="Event Date & Time" value={eventData.dateTime} onChange={handleChange('dateTime')} />
                  <TextField label="Event Location" value={eventData.location} onChange={handleChange('location')} />
                </FormLayout.Group>
  
                <FormLayout.Group condensed>
                  <TextField label="Max Capacity" type="number" value={eventData.maxCapacity} onChange={handleChange('maxCapacity')} />
                  <TextField label="Walk-in Slot Allocation" type="number" value={eventData.walkInSlot} onChange={handleChange('walkInSlot')} />
                  <TextField label="Pre-registration Closing Date/Time" type="datetime-local" value={eventData.closingDate} onChange={handleChange('closingDate')} />
                </FormLayout.Group>
  
                <TextField
                  label="Event Description"
                  value={eventData.description}
                  onChange={handleChange('description')}
                  multiline={4}
                />
  
                <SwitchCheckbox
                  label="Group Registration"
                  checked={eventData.groupRegistration}
                  onChange={(val) => setField('groupRegistration', val)}
                />
  
                <SwitchCheckbox
                  label="Collect Emails for Future Marketing"
                  checked={eventData.collectEmails}
                  onChange={(val) => setField('collectEmails', val)}
                />
              </FormLayout>
            </Card>
  
            <div style={{ marginTop: '1rem', textAlign: 'start' }}>
              <Button primary onClick={() => console.log(eventData)}>Submit</Button>
            </div>
          </div>
  
          {/* Right side 30% */}
          <div style={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card title="Ticket Pricing">
              <div style={{ marginBottom: '16px' }}>
                <Text variant="headingMd" as="h2">Ticket Pricing</Text>
              </div>
              <FormLayout>
                <TextField
                  label="Pre-registration Price"
                  prefix="$"
                  value={eventData.prePrice}
                  onChange={handleChange('prePrice')}
                />
                <TextField
                  label="Walk-in Price"
                  prefix="$"
                  value={eventData.walkInPrice}
                  onChange={handleChange('walkInPrice')}
                />
              </FormLayout>
            </Card>
  
            <Card title="Upload Logo/Banner" sectioned>
              <DropZone onDrop={handleDrop} allowMultiple={false} label="Upload Logo/Banner">
                {file ? (
                  <Text variant="bodySm">{file.name}</Text>
                ) : (
                  <DropZone.FileUpload actionTitle="Upload File" actionHint="Upload Logo/Banner for embedded form" />
                )}
              </DropZone>
            </Card>
          </div>
        </div>
      </Layout>
    );
  };
  
  export default CreateEventForm;
  
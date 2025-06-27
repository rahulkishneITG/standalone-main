import {
  Card,
  TextField,
  FormLayout,
  Button,
  Layout,
  DropZone,
  Text,
} from '@shopify/polaris';
import { useCallback, useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import useEventStore from '../../../store/CreateEventStore.js';
import ProductSearch from './ProductSearch';
import SwitchCheckbox from './SwitchCheckbox.jsx';
import validateEventForm from '../../../utils/validateForm.js';
import { AuthContext } from '../../../context/AuthContext';
import { createEvent } from '../../../api/eventApi.js';
import toast from 'react-hot-toast';

const CreateEventForm = ({ eventdata = {} }) => {
  const { eventData, setField, setMultipleFields, resetEventForm } = useEventStore();
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const isCreate = location.pathname.includes('/event/create');
    if (isCreate) resetEventForm();
  }, [location.pathname]);

  useEffect(() => {
    const isEdit = location.pathname.includes('/event/edit') && eventdata?._id;
    if (isEdit) {
      const {
        allow_group_registration = false,
        description = '',
        enable_marketing_email = false,
        event_date = '',
        event_time = '',
        location: event_location = '',
        max_capacity = '',
        name = '',
        pre_registration_end = '',
        pricing_pre_registration = { $numberDecimal: '' },
        pricing_walk_in = { $numberDecimal: '' },
        shopify_product_id = '',
        walk_in_capacity = '',
      } = eventdata;

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

  const handleChange = useCallback(
    (field) => (value) => {
      setField(field, value);
      setTouchedFields((prev) => ({ ...prev, [field]: true }));
      const singleFieldErrors = validateEventForm({ ...eventData, [field]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [field]: singleFieldErrors[field] }));
    },
    [eventData, setField]
  );

  const handleDrop = useCallback((files, accepted) => setFile(accepted[0]), []);

  // const handleSubmit = () => {
  //   const validationErrors = validateEventForm(eventData);
  //   setErrors(validationErrors);
  //   setTouchedFields(
  //     Object.keys(eventData).reduce((acc, key) => {
  //       acc[key] = true;
  //       return acc;
  //     }, {})
  //   );

  //   if (Object.keys(validationErrors).length > 0) return;

  //   const [eventDate, eventTime] = eventData.dateTime?.split('T') || [];

  //   const finalPayload = {
  //     name: eventData.name,
  //     status: '',
  //     draftStatus: true,
  //     event_date: eventDate || '',
  //     event_time: eventTime || '',
  //     location: eventData.location,
  //     max_capacity: parseInt(eventData.maxCapacity, 10),
  //     walk_in_capacity: parseInt(eventData.walkInSlot, 10),
  //     pre_registration_capacity: 0,
  //     pre_registration_start: '',
  //     pre_registration_end: eventData.closingDate,
  //     description: eventData.description,
  //     allow_group_registration: eventData.groupRegistration,
  //     enable_marketing_email: eventData.collectEmails,
  //     pricing_pre_registration: parseFloat(eventData.prePrice),
  //     pricing_walk_in: parseFloat(eventData.walkInPrice),
  //     image_url: '',
  //     shopify_product_id: `gid://shopify/Product/${eventData.shopifyProductId}`,
  //     created_by: user?._id || '',
  //   };

  //   console.log('✅ Final Payload:', finalPayload);
  // };
   const handleSubmit = async () => {
    const validationErrors = validateEventForm(eventData);
    setErrors(validationErrors);
  
    const allFields = [
      'name',
      'dateTime',
      'location',
      'maxCapacity',
      'walkInSlot',
      'closingDate',
      'description',
      'prePrice',
      'walkInPrice',
      'shopifyProductId',
    ];
  
    setTouchedFields((prev) => ({
      ...prev,
      ...allFields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {}),
    }));
  
    if (Object.keys(validationErrors).length > 0) return;
  
    const [eventDate, eventTime] = eventData.dateTime?.split('T') || [];
  
    const finalPayload = {
      name: eventData.name,
      status: '',
      draftStatus: true,
      event_date: eventDate || '',
      event_time: eventTime || '',
      location: eventData.location,
      max_capacity: parseInt(eventData.maxCapacity, 10),
      walk_in_capacity: parseInt(eventData.walkInSlot, 10),
      pre_registration_capacity: 0,
      pre_registration_start: '',
      pre_registration_end: eventData.closingDate,
      description: eventData.description,
      allow_group_registration: eventData.groupRegistration,
      enable_marketing_email: eventData.collectEmails,
      pricing_pre_registration: parseFloat(eventData.prePrice),
      pricing_walk_in: parseFloat(eventData.walkInPrice),
      image_url: '',
      shopify_product_id: `gid://shopify/Product/${eventData.shopifyProductId}`,
      created_by: user?._id || '',
    };
  
    console.log('Final Payload:', finalPayload);
    try {
      const response = await createEvent(finalPayload);
      console.log('Event Created:', response);
      resetEventForm(); 
      toast.success("Event created successfully!");
    } catch (error) {
      console.error('API Error:', error);
        toast.error("Failed to create event");
    }
  };
  
  return (
    <Layout>
      <div style={{ display: 'flex', gap: '16px', marginBlock: '24px', alignItems: 'stretch' }}>
        <div style={{ flex: '0 0 70%' }}>
          <Card title="Create Event">
            <div style={{ marginBottom: '16px' }}>
              <Text variant="headingMd" as="h2">
                {location.pathname.startsWith('/event/create') ? 'Create Event' : 'Edit Event'}
              </Text>
            </div>
            <FormLayout>
              <div style={{ position: 'relative', zIndex: 50 }}>
                <ProductSearch
                  error={touchedFields.shopifyProductId ? errors.shopifyProductId : undefined}
                  onProductSelect={(product) => {
                    setField('shopifyProductId', product.value);
                    setField('productHandle', product.label);
                    setTouchedFields((prev) => ({ ...prev, shopifyProductId: true }));
                    setErrors((prevErrors) => ({ ...prevErrors, shopifyProductId: undefined }));
                  }}
                />
              </div>
              <FormLayout.Group condensed>
                <TextField
                  label="Event Name"
                  value={eventData.name}
                  onChange={handleChange('name')}
                  error={touchedFields.name ? errors.name : undefined}
                />
                <TextField
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  label="Event Date & Time"
                  value={eventData.dateTime}
                  onChange={handleChange('dateTime')}
                  error={touchedFields.dateTime ? errors.dateTime : undefined}
                />
                <TextField
                  label="Event Location"
                  value={eventData.location}
                  onChange={handleChange('location')}
                  error={touchedFields.location ? errors.location : undefined}
                />
              </FormLayout.Group>

              <FormLayout.Group condensed>
                <TextField
                  label="Max Capacity"
                  type="number"
                  value={eventData.maxCapacity}
                  onChange={handleChange('maxCapacity')}
                  error={touchedFields.maxCapacity ? errors.maxCapacity : undefined}
                />
                <TextField
                  label="Walk-in Slot Allocation"
                  type="number"
                  value={eventData.walkInSlot}
                  onChange={handleChange('walkInSlot')}
                  error={touchedFields.walkInSlot ? errors.walkInSlot : undefined}
                />
                <TextField
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  label="Pre-registration Closing Date/Time"
                  value={eventData.closingDate}
                  onChange={handleChange('closingDate')}
                  error={touchedFields.closingDate ? errors.closingDate : undefined}
                />
              </FormLayout.Group>

              <TextField
                label="Event Description"
                value={eventData.description}
                onChange={handleChange('description')}
                multiline={4}
                error={touchedFields.description ? errors.description : undefined}
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
            <Button primary onClick={handleSubmit}>Submit</Button>
          </div>
        </div>

        <div style={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="Ticket Pricing">
            <div style={{ marginBottom: '16px' }}>
              <Text variant="headingMd" as="h2">Ticket Pricing</Text>
            </div>
            <FormLayout>
              <TextField
                label="Pre-registration Price"
                prefix="$"
                type="number"
                value={eventData.prePrice?.toString() ?? ''}
                onChange={handleChange('prePrice')}
                error={touchedFields.prePrice ? errors.prePrice : undefined}
              />

              <TextField
                label="Walk-in Price"
                prefix="$"
                type="number"
                value={eventData.walkInPrice?.toString() ?? ''}
                onChange={handleChange('walkInPrice')}
                error={touchedFields.walkInPrice ? errors.walkInPrice : undefined}
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

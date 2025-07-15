import React, { useCallback, useState } from 'react';
import {
  Modal,
  TextField,
  Button,
  FormLayout,
  Card,
  TextContainer,
} from '@shopify/polaris';
import useSendEmailStore from '../store/sendEmailStore.js';
import { sendEmail } from '../api/sendEmailApi.js';

const EmailFormModal = ({ open, onClose }) => {
  const { to, subject, text, setFormData, resetForm } = useSendEmailStore();
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (value, name) => setFormData(name, value),
    [setFormData]
  );

  const handleSubmit = async () => {
    const formData = { to, subject, text, html: '' };
    setLoading(true);

    try {
      const result = await sendEmail(formData);
      alert(result.message);
      resetForm();
      onClose();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send Email"
      primaryAction={{
        content: 'Send',
        onAction: handleSubmit,
        loading,
      }}
      secondaryActions={[{ content: 'Cancel', onAction: onClose }]}
    >
      <Modal.Section>
        <Card sectioned>
          <FormLayout>
            <TextField
              label="Recipient Email"
              type="email"
              name="to"
              value={to}
              onChange={(value) => handleChange(value, 'to')}
              autoComplete="email"
              requiredIndicator
            />
            <TextField
              label="Subject"
              name="subject"
              value={subject}
              onChange={(value) => handleChange(value, 'subject')}
              requiredIndicator
            />
            <TextField
              label="Message"
              name="text"
              value={text}
              onChange={(value) => handleChange(value, 'text')}
              multiline={4}
              requiredIndicator
            />
          </FormLayout>
        </Card>
      </Modal.Section>
    </Modal>
  );
};

export default EmailFormModal;

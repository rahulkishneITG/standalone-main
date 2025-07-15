import React from 'react';
import {
  IndexTable,
  Text,
  Link,
  useIndexResourceState,
} from '@shopify/polaris';
import { formatDate } from '../../../utils/dateFormatter.js';

const AttendeeTable = ({ attendees,setModalOpen} ) => {
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(attendees);
  console.log(attendees);
  const hasEmailPreferences = attendees.some(
    attendee => attendee.email_preferences_chm || attendee.email_preferences_dr_brownstein
  );
  const rowMarkup = attendees.map(({ _id, name, email, email_preferences_chm, email_preferences_dr_brownstein, eventName, registration_type, is_paid, registered_at }, index) => (
    <IndexTable.Row
      id={_id}
      key={_id}
      selected={selectedResources.includes(_id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="medium">{name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{email}</IndexTable.Cell>
      <IndexTable.Cell>{eventName}</IndexTable.Cell>
      <IndexTable.Cell>{registration_type}</IndexTable.Cell>
      <IndexTable.Cell>{is_paid ? 'Yes' : 'No'}</IndexTable.Cell>
      <IndexTable.Cell>{formatDate(registered_at)}</IndexTable.Cell>
      {hasEmailPreferences && (
        <IndexTable.Cell>
          {email_preferences_chm || email_preferences_dr_brownstein
            ? [email_preferences_chm && 'CHM', email_preferences_dr_brownstein && 'Dr. Brownstein']
              .filter(Boolean)
              .join(', ')
            : 'No'}
        </IndexTable.Cell>
      )}
      <IndexTable.Cell>
        <Link variant="plain" onClick={() => setModalOpen(true)}>
          Resend confirmation email
        </Link>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <IndexTable
      resourceName={{ singular: 'attendee', plural: 'attendees' }}
      itemCount={attendees.length}
      selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
      onSelectionChange={handleSelectionChange}
      headings={[
        { title: 'Name' },
        { title: 'Email' },
        { title: "Event Name" },
        { title: 'Registration Type' },
        { title: 'Paid' },
        { title: 'Registered Date' },
        ...(hasEmailPreferences ? [{ title: 'Future Emails' }] : []),
        { title: 'Actions' },
      ]}
      selectable={false}
    >
      {rowMarkup}
    </IndexTable>
  );
};

export default AttendeeTable;

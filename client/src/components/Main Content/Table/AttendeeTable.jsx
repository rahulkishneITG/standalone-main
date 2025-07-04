import React from 'react';
import {
  IndexTable,
  Text,
  Link,
  useIndexResourceState,
} from '@shopify/polaris';
import { formatDate } from '../../../utils/dateFormatter.js';

const AttendeeTable = ({ attendees }) => {
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(attendees);

  const rowMarkup = attendees.map(({ _id, name, email, registration_type, is_paid, registered_at }, index) => (
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
      <IndexTable.Cell>{registration_type}</IndexTable.Cell> 
      <IndexTable.Cell>{is_paid ? 'Yes' : 'No'}</IndexTable.Cell>
      <IndexTable.Cell>{formatDate(registered_at)}</IndexTable.Cell>
      <IndexTable.Cell>
        <Link variant="plain" onClick={() => console.log(`Resend email to ${email}`)}>
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
        { title: 'Registration Type' },
        { title: 'Paid' },
        { title: 'Registered Date' },
        { title: 'Actions' },
      ]}
      selectable={false}
    >
      {rowMarkup}
    </IndexTable>
  );
};

export default AttendeeTable;

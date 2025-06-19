import React, { useState, useCallback } from 'react';
import {
  Page,
  Card,
  IndexTable,
  Text,
  Filters,
  Link,
  ChoiceList,
  useIndexResourceState,
  Pagination,
  Button,
  Icon,
  TextField,
} from '@shopify/polaris';
import { SortIcon } from '@shopify/polaris-icons';
import styles from './Attendee.module.css';

const users = [
  { id: '1', name: 'Jane Cooper', email: 'example@gmail.com', registrationType: 'Individual', paid: 'Yes', registeredDate: '25 Mar 2025' },
  { id: '2', name: 'Wade Warren', email: 'example@gmail.com', registrationType: 'Group', paid: 'Yes', registeredDate: '24 Mar 2025' },
  { id: '3', name: 'Esther Howard', email: 'example@gmail.com', registrationType: 'Individual', paid: 'No', registeredDate: '23 Mar 2025' },
  { id: '4', name: 'Robert Fox', email: 'example@gmail.com', registrationType: 'Individual', paid: 'Yes', registeredDate: '22 Mar 2025' },
  { id: '5', name: 'Albert Flores', email: 'example@gmail.com', registrationType: 'Group', paid: 'No', registeredDate: '20 Mar 2025' },
];

function Attendee() {
  const [queryValue, setQueryValue] = useState('');
  const [registrationType, setRegistrationType] = useState([]);
  const [paidStatus, setPaidStatus] = useState([]);
  const [registeredDate, setRegisteredDate] = useState('');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleQueryValueChange = useCallback((value) => setQueryValue(value), []);
  const handleRegistrationTypeChange = useCallback((value) => setRegistrationType(value), []);
  const handlePaidStatusChange = useCallback((value) => setPaidStatus(value), []);
  const handleRegisteredDateChange = useCallback((value) => setRegisteredDate(value), []);

  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
  const handleRegistrationTypeRemove = useCallback(() => setRegistrationType([]), []);
  const handlePaidStatusRemove = useCallback(() => setPaidStatus([]), []);
  const handleRegisteredDateRemove = useCallback(() => setRegisteredDate(''), []);
  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
    handleRegistrationTypeRemove();
    handlePaidStatusRemove();
    handleRegisteredDateRemove();
  }, [handleQueryValueRemove, handleRegistrationTypeRemove, handlePaidStatusRemove, handleRegisteredDateRemove]);

  const filters = [
    {
      key: 'registrationType',
      label: 'Registration type',
      filter: (
        <ChoiceList
          title="Registration type"
          titleHidden
          choices={[
            { label: 'Individual', value: 'Individual' },
            { label: 'Group', value: 'Group' },
          ]}
          selected={registrationType}
          onChange={handleRegistrationTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'paidStatus',
      label: 'Paid',
      filter: (
        <ChoiceList
          title="Paid"
          titleHidden
          choices={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]}
          selected={paidStatus}
          onChange={handlePaidStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'registeredDate',
      label: 'Date',
      filter: (
        <TextField
          label="Registered Date"
          value={registeredDate}
          onChange={handleRegisteredDateChange}
          autoComplete="off"
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = [];
  if (registrationType.length) {
    appliedFilters.push({
      key: 'registrationType',
      label: `Registration type: ${registrationType.join(', ')}`,
      onRemove: handleRegistrationTypeRemove,
    });
  }
  if (paidStatus.length) {
    appliedFilters.push({
      key: 'paidStatus',
      label: `Paid: ${paidStatus.join(', ')}`,
      onRemove: handlePaidStatusRemove,
    });
  }
  if (registeredDate) {
    appliedFilters.push({
      key: 'registeredDate',
      label: `Date: ${registeredDate}`,
      onRemove: handleRegisteredDateRemove,
    });
  }

  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      user.name.toLowerCase().includes(queryValue.toLowerCase()) ||
      user.email.toLowerCase().includes(queryValue.toLowerCase());
    const matchesRegistrationType =
      registrationType.length === 0 || registrationType.includes(user.registrationType);
    const matchesPaidStatus = paidStatus.length === 0 || paidStatus.includes(user.paid);
    const matchesDate = registeredDate === '' || user.registeredDate.includes(registeredDate);

    return matchesQuery && matchesRegistrationType && matchesPaidStatus && matchesDate;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (sortDirection === 'ascending') {
      return nameA < nameB ? -1 : 1;
    } else {
      return nameA > nameB ? -1 : 1;
    }
  });

  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(
    paginatedUsers
  );

  const toggleSortDirection = useCallback(() => {
    setSortDirection((prev) => (prev === 'ascending' ? 'descending' : 'ascending'));
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const rowMarkup = paginatedUsers.map(({ id, name, email, registrationType, paid, registeredDate }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
     
    >
      <IndexTable.Cell>
      <div style={{ padding: '8px' }}>
        <Text variant="bodyMd" fontWeight="medium">
          {name}
        </Text>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>{email}</IndexTable.Cell>
      <IndexTable.Cell>{registrationType}</IndexTable.Cell>
      <IndexTable.Cell>{paid}</IndexTable.Cell>
      <IndexTable.Cell>{registeredDate}</IndexTable.Cell>
      <IndexTable.Cell>
        <Link onClick={() => console.log(`Resend confirmation email to ${email}`)} variant="plain">
          Resend confirmation email
        </Link>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page fullWidth>
      <Card padding="0">
        <div style={{ padding: 'var(--p-space-5)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--p-space-4)' }}>
            {/* Search, Cancel, and Sort in a single line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--p-space-4)', paddingRight: '10px' }} className={styles.searchContainer}>
              <div style={{ flexGrow: 1 }} className="search-bar">
                <Filters
                  queryValue={queryValue}
                  queryPlaceholder="Search"
                  filters={[]}
                  appliedFilters={[]}
                  onQueryChange={handleQueryValueChange}
                  onQueryClear={handleQueryValueRemove}
                  onClearAll={handleFiltersClearAll}
                  disableFilters
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                <Button onClick={handleQueryValueRemove} variant="tertiary">
                  Cancel
                </Button>
                <Button
                  onClick={toggleSortDirection}
                  icon={<Icon source={SortIcon} />}
                  accessibilityLabel="Sort by name"
                />
              </div>
               
            </div>
            {/* Filters below the search row */}
            <div style={{ marginTop: 'var(--p-space-4)' }} className={styles.hideQueryField}>
              <Filters
                queryValue=""
                queryPlaceholder=""
                filters={filters}
                appliedFilters={appliedFilters}
                onQueryChange={() => {}}
                onQueryClear={() => {}}
                onClearAll={handleFiltersClearAll}
                disableQueryField={true}
                hideQueryField
              />
            </div>
          </div>
        </div>
        <IndexTable
          resourceName={{ singular: 'user', plural: 'users' }}
          itemCount={paginatedUsers.length}
          selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: 'Name' },
            { title: 'Email' },
            { title: 'Registration type' },
            { title: 'Paid' },
            { title: 'Registered Date' },
            { title: 'Actions' },
          ]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
        {totalItems > itemsPerPage && (
          <div style={{ padding: 'var(--p-space-4)', display: 'flex', justifyContent: 'center' }} className={styles.pagination}>
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={handlePreviousPage}
              hasNext={currentPage < totalPages}
              onNext={handleNextPage}
            />
          </div>
        )}
      </Card>
    </Page>
  );
}

export default Attendee;
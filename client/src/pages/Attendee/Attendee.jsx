import React, { useEffect } from 'react';
import {
  Page,
  Card,
  Filters,
  Button,
  Icon,
  ChoiceList,
  TextField,
  Pagination,
  Spinner,
} from '@shopify/polaris';
import { SortIcon } from '@shopify/polaris-icons';
import AttendeeTable from '../../components/Main Content/Table/AttendeeTable';
import { useAttendeeStore } from '../../store/attendeeStore.js';


const AttendeePage = () => {
  const {
    attendees,
    totalAttendees,
    loading,
    query,
    registrationType,
    paidStatus,
    registeredDate,
    sortDirection,
    currentPage,
    itemsPerPage,
    fetchAttendees,
    setQuery,
    setRegistrationType,
    setPaidStatus,
    setRegisteredDate,
    setSortDirection,
    setPage,
    clearAll,
  } = useAttendeeStore();
  console.log('attendees', attendees);
  useEffect(() => {
    fetchAttendees();
  }, [query, registrationType, paidStatus, registeredDate, sortDirection, currentPage]);

  const appliedFilters = [
    registrationType.length > 0 && {
      key: 'registrationType',
      label: `Type: ${registrationType.join(', ')}`,
      onRemove: () => setRegistrationType([]),
    },
    paidStatus.length > 0 && {
      key: 'paidStatus',
      label: `Paid: ${paidStatus.join(', ')}`,
      onRemove: () => setPaidStatus([]),
    },
    registeredDate && {
      key: 'registeredDate',
      label: `Date: ${registeredDate}`,
      onRemove: () => setRegisteredDate(''),
    },
  ].filter(Boolean);

  const filters = [
    {
      key: 'registrationType',
      label: 'Registration Type',
      filter: (
        <ChoiceList
          title="Registration Type"
          titleHidden
          choices={[
            { label: 'Individual', value: 'Individual' },
            { label: 'Group', value: 'Group' },
          ]}
          selected={registrationType}
          onChange={setRegistrationType}
          allowMultiple
        />
      ),
    },
    {
      key: 'paidStatus',
      label: 'Paid Status',
      filter: (
        <ChoiceList
          title="Paid"
          titleHidden
          choices={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]}
          selected={paidStatus}
          onChange={setPaidStatus}
          allowMultiple
        />
      ),
    },
    {
      key: 'registeredDate',
      label: 'Date',
      filter: (
        <TextField
          label="Date"
          value={registeredDate}
          onChange={setRegisteredDate}
          autoComplete="off"
        />
      ),
    },
  ];

  return (
    <Page fullWidth>
      <Card padding="0">
        <div style={{ padding: '0px' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',paddingRight: '10px',borderBottom: '1px solid #E0E0E0' }}>
            <div style={{ width: '95%' }}>
              <Filters
                queryValue={query}
                queryPlaceholder="Search"
                filters={[]}
                appliedFilters={[]}
                onQueryChange={setQuery}
                onQueryClear={() => setQuery('')}
                onClearAll={clearAll}
                disableFilters
              />
            </div>
            <Button onClick={setSortDirection} icon={<Icon source={SortIcon} tone="base"/>} />
          </div>
          <div style={{ marginTop: '0rem' }}>
            <Filters
              queryValue=""
              filters={filters}
              appliedFilters={appliedFilters}
              onQueryChange={() => {}}
              onQueryClear={() => {}}
              onClearAll={clearAll}
              hideQueryField
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner accessibilityLabel="Loading attendees" size="large" />
          </div>
        ) : (
          <AttendeeTable attendees={attendees} />
        )}

        {totalAttendees > itemsPerPage && (
          <div style={{display: 'flex', justifyContent: 'center',padding: "6px",backgroundColor: "#F7F7F7",borderTop: "1px solid #E0E0E0"}}>
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => setPage(currentPage - 1)}
              hasNext={currentPage < Math.ceil(totalAttendees / itemsPerPage)}
              onNext={() => setPage(currentPage + 1)}
            />
          </div>
        )}
      </Card>
    </Page>
  );
};

export default AttendeePage;

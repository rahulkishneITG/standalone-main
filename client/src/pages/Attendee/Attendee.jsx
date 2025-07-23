import React, { useEffect, useState } from 'react';
import {
  Page, Card, Filters, Button, Icon, ChoiceList, TextField, Pagination, Spinner,
} from '@shopify/polaris';
import { SortIcon } from '@shopify/polaris-icons';


import { useAttendeeStore } from '../../store/attendeeStore.js'; 
import AttendeeTable from '../../components/Main Content/Table/AttendeeTable';
import FullPageLoader from '../../components/Loader.jsx';
import EmailFormModal from '../../components/EmailForm.jsx';

const AttendeePage = () => {
  const [isFullPageLoading, setIsFullPageLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [hasMountedOnce, setHasMountedOnce] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    attendees, totalAttendees, query, registrationType, paidStatus,
    registeredDate, eventName, sortDirection, currentPage, itemsPerPage,
    error, fetchAttendees, setQuery, setRegistrationType, setPaidStatus,
    setRegisteredDate, setEventName, setSortDirection, setPage, clearAll,
  } = useAttendeeStore();

  useEffect(() => {
    const loadData = async () => {
      setIsFullPageLoading(true);
      await fetchAttendees();
      setIsFullPageLoading(false);
      setHasMountedOnce(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!hasMountedOnce) return;
    setIsTableLoading(true);
    fetchAttendees().finally(() => setIsTableLoading(false));
  }, [query, registrationType, paidStatus, registeredDate, eventName, sortDirection, currentPage]);

  const appliedFilters = [
    registrationType.length > 0 && {
      key: 'registrationType',
      label: `Type: ${registrationType.join(', ')}`,
      onRemove: () => setRegistrationType([]),
    },
    paidStatus.length > 0 && {
      key: 'paidStatus',
      label: `Paid: ${paidStatus[0]}`,
      onRemove: () => setPaidStatus([]),
    },
    registeredDate && {
      key: 'registeredDate',
      label: `Date: ${registeredDate}`,
      onRemove: () => setRegisteredDate(''),
    },
    eventName && {
      key: 'eventName',
      label: `Event: ${eventName}`,
      onRemove: () => setEventName(''),
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
          choices={[{ label: 'Individual', value: 'Individual' }, { label: 'Group', value: 'Group' }]}
          selected={registrationType}
          onChange={setRegistrationType}
          allowMultiple={false}
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
          choices={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
          selected={paidStatus}
          onChange={setPaidStatus}
          allowMultiple={false}
        />
      ),
    },
    {
      key: 'registeredDate',
      label: 'Date',
      filter: (
        <TextField
          label="Date"
          type="date"
          value={registeredDate}
          onChange={setRegisteredDate}
          autoComplete="off"
        />
      ),
    },
    {
      key: 'eventName',
      label: 'Event Name',
      filter: (
        <TextField
          label="Event Name"
          value={eventName}
          onChange={setEventName}
          autoComplete="off"
        />
      ),
    },
  ];

  if (isFullPageLoading) return <FullPageLoader />;

  return (
    <Page fullWidth>
      <Card padding="0">
        <div style={{ padding: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 10, borderBottom: '1px solid #E0E0E0' }}>
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
            <Button onClick={setSortDirection} icon={<Icon source={SortIcon} tone="base" />} />
          </div>

          <Filters
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={clearAll}
            hideQueryField
          />
        </div>

        {isTableLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner accessibilityLabel="Loading attendees" size="large" />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            Error loading attendees: {error}
          </div>
        ) : (
          <AttendeeTable attendees={attendees} setModalOpen={setModalOpen} />
        )}

        {totalAttendees > itemsPerPage && !error && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 6, backgroundColor: '#F7F7F7', borderTop: '1px solid #E0E0E0' }}>
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => setPage(currentPage - 1)}
              hasNext={currentPage < Math.ceil(totalAttendees / itemsPerPage)}
              onNext={() => setPage(currentPage + 1)}
            />
          </div>
        )}
      </Card>
      <EmailFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Page>
  );
};

export default AttendeePage;

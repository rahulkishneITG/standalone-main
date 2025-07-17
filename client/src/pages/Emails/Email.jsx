import React, { useEffect, useState } from 'react';
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
import { create } from 'zustand';
import AttendeeTable from '../../components/Main Content/Table/AttendeeTable';
import FullPageLoader from '../../components/Loader.jsx';

// Zustand store for attendee data
const useAttendeeStore = create((set) => ({
  attendees: [],
  totalAttendees: 0,
  query: '',
  registrationType: [],
  paidStatus: [],
  registeredDate: '',
  eventName: '', // Added eventName state
  sortDirection: 'asc',
  currentPage: 1,
  itemsPerPage: 5,
  error: null,
  setQuery: (value) => set({ query: value }),
  setRegistrationType: (value) => set({ registrationType: value }),
  setPaidStatus: (value) => set({ paidStatus: value }),
  setRegisteredDate: (value) => set({ registeredDate: value }),
  setEventName: (value) => set({ eventName: value }), // Added eventName setter
  setSortDirection: () => set((state) => ({ sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' })),
  setPage: (page) => set({ currentPage: page }),
  clearAll: () => set({ query: '', registrationType: [], paidStatus: [], registeredDate: '', eventName: '' }), // Updated clearAll

  fetchAttendees: async () => {
    try {
      const state = useAttendeeStore.getState();
      const params = new URLSearchParams({
        page: state.currentPage,
        limit: state.itemsPerPage,
        sort: 'name',
        direction: state.sortDirection,
      });

      if (state.query) {
        params.append('search', state.query);
      }

      if (state.registrationType.length > 0) {
        params.append('registration_type', state.registrationType.join(','));
      }

      if (state.paidStatus.length > 0) {
        const paidValue = state.paidStatus[0] === 'Yes' ? 'yes' : 'no';
        params.append('is_paid', paidValue);
      }

      if (state.registeredDate) {
        params.append('registered_date', state.registeredDate);
      }

      // Add eventName if it exists
      if (state.eventName) {
        params.append('event_name', state.eventName);
      }

      const response = await fetch(`http://localhost:5000/api/email/getEmailList?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const attendees = Array.isArray(data.attendees) ? data.attendees : [];
      const totalAttendees = typeof data.total === 'number' ? data.total : 0;

      set({
        attendees,
        totalAttendees,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching attendees:', error);
      set({
        attendees: [],
        totalAttendees: 0,
        error: error.message,
      });
    }
  },
}));


const AttendeePage = () => {
  const [isFullPageLoading, setIsFullPageLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [hasMountedOnce, setHasMountedOnce] = useState(false);
 
  const {
    attendees,
    totalAttendees,
    query,
    registrationType,
    paidStatus,
    registeredDate,
    eventName, // Added eventName
    sortDirection,
    currentPage,
    itemsPerPage,
    error,
    fetchAttendees,
    setQuery,
    setRegistrationType,
    setPaidStatus,
    setRegisteredDate,
    setEventName, // Added setEventName
    setSortDirection,
    setPage,
    clearAll,
  } = useAttendeeStore();

  useEffect(() => {
    const loadInitialData = async () => {
      setIsFullPageLoading(true);
      await fetchAttendees();
      setIsFullPageLoading(false);
      setHasMountedOnce(true);
    };
    loadInitialData();
  }, []);
 
  useEffect(() => {
    if (!hasMountedOnce) return;
    setIsTableLoading(true);
    fetchAttendees().finally(() => {
      setIsTableLoading(false);
    });
  }, [query, registrationType, paidStatus, registeredDate, eventName, sortDirection, currentPage]); // Added eventName to dependencies
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
    eventName && { // Added eventName filter
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
          choices={[
            { label: 'Individual', value: 'Individual' },
            { label: 'Group', value: 'Group' },
          ]}
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
          choices={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
          ]}
          selected={paidStatus}
          onChange={(value) => setPaidStatus(value)}
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
 
  const [modalOpen, setModalOpen] = useState(false);
  if (isFullPageLoading) return <FullPageLoader />;
  return (
    <Page fullWidth>
      <Card padding="0">
        <div style={{ padding: '0px' }}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: '10px',
              borderBottom: '1px solid #E0E0E0',
            }}
          >
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
 
          <div style={{ marginTop: '0rem' }}>
            <Filters
              queryValue=""
              filters={filters}
              appliedFilters={appliedFilters}
              onQueryChange={() => { }}
              onQueryClear={() => { }}
              onClearAll={clearAll}
              hideQueryField
            />
          </div>
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
          <AttendeeTable attendees={attendees} />
        )}

        {totalAttendees > itemsPerPage && !error && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '6px',
              backgroundColor: '#F7F7F7',
              borderTop: '1px solid #E0E0E0',
            }}
          >
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => setPage(currentPage - 1)}
              hasNext={currentPage < Math.ceil(totalAttendees / itemsPerPage)}
              onNext={() => setPage(currentPage + 1)}
            />
          </div>
        )}
      </Card>
          <EmailFormModal  open={modalOpen} onClose={() => setModalOpen(false)}/>
    </Page>
  );
};
export default AttendeePage;
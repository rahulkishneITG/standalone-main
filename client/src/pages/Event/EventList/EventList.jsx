import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  IndexTable,
  Page,
  Pagination,
  Spinner,
  Modal,
  TextContainer,
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import useEventStore from '../../../store/eventStore';
import { formatDate } from '../../../utils/dateFormatter.js';
import FullPageLoader from '../../../components/Loader';
import TableHeader from '../../../components/Main Content/Table/TableHeader';
import TableRow from '../../../components/Main Content/Table/TableRow';
import useDebounce from '../../../hooks/useDebounce.js';
import styles from './EventList.module.css';
import toast from 'react-hot-toast';

const ROWS_PER_PAGE = 3;

const EventTable = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isFullPageLoading, setIsFullPageLoading] = useState(true);
  const [hasMountedOnce, setHasMountedOnce] = useState(false);

  const debouncedSearch = useDebounce(searchValue, 300);
  const navigate = useNavigate();
  const { eventList, totalCount, fetchEventList, deleteEvent } = useEventStore();

  const fetchData = useCallback(
    async (type = 'full', resetPage = false) => {
      const page = resetPage ? 1 : currentPage;
      const setLoading = type === 'table' ? setIsTableLoading : setIsFullPageLoading;

      setLoading(true);
      await fetchEventList({
        page,
        limit: ROWS_PER_PAGE,
        search: debouncedSearch || '',
        sortBy,
        order: sortOrder,
      });
      setLoading(false);
      if (resetPage) setCurrentPage(1);
    },
    [currentPage, debouncedSearch, sortBy, sortOrder, fetchEventList]
  );

  // ✅ On first load only → FullPageLoader
  useEffect(() => {
    const initialFetch = async () => {
      await fetchData('full');
      setHasMountedOnce(true);
    };
    initialFetch();
  }, []);

  // ✅ Pagination change → table spinner
  useEffect(() => {
    if (!hasMountedOnce) return;
    fetchData('table');
  }, [currentPage]);

  // ✅ Search → table spinner + reset to page 1
  useEffect(() => {
    if (!hasMountedOnce) return;
    fetchData('table', true);
  }, [debouncedSearch]);

  // ✅ Handlers
  const handleSearchChange = (value) => setSearchValue(value);

  const handleCancelSearch = () => {
    setSearchValue('');
    fetchData('table', true);
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    fetchData('table', true);
  };

  const handleEdit = (index) => {
    const eventId = eventList[index]._id;
    navigate(`/event/edit/${eventId}`);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    const eventId = eventList[deleteIndex]._id;
    setShowDeleteModal(false);
    await deleteEvent(eventId, () => {
      fetchData('full');
      toast.success('Event deleted successfully');
    });
  };

  const rowMarkup = isTableLoading ? (
    <IndexTable.Row>
      <IndexTable.Cell colSpan={8}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Spinner accessibilityLabel="Loading events" size="large" />
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ) : (
    eventList.map((event, index) => (
      <TableRow
        key={event._id}
        index={index}
        row={[
          event.name,
          event.status,
          formatDate(event.event_date),
          event.location,
          event.max_capacity,
          event.pre_registration_capacity,
          event.walk_in_capacity,
          event._id,
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ))
  );

  const totalPages = Math.ceil(totalCount / ROWS_PER_PAGE);

  if (isFullPageLoading) return <FullPageLoader />;

  return (
    <div className={styles.eventList}>
      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
        primaryAction={{
          content: 'Delete',
          destructive: true,
          onAction: handleDeleteConfirmed,
        }}
        secondaryActions={[{
          content: 'Cancel',
          onAction: () => setShowDeleteModal(false),
        }]}
      >
        <Modal.Section>
          <TextContainer>
            Are you sure you want to delete this event? This action cannot be undone.
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Page fullWidth>
        <Card padding="0">
          <TableHeader
            value={searchValue}
            onChange={handleSearchChange}
            onCancel={handleCancelSearch}
            onSort={handleSort}
          />

          <IndexTable
            resourceName={{ singular: 'event', plural: 'events' }}
            itemCount={eventList.length}
            headings={[
              { title: 'Event Name' },
              { title: 'Status' },
              { title: 'Date' },
              { title: 'Location' },
              { title: 'Total Seat Count' },
              { title: 'Pre-registered Cap' },
              { title: 'Walk-in Cap' },
              { title: 'Actions' },
            ]}
            selectable={false}
          >
            {rowMarkup}
          </IndexTable>

          <div className={styles.paginationContainer}>
            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => setCurrentPage((p) => p - 1)}
              hasNext={currentPage < totalPages}
              onNext={() => setCurrentPage((p) => p + 1)}
            />
          </div>
        </Card>
      </Page>
    </div>
  );
};

export default EventTable;

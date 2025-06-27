import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, IndexTable, Page, Pagination, Spinner, Modal, TextContainer } from '@shopify/polaris';
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

  const debouncedSearch = useDebounce(searchValue, 100);
  const isFirstLoad = useRef(true);

  const { eventList, totalCount, loading, fetchEventList, deleteEvent } = useEventStore();
  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    fetchEventList({
      page: currentPage,
      limit: ROWS_PER_PAGE,
      search: debouncedSearch,
      sortBy,
      order: sortOrder,
    });
  }, [currentPage, debouncedSearch, sortBy, sortOrder, fetchEventList]);

  useEffect(() => {
    fetchData();
    isFirstLoad.current = false;
  }, [fetchData]);

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
      fetchEventList({
        page: currentPage,
        limit: ROWS_PER_PAGE,
        search: debouncedSearch,
        sortBy,
        order: sortOrder,
      });
      toast.success('Event deleted successfully');
    });
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleCancelSearch = () => {
    setSearchValue('');
    setCurrentPage(1);
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setSortBy('name');
    setCurrentPage(1);
  };

  const paginatedRows = useMemo(() => {
    return eventList.map((event) => [
      event.name,
      event.status,
      formatDate(event.event_date),
      event.location,
      event.max_capacity,
      event.pre_registration_capacity,
      event.walk_in_capacity,
      event._id,
    ]);
  }, [eventList]);
  
  const rowMarkup = loading ? (
    <IndexTable.Row>
      <IndexTable.Cell colSpan={8}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', width: '100%' }}>
          <Spinner accessibilityLabel="Loading attendees" size="large" />
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ) : (
    paginatedRows.map((row, index) => (
      <TableRow
        key={index}
        index={index}
        row={row}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ))
  );
  
  
  

  const totalPages = Math.ceil(totalCount / ROWS_PER_PAGE);


  if (loading && isFirstLoad.current) return <FullPageLoader />;

  return (
    <div className={styles.eventList}>
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Event"
        primaryAction={{
          content: 'Delete',
          destructive: true,
          onAction: async () => {
            await handleDeleteConfirmed();
          },
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setShowDeleteModal(false),
          },
        ]}
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
            itemCount={paginatedRows.length}
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
              hasNext={currentPage < totalPages}
              onPrevious={() => setCurrentPage((p) => p - 1)}
              onNext={() => setCurrentPage((p) => p + 1)}
            />
          </div>
        </Card>
      </Page>
    </div>
  );
};

export default EventTable;

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Button,
  Card,
  Icon,
  IndexTable,
  Page,
  Pagination,
  Spinner,
  TextField,
  Modal,
  TextContainer,
} from '@shopify/polaris';
import { SortIcon } from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
import useWalkinStore from '../../../store/walkinStore';
import { formatDate } from '../../../utils/dateFormatter';
import useDebounce from '../../../hooks/useDebounce'; // assuming you have this hook
import toast from 'react-hot-toast';
import styles from './WalkinList.module.css';

const ROWS_PER_PAGE = 5;

const WalkinList = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const navigate = useNavigate();
  const isFirstLoad = useRef(true);
  const debouncedSearch = useDebounce(searchValue, 300);

  const {
    walkinList,
    totalCount,
    loading,
    fetchWalkinList,
    deleteWalkin,
  } = useWalkinStore();

  const fetchData = useCallback(() => {
    fetchWalkinList({
      page: currentPage,
      limit: ROWS_PER_PAGE,
      search: debouncedSearch,
      sortBy: 'event_name',
      order: sortOrder,
    });
  }, [currentPage, debouncedSearch, sortOrder, fetchWalkinList]);

  useEffect(() => {
    fetchData();
    isFirstLoad.current = false;
  }, [fetchData]);

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
    setCurrentPage(1);
  };
  const handleForm = (index) => {
    const eventId = walkinList[index].event_id;
    navigate(`/walkin/walkin-form/${eventId}`);
  };

  const handleDeleteConfirmed = async () => {
    if (deleteIndex === null) return;
    const walkinId = walkinList[deleteIndex]._id;
    setShowDeleteModal(false);
    try {
      await deleteWalkin(walkinId);
      toast.success('Walk-in deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete walk-in');
    }
  };

  const paginatedRows = useMemo(() => {
    return walkinList.map((walkin) => [
      walkin.event_name,
      formatDate(walkin.event_date),
      walkin.walk_in_capacity,
      walkin.remainingWalkInCapacity,
      `$${walkin.pricing_walk_in}`,
      walkin._id,
      walkin.event_id,
    ]);
  }, [walkinList]);

  const totalPages = Math.ceil(totalCount / ROWS_PER_PAGE);

  if (loading && isFirstLoad.current) {
    return (
      <div className={styles.loader}>
        <Spinner accessibilityLabel="Loading walk-ins" size="large" />
      </div>
    );
  }

  return (
    <div className={styles.eventList}>
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Walk-in"
        primaryAction={{
          content: 'Delete',
          destructive: true,
          onAction: handleDeleteConfirmed,
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
            Are you sure you want to delete this walk-in? This action cannot be undone.
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Page fullWidth>
        <Card padding="0">
          <div className={styles.headerContainer}>
            <div className={styles.searchContainer}>
              <TextField
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search walk-ins"
                clearButton
                onClearButtonClick={handleCancelSearch}
                labelHidden
              />
            </div>
            <div className={styles.actionsContainer}>
              <Button onClick={handleCancelSearch} variant="tertiary">
                Cancel
              </Button>
              <Button onClick={handleSort} icon={<Icon source={SortIcon} />}>
               
              </Button>
            </div>
          </div>

          <IndexTable
            resourceName={{ singular: 'walk-in', plural: 'walk-ins' }}
            itemCount={walkinList.length}
            headings={[
              { title: 'Event Name' },
              { title: 'Date' },
              { title: 'Walk-in Cap' },
              { title: 'Remaining' },
              { title: 'Price' },
              { title: 'Actions' },
            ]}
            selectable={false}
          >
            {loading ? (
              <IndexTable.Row>
                <IndexTable.Cell colSpan={6}>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Spinner accessibilityLabel="Loading walk-ins" size="large" />
                  </div>
                </IndexTable.Cell>
              </IndexTable.Row>
            ) : (
              walkinList.map((walkin, index) => (
                <IndexTable.Row id={walkin._id} key={walkin._id} position={index}>
                  <IndexTable.Cell>{walkin.event_name}</IndexTable.Cell>
                  <IndexTable.Cell>{formatDate(walkin.event_date)}</IndexTable.Cell>
                  <IndexTable.Cell>{walkin.walk_in_capacity}</IndexTable.Cell>
                  <IndexTable.Cell>{walkin.remainingWalkInCapacity}</IndexTable.Cell>
                  <IndexTable.Cell>${walkin.pricing_walk_in}</IndexTable.Cell>
                  <IndexTable.Cell>
                    <div className={styles.actions}>
                      <Button variant="plain" onClick={() => handleForm(index)}>
                        Form
                      </Button>
                      {/* Uncomment below if delete needed */}
                      {/* <Button variant="destructive" onClick={() => handleDelete(index)}>
                        Delete
                      </Button> */}
                    </div>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))
            )}
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

export default WalkinList;

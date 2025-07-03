import React, { useState, useEffect, useCallback } from 'react';
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
import useDebounce from '../../../hooks/useDebounce';
import toast from 'react-hot-toast';
import styles from './WalkinList.module.css';
import FullPageLoader from '../../../components/Loader';

const ROWS_PER_PAGE = 5;

const WalkinList = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isFullPageLoading, setIsFullPageLoading] = useState(true);
  const [hasMountedOnce, setHasMountedOnce] = useState(false);

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchValue, 300);

  const {
    walkinList,
    totalCount,
    fetchWalkinList,
    deleteWalkin,
  } = useWalkinStore();

  const fetchData = useCallback(
    async (type = 'full', resetPage = false) => {
      const page = resetPage ? 1 : currentPage;
      const setLoading = type === 'table' ? setIsTableLoading : setIsFullPageLoading;

      setLoading(true);
      await fetchWalkinList({
        page,
        limit: ROWS_PER_PAGE,
        search: debouncedSearch,
        sortBy: 'event_name',
        order: sortOrder,
      });
      setLoading(false);

      if (resetPage) setCurrentPage(1);
    },
    [currentPage, debouncedSearch, sortOrder, fetchWalkinList]
  );

  // ✅ First load = full page loader
  useEffect(() => {
    const initialLoad = async () => {
      await fetchData('full');
      setHasMountedOnce(true);
    };
    initialLoad();
  }, []);

  // ✅ Pagination change = table loader
  useEffect(() => {
    if (!hasMountedOnce) return;
    fetchData('table');
  }, [currentPage]);

  // ✅ Search or sort = table loader + reset page
  useEffect(() => {
    if (!hasMountedOnce) return;
    fetchData('table', true);
  }, [debouncedSearch, sortOrder]);

  const handleSearchChange = (value) => setSearchValue(value);

  const handleCancelSearch = () => {
    setSearchValue('');
    fetchData('table', true);
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    fetchData('table', true);
  };

  const handleForm = (index) => {
    const eventId = walkinList[index]._id;
    navigate(`/walkin/walkin-form/${eventId}`);
  };

  const handleDeleteConfirmed = async () => {
    if (deleteIndex === null) return;
    const walkinId = walkinList[deleteIndex]._id;
    setShowDeleteModal(false);
    try {
      await deleteWalkin(walkinId);
      toast.success('Walk-in deleted successfully');
      fetchData('full');
    } catch (error) {
      toast.error('Failed to delete walk-in');
    }
  };

  const rowMarkup = isTableLoading ? (
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
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    ))
  );

  const totalPages = Math.ceil((totalCount || 0) / ROWS_PER_PAGE);

  if (isFullPageLoading) return <FullPageLoader />;

  return (
    <div className={styles.eventList}>
      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Walk-in"
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
            Are you sure you want to delete this walk-in? This action cannot be undone.
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Page fullWidth>
        <Card padding="0">
          {/* Header Controls */}
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
              <Button onClick={handleCancelSearch} variant="tertiary">Cancel</Button>
              <Button onClick={handleSort} icon={<Icon source={SortIcon} />} />
            </div>
          </div>

          {/* Table */}
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
            {rowMarkup}
          </IndexTable>

          {/* Pagination */}
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

export default WalkinList;

import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  IndexTable,
  TextField,
  Button,
  ButtonGroup,
  Badge,
  Page,
  Icon,
  Pagination
} from '@shopify/polaris';
import { SortIcon } from '@shopify/polaris-icons';
import styles from './EventList.module.css';
import { useNavigate } from 'react-router-dom';


const initialRows = [
  ['Annual Conference', 'Upcoming', 'June 15, 2025', 'Grand Hall', 500, 100, 50],
  ['Product Launch', 'Past', 'August 15, 2025', 'Exhibit Hall', 500, 100, 50],
  ['Marketing Seminar', 'Draft', 'July 20, 2025', 'Grand Hall', 500, 100, 50],
  ['Robert Fox', 'Past', 'July 20, 2025', 'Individual', 500, 100, 50],
  ['Demo Event 1', 'Upcoming', 'August 1, 2025', 'Auditorium', 300, 50, 20],
  ['Demo Event 2', 'Draft', 'August 5, 2025', 'Main Hall', 450, 75, 25],
  ['Demo Event 3', 'Past', 'September 10, 2025', 'Grand Hall', 600, 110, 60],
];

const getBadgeStatus = (status) => {
  const key = status.toLowerCase();
  if (key === 'upcoming') return 'success';
  if (key === 'draft') return 'info';
  return 'attention';
};
const getBadgeTone = (status) => {
    const key = status.toLowerCase();
    if (key === 'upcoming') return 'attention';
    if (key === 'past') return 'info';
    return undefined; // for 'draft'
  };
const ROWS_PER_PAGE = 5;



function EventTable() {
  const [rows, setRows] = useState(initialRows);
  const [searchValue, setSearchValue] = useState('');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleEdit = (index) => {
    const globalIndex = (currentPage - 1) * ROWS_PER_PAGE + index;
    const event = rows[globalIndex];
    navigate(`/event/edit/${event[0]}`);
  };    
  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
    setCurrentPage(1);

    if (!value.trim()) {
      setRows(initialRows);
      return;
    }

    const lowerValue = value.toLowerCase();
    const filtered = initialRows.filter(row =>
      row.some(cell => cell.toString().toLowerCase().includes(lowerValue))
    );

    setRows(filtered);
  }, []);

  const handleCancelSearch = useCallback(() => {
    setSearchValue('');
    setRows(initialRows);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback(() => {
    const newDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
    setSortDirection(newDirection);

    const sorted = [...rows].sort((a, b) => {
      const valueA = a[0].toLowerCase();
      const valueB = b[0].toLowerCase();

      if (valueA < valueB) return newDirection === 'ascending' ? -1 : 1;
      if (valueA > valueB) return newDirection === 'ascending' ? 1 : -1;
      return 0;
    });

    setRows(sorted);
    setCurrentPage(1);
  }, [rows, sortDirection]);


  const handleDelete = (index) => {
    const globalIndex = (currentPage - 1) * ROWS_PER_PAGE + index;
    const updatedRows = rows.filter((_, i) => i !== globalIndex);
    setRows(updatedRows);
  };

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return rows.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [rows, currentPage]);

  const resourceName = {
    singular: 'event',
    plural: 'events',
  };

  const rowMarkup = paginatedRows.map((row, index) => (
    <IndexTable.Row
      id={`row-${index}`}
      key={index}
      position={index}
    >
      <IndexTable.Cell>
        <div style={{ padding: '8px' }}>
          {row[0]}
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge status={getBadgeStatus(row[1])} tone={getBadgeTone(row[1])} ><span style={{ fontWeight: 600 }}>{row[1]}</span></Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>{row[2]}</IndexTable.Cell>
      <IndexTable.Cell>{row[3]}</IndexTable.Cell>
      <IndexTable.Cell>{row[4]}</IndexTable.Cell>
      <IndexTable.Cell>{row[5]}</IndexTable.Cell>
      <IndexTable.Cell>{row[6]}</IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          <Button onClick={() => handleEdit(index)} variant="plain">Edit</Button>
          <Button onClick={() => handleDelete(index)} destructive variant="plain">Delete</Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE);

  return (
    <div className={styles.eventList}>
    <Page fullWidth>
      <Card padding="0">
        <div className={styles.headerContainer}>
          <div className={styles.searchContainer}>
            <TextField
              label="Search"
              labelHidden
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search"
              autoComplete="off"
            />
          </div>
          <div className={styles.actionsContainer}>
            <Button onClick={handleCancelSearch} variant="tertiary">
              Cancel
            </Button>
            <Button onClick={handleSort} icon={<Icon source={SortIcon} />} />
          </div>
        </div>

        <IndexTable
          resourceName={resourceName}
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
            onPrevious={() => setCurrentPage(prev => prev - 1)}
            onNext={() => setCurrentPage(prev => prev + 1)}
          />
        </div>
      </Card>
    </Page>
    </div>
  );
}

export default EventTable;

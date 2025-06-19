import React from 'react';
import { TextField, Button, Icon } from '@shopify/polaris';
import { SortIcon } from '@shopify/polaris-icons';
import styles from './Table.module.css';

const TableHeader = ({ value, onChange, onCancel, onSort }) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.searchContainer}>
        <TextField
          label="Search"
          labelHidden
          value={value}
          onChange={onChange}
          placeholder="Search"
          autoComplete="off"
        />
      </div>
      <div className={styles.actionsContainer}>
        <Button onClick={onCancel} variant="tertiary">
          Cancel
        </Button>
        <Button onClick={onSort} icon={<Icon source={SortIcon} />} />
      </div>
    </div>
  );
};

export default TableHeader;

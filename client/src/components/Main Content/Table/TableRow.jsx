import React from 'react';
import { IndexTable, Badge, ButtonGroup, Button } from '@shopify/polaris';
import { getBadgeStatus, getBadgeTone } from '../../../constants/eventConstants';
import styles from './Table.module.css';

const TableRow = ({ row, index, onEdit, onDelete }) => {
  return (
    <IndexTable.Row id={`row-${index}`} key={index} position={index} className={styles.row}>
      <IndexTable.Cell>
        <div style={{ padding: '8px' }}>{row[0]}</div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge status={getBadgeStatus(row[1])} tone={getBadgeTone(row[1])}>
          <span style={{ fontWeight: 600 }}>{row[1]}</span>
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>{row[2]}</IndexTable.Cell>
      <IndexTable.Cell>{row[3]}</IndexTable.Cell>
      <IndexTable.Cell>{row[4]}</IndexTable.Cell>
      <IndexTable.Cell>{row[5]}</IndexTable.Cell>
      <IndexTable.Cell>{row[6]}</IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          <Button onClick={() => onEdit(index)} variant="plain">
            Edit
          </Button>
          <Button onClick={() => onDelete(index)} destructive variant="plain">
            Delete
          </Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
};

export default TableRow;

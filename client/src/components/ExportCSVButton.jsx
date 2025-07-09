import React from 'react';
import axios from 'axios';
import { Button } from '@shopify/polaris';
import { exportToCSV } from '../utils/exportCsv';


const ExportCSVButton = () => {
    const handleExport = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/attendees/export', {
            responseType: 'blob', 
          });
      
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'attendees.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (err) {
          console.error('CSV Export failed:', err);
          alert('Failed to download CSV');
        }
      };
      

  return (
    <Button onClick={handleExport} variant="primary" tone="primary">
      Export as CSV
    </Button>
  );
};

export default ExportCSVButton;

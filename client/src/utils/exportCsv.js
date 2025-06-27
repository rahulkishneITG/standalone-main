export const exportToCSV = (data = [], filename = 'export.csv') => {
    if (!data.length) return;
  
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(fieldName => `"${String(row[fieldName] || '').replace(/"/g, '""')}"`).join(',')
      ),
    ];
  
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
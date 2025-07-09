export const exportToCSV = (data = [], filename = 'export.csv', fields = ['name', 'email']) => {
  if (!data.length) {
    alert('No data to export!');
    return;
  }

  const headers = fields;
  const csvRows = [
    headers.join(','), 
    ...data.map(row =>
      headers.map(field => {
        const cell = row[field] ?? '';
        return `"${String(cell).replace(/"/g, '""')}"`; 
      }).join(',')
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

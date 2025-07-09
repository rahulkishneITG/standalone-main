const { Parser } = require('json2csv');

const exportToCSV = (data, fields) => {
  const json2csvParser = new Parser({ fields });
  return json2csvParser.parse(data);
};

module.exports = exportToCSV;

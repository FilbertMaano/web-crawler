function printReport(pages) {
  console.log("Report Starting...");
  const sortedPages = sortDictByValue(pages);
  for (const [url, count] of Object.entries(sortedPages)) {
    console.log(`Found ${count} internal links to ${url}`);
  }
}

function sortDictByValue(dict) {
  return Object.keys(dict)
    .sort((a, b) => dict[b] - dict[a])
    .reduce((acc, key) => {
      acc[key] = dict[key];
      return acc;
    }, {});
}

module.exports = {
  printReport,
};

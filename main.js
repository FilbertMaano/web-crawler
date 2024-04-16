const { argv } = require("node:process");
const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");

async function main() {
  if (argv.length < 3) {
    throw new Error("No webite provided.");
  } else if (argv.length > 3) {
    throw new Error("Too many arguments provided.");
  }
  const baseURL = argv[2];
  console.log(`starting crawl of ${baseURL}...`);
  const pages = await crawlPage(baseURL, baseURL, {});
  printReport(pages);
}

main();

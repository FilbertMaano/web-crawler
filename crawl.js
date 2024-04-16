const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedURL = normalizeURL(currentURL);
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }
  pages[normalizedURL] = 1;

  try {
    console.log(`crawling of ${currentURL}...`);
    const response = await fetch(currentURL);
    if (response.status >= 400) {
      console.log(`Got HTTP error, status code: ${response.status}`);
      return pages;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log("Response is not a text/html data.");
      return pages;
    }
    const htmlBody = await response.text();
    const urls = getURLsFromHTML(htmlBody, baseURL);
    for (const url of urls) {
      pages = await crawlPage(baseURL, url, pages);
    }
    return pages;
  } catch (err) {
    console.log(err.message);
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const aElements = dom.window.document.querySelectorAll("a");
  for (const aElement of aElements) {
    if (aElement.href.slice(0, 1) === "/") {
      try {
        urls.push(new URL(aElement.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    } else {
      try {
        urls.push(new URL(aElement.href).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    }
  }
  return urls;
}

function normalizeURL(url) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.length > 0 && fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};

document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.type === "updateDetailedInfo") {
      const dataRows = document.getElementById("dataRows");
      dataRows.innerHTML = "";
      console.log(message);
      if (message.data != null && typeof message.data === "object") {
        for (const site in message.data) {
          if (Object.prototype.hasOwnProperty.call(message.data, site)) {
            const siteData = message.data[site];

            // Create a map to track link occurrences
            const linkOccurrences = new Map();

            // Iterate through the links for the site
            for (const link of siteData.links) {
              if (!linkOccurrences.has(link)) {
                linkOccurrences.set(link, 1);
              } else {
                linkOccurrences.set(link, linkOccurrences.get(link) + 1);
              }
            }

            let didCreateFirstSiteCell = false;
            for (const [key, value] of linkOccurrences) {
              // Create a row each link occurrence
              const row = document.createElement("tr");

              const siteCell = document.createElement("td");
              if (!didCreateFirstSiteCell) {
                siteCell.textContent = site; // The site URL
                didCreateFirstSiteCell = true;
              }
              row.appendChild(siteCell);

              const linkCell = document.createElement("td");
              linkCell.textContent = key;
              row.appendChild(linkCell);

              const occurrenceCell = document.createElement("td");
              occurrenceCell.textContent = value;
              row.appendChild(occurrenceCell);

              dataRows.appendChild(row);
            }
          }
        }
      } else {
        console.error(
          "No data found in the message.data or message.data is not an object."
        );
      }
    }
  });

  chrome.runtime.sendMessage({ type: "getDetails" });
});

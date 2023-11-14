let siteData = {};
let uniqueWebsites = new Set();
let currentWebsite = "";
loadInitialData();

// Load initial data from storage (if available)
function loadInitialData() {
  console.log("loadInitialData");
  chrome.storage.local.get("siteData", function (result) {
    // Handle the retrieved data here
    console.log(result.siteData);
    siteData = result.siteData || {};
  });
  updatePopupData();
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "logLink") {
    const newLink = message.url;
    if (newLink) {
      siteData[currentWebsite] = siteData[currentWebsite] || {
        links: [],
        count: 0,
      };
      siteData[currentWebsite].links.push(newLink);
      siteData[currentWebsite].count++;
      chrome.storage.local.set({ siteData: siteData });
    }
  } else if (message.type === "logWebsite") {
    currentWebsite = message.website;
    if (currentWebsite && !uniqueWebsites.has(currentWebsite)) {
      uniqueWebsites.add(currentWebsite);
      siteData[currentWebsite] = siteData[currentWebsite] || {
        links: [],
        count: 0,
      };
      chrome.storage.local.set({ siteData: siteData });
    }
  } else if (message.type === "getDetails") {
    chrome.runtime.sendMessage({
      type: "updateDetailedInfo",
      data: siteData,
    });
  } else if (message.type === "updatePopup") {
    updatePopupData();
  }
});

function updatePopupData() {
  console.log("updatePopupData");
  let totalSites = Object.keys(siteData).length;
  let totalLinks = 0;
  for (const website in siteData) {
    totalLinks += siteData[website].count;
  }

  chrome.runtime.sendMessage(
    {
      type: "updatePopupData",
      totalSites: totalSites,
      totalLinks: totalLinks,
    },
    function (response) {
      if (chrome.runtime.lastError) {
      } else {
      }
    }
  );
}

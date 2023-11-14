document.addEventListener("DOMContentLoaded", function () {
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.type === "updatePopupData") {
      const totalSites = message.totalSites;
      console.log("totalSites = " + totalSites);
      const totalLinks = message.totalLinks;
      console.log("totalSites = " + totalLinks);
      document.getElementById("totalSites").textContent = totalSites;
      document.getElementById("totalLinks").textContent = totalLinks;
    }
  });

  document
    .getElementById("showDetailsButton")
    .addEventListener("click", function () {
      // Open the detailed information page in a new tab
      chrome.tabs.create({ url: "detailed_info.html" });
    });

  chrome.runtime.sendMessage({ type: "updatePopup" });
});

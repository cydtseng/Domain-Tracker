let currentWebsite = "";
let uniqueHyperlinks = new Set();
let previouslyRetrievedHyperlinks = new Set();

recordCurrentPage();

function recordCurrentPage() {
  const currentUrl = window.location.href;
  if (currentWebsite === "" || currentUrl !== currentWebsite) {
    currentWebsite = currentUrl;
    try {
      chrome.runtime.sendMessage({
        type: "logWebsite",
        website: currentWebsite,
      });
      chrome.runtime.sendMessage({ type: "updatePopup" });
    } catch (error) {
      console.error(error);
    }
  }
  recordHyperlinks();
}

function recordHyperlinks() {
  const links = Array.from(document.querySelectorAll("a"));
  const newHyperlinks = links
    .map((link) => link.href)
    .filter((url) => !previouslyRetrievedHyperlinks.has(url));
  for (const url of newHyperlinks) {
    uniqueHyperlinks.add(url);
    chrome.runtime.sendMessage({ type: "logLink", url: url });
    chrome.runtime.sendMessage({ type: "updatePopup" });
  }
  previouslyRetrievedHyperlinks = new Set([
    ...previouslyRetrievedHyperlinks,
    ...newHyperlinks,
  ]);
}

const observer = new MutationObserver(function (mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      recordCurrentPage();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

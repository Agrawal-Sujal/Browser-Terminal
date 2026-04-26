// Initialize default mappings on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    const defaultData = {
      globalMappings: [
        { shortcut: "gh", targetUrl: "https://github.com" },
        { shortcut: "gm", targetUrl: "https://mail.google.com" },
        { shortcut: "yt", targetUrl: "https://youtube.com" }
      ],
      siteMappings: [
        {
          domain: "youtube.com",
          shortcuts: [
            { shortcut: "history", targetUrl: "https://www.youtube.com/feed/history" },
            { shortcut: "shorts", targetUrl: "https://www.youtube.com/shorts/" }
          ]
        }
      ]
    };
    await chrome.storage.sync.set(defaultData);
  }
});

// Handle opening new tabs from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "open_new_tab") {
    chrome.tabs.create({ url: request.url });
  }
});

// When icon is clicked, open options page
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

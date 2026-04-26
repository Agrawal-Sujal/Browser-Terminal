// Initialize protection and site notes
chrome.storage.sync.get(['globalMappings', 'siteMappings', 'protectedSites', 'siteNotes', 'timerWarnings'], (result) => {
  // Pass mappings to terminal scope
  if (typeof mappings !== 'undefined') {
    mappings.globalMappings = result.globalMappings || [];
    mappings.siteMappings = result.siteMappings || [];
  }
  
  // Setup other features
  setupProtection(result.protectedSites || []);
  checkSiteNotes(result.siteNotes || []);
  checkTimerWarnings(result.timerWarnings || []);
});

// Listen for updates
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.protectedSites) {
      setupProtection(changes.protectedSites.newValue || []);
    }
  }
});

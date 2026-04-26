// Render everything
function render() {
  renderGlobal();
  renderSites();
  renderProtected();
  renderNotes();
  renderTimers();
}

// Load settings
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get([
    'globalMappings', 
    'siteMappings', 
    'protectedSites', 
    'siteNotes', 
    'timerWarnings'
  ], (data) => {
    globalMappings = data.globalMappings || [];
    siteMappings = data.siteMappings || [];
    protectedSites = data.protectedSites || [];
    siteNotes = data.siteNotes || [];
    timerWarnings = data.timerWarnings || [];
    render();
  });
});

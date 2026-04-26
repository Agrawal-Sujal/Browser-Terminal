let globalMappings = [];
let siteMappings = [];
let protectedSites = [];
let siteNotes = [];
let timerWarnings = [];

const toast = document.getElementById('toast');

function saveSettings() {
  chrome.storage.sync.set({ 
    globalMappings, 
    siteMappings, 
    protectedSites, 
    siteNotes, 
    timerWarnings 
  }, () => {
    showToast();
  });
}

function showToast() {
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

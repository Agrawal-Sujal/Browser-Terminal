// options.js

let globalMappings = [];
let siteMappings = [];
let protectedSites = [];
let siteNotes = [];
let timerWarnings = [];

// DOM Elements
const globalContainer = document.getElementById('global-mappings-list');
const siteContainer = document.getElementById('site-mappings-list');
const protectedContainer = document.getElementById('protected-sites-list');
const notesContainer = document.getElementById('site-notes-list');
const timersContainer = document.getElementById('timer-warnings-list');
const toast = document.getElementById('toast');

// Load settings
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['globalMappings', 'siteMappings', 'protectedSites', 'siteNotes', 'timerWarnings'], (data) => {
    globalMappings = data.globalMappings || [];
    siteMappings = data.siteMappings || [];
    protectedSites = data.protectedSites || [];
    siteNotes = data.siteNotes || [];
    timerWarnings = data.timerWarnings || [];
    render();
  });
});

// Save to storage
function saveSettings() {
  chrome.storage.sync.set({ globalMappings, siteMappings, protectedSites, siteNotes, timerWarnings }, () => {
    showToast();
  });
}

function showToast() {
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Render everything
function render() {
  renderGlobal();
  renderSites();
  renderProtected();
  renderNotes();
  renderTimers();
}

// Global Mappings Render
function renderGlobal() {
  globalContainer.innerHTML = '';
  globalMappings.forEach((map, index) => {
    const row = document.createElement('div');
    row.className = 'mapping-row';
    
    const shortcutInput = document.createElement('input');
    shortcutInput.type = 'text';
    shortcutInput.placeholder = 'Shortcut';
    shortcutInput.value = map.shortcut;
    shortcutInput.addEventListener('input', (e) => updateGlobal(index, 'shortcut', e.target.value));

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'URL';
    urlInput.value = map.targetUrl;
    urlInput.addEventListener('input', (e) => updateGlobal(index, 'targetUrl', e.target.value));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => removeGlobal(index));

    row.appendChild(shortcutInput);
    row.appendChild(urlInput);
    row.appendChild(deleteBtn);
    
    globalContainer.appendChild(row);
  });
}

// Site Mappings Render
function renderSites() {
  siteContainer.innerHTML = '';
  siteMappings.forEach((site, sIndex) => {
    const block = document.createElement('div');
    block.className = 'site-block';
    
    // Header for domain
    const header = document.createElement('div');
    header.className = 'site-header';
    
    const domainInput = document.createElement('input');
    domainInput.type = 'text';
    domainInput.placeholder = 'Domain (e.g., youtube.com)';
    domainInput.value = site.domain;
    domainInput.addEventListener('input', (e) => updateSite(sIndex, e.target.value));

    const deleteSiteBtn = document.createElement('button');
    deleteSiteBtn.className = 'btn danger';
    deleteSiteBtn.textContent = 'Delete Site';
    deleteSiteBtn.addEventListener('click', () => removeSite(sIndex));

    header.appendChild(domainInput);
    header.appendChild(deleteSiteBtn);
    block.appendChild(header);
    
    // Shortcuts for this domain
    const list = document.createElement('div');
    list.className = 'mappings-list';
    
    site.shortcuts.forEach((map, mIndex) => {
      const row = document.createElement('div');
      row.className = 'mapping-row';
      
      const shortcutInput = document.createElement('input');
      shortcutInput.type = 'text';
      shortcutInput.placeholder = 'Shortcut';
      shortcutInput.value = map.shortcut;
      shortcutInput.addEventListener('input', (e) => updateSiteMapping(sIndex, mIndex, 'shortcut', e.target.value));

      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.placeholder = 'URL';
      urlInput.value = map.targetUrl;
      urlInput.addEventListener('input', (e) => updateSiteMapping(sIndex, mIndex, 'targetUrl', e.target.value));

      const deleteMappingBtn = document.createElement('button');
      deleteMappingBtn.className = 'btn danger';
      deleteMappingBtn.textContent = 'Delete';
      deleteMappingBtn.addEventListener('click', () => removeSiteMapping(sIndex, mIndex));

      row.appendChild(shortcutInput);
      row.appendChild(urlInput);
      row.appendChild(deleteMappingBtn);

      list.appendChild(row);
    });
    
    const addBtn = document.createElement('button');
    addBtn.className = 'btn secondary add-mapping-btn';
    addBtn.innerText = 'Add Shortcut';
    addBtn.addEventListener('click', () => addSiteMapping(sIndex));
    list.appendChild(addBtn);
    
    block.appendChild(list);
    siteContainer.appendChild(block);
  });
}

// Global actions
document.getElementById('add-global-btn').addEventListener('click', () => {
  globalMappings.push({ shortcut: '', targetUrl: '' });
  renderGlobal();
  saveSettings();
});

function updateGlobal(index, field, value) {
  globalMappings[index][field] = value;
  saveSettings();
}

function removeGlobal(index) {
  globalMappings.splice(index, 1);
  renderGlobal();
  saveSettings();
}

// Site actions
document.getElementById('add-site-btn').addEventListener('click', () => {
  siteMappings.push({ domain: '', shortcuts: [{ shortcut: '', targetUrl: '' }] });
  renderSites();
  saveSettings();
});

function updateSite(sIndex, value) {
  siteMappings[sIndex].domain = value;
  saveSettings();
}

function removeSite(sIndex) {
  siteMappings.splice(sIndex, 1);
  renderSites();
  saveSettings();
}

function addSiteMapping(sIndex) {
  siteMappings[sIndex].shortcuts.push({ shortcut: '', targetUrl: '' });
  renderSites();
  saveSettings();
}

function updateSiteMapping(sIndex, mIndex, field, value) {
  siteMappings[sIndex].shortcuts[mIndex][field] = value;
  saveSettings();
}

function removeSiteMapping(sIndex, mIndex) {
  siteMappings[sIndex].shortcuts.splice(mIndex, 1);
  renderSites();
  saveSettings();
}

// Protected Sites actions
function renderProtected() {
  protectedContainer.innerHTML = '';
  protectedSites.forEach((site, index) => {
    const row = document.createElement('div');
    row.className = 'mapping-row';
    
    const domainInput = document.createElement('input');
    domainInput.type = 'text';
    domainInput.placeholder = 'Domain (e.g., web.whatsapp.com)';
    domainInput.value = site;
    domainInput.addEventListener('input', (e) => updateProtected(index, e.target.value));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => removeProtected(index));

    row.appendChild(domainInput);
    row.appendChild(deleteBtn);
    
    protectedContainer.appendChild(row);
  });
}

document.getElementById('add-protected-btn').addEventListener('click', () => {
  protectedSites.push('');
  renderProtected();
  saveSettings();
});

function updateProtected(index, value) {
  protectedSites[index] = value;
  saveSettings();
}

function removeProtected(index) {
  protectedSites.splice(index, 1);
  renderProtected();
  saveSettings();
}

// Site Notes actions
function renderNotes() {
  notesContainer.innerHTML = '';
  siteNotes.forEach((note, index) => {
    const row = document.createElement('div');
    row.className = 'mapping-row';
    
    const domainInput = document.createElement('input');
    domainInput.type = 'text';
    domainInput.placeholder = 'Domain (e.g., netflix.com)';
    domainInput.value = note.domain || '';
    domainInput.addEventListener('input', (e) => updateNote(index, 'domain', e.target.value));

    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.placeholder = 'Note Text';
    noteInput.value = note.noteText || '';
    noteInput.addEventListener('input', (e) => updateNote(index, 'noteText', e.target.value));

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.placeholder = 'Button text';
    optionInput.value = note.optionName || '';
    optionInput.addEventListener('input', (e) => updateNote(index, 'optionName', e.target.value));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => removeNote(index));

    row.appendChild(domainInput);
    row.appendChild(noteInput);
    row.appendChild(optionInput);
    row.appendChild(deleteBtn);
    
    notesContainer.appendChild(row);
  });
}

document.getElementById('add-note-btn').addEventListener('click', () => {
  siteNotes.push({ domain: '', noteText: '', optionName: '' });
  renderNotes();
  saveSettings();
});

function updateNote(index, field, value) {
  siteNotes[index][field] = value;
  saveSettings();
}

function removeNote(index) {
  siteNotes.splice(index, 1);
  renderNotes();
  saveSettings();
}

// Timer Warnings actions
function renderTimers() {
  timersContainer.innerHTML = '';
  timerWarnings.forEach((timer, index) => {
    const row = document.createElement('div');
    row.className = 'mapping-row';
    
    const domainInput = document.createElement('input');
    domainInput.type = 'text';
    domainInput.placeholder = 'Domain (e.g., youtube.com)';
    domainInput.value = timer.domain || '';
    domainInput.addEventListener('input', (e) => updateTimer(index, 'domain', e.target.value));

    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.placeholder = 'Time in min (e.g., 5)';
    timeInput.value = timer.timeMin || '';
    timeInput.style.width = '120px';
    timeInput.addEventListener('input', (e) => updateTimer(index, 'timeMin', e.target.value));

    const warningInput = document.createElement('input');
    warningInput.type = 'text';
    warningInput.placeholder = 'Warning Text (e.g., Times up!)';
    warningInput.value = timer.warningText || '';
    warningInput.addEventListener('input', (e) => updateTimer(index, 'warningText', e.target.value));

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.placeholder = 'Button text';
    optionInput.value = timer.buttonText || '';
    optionInput.addEventListener('input', (e) => updateTimer(index, 'buttonText', e.target.value));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => removeTimer(index));

    row.appendChild(domainInput);
    row.appendChild(timeInput);
    row.appendChild(warningInput);
    row.appendChild(optionInput);
    row.appendChild(deleteBtn);
    
    timersContainer.appendChild(row);
  });
}

document.getElementById('add-timer-btn').addEventListener('click', () => {
  timerWarnings.push({ domain: '', timeMin: '', warningText: '', buttonText: '' });
  renderTimers();
  saveSettings();
});

function updateTimer(index, field, value) {
  timerWarnings[index][field] = value;
  saveSettings();
}

function removeTimer(index) {
  timerWarnings.splice(index, 1);
  renderTimers();
  saveSettings();
}


// content.js
let terminalOverlay = null;
let terminalInput = null;
let suggestionsList = null;

let mappings = { globalMappings: [], siteMappings: [] };
let filteredSuggestions = [];
let selectedIndex = -1;

function createUI() {
  terminalOverlay = document.createElement('div');
  terminalOverlay.id = 'browser-terminal-overlay';
  
  const container = document.createElement('div');
  container.id = 'browser-terminal-container';
  
  const inputWrapper = document.createElement('div');
  inputWrapper.id = 'browser-terminal-input-wrapper';
  
  // Search Icon Focus
  inputWrapper.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/>
    </svg>
  `;
  
  terminalInput = document.createElement('input');
  terminalInput.id = 'browser-terminal-input';
  terminalInput.type = 'text';
  terminalInput.placeholder = 'Type a command...';
  terminalInput.autocomplete = 'off';
  
  inputWrapper.appendChild(terminalInput);
  
  suggestionsList = document.createElement('ul');
  suggestionsList.id = 'browser-terminal-suggestions';
  
  container.appendChild(inputWrapper);
  container.appendChild(suggestionsList);
  terminalOverlay.appendChild(container);
  
  document.body.appendChild(terminalOverlay);
  
  // Close overlay when clicking outside
  terminalOverlay.addEventListener('click', (e) => {
    if (e.target === terminalOverlay) {
      closeTerminal();
    }
  });

  terminalInput.addEventListener('input', handleInput);
  terminalInput.addEventListener('keydown', handleInputKeydown);
}

function openTerminal() {
  // Update mappings to get latest from storage
  chrome.storage.sync.get(['globalMappings', 'siteMappings'], (result) => {
    mappings.globalMappings = result.globalMappings || [];
    mappings.siteMappings = result.siteMappings || [];
    
    terminalOverlay.classList.add('active');
    terminalInput.value = '';
    renderSuggestions('');
    setTimeout(() => terminalInput.focus(), 50); // slight delay to allow display
  });
}

function closeTerminal() {
  terminalOverlay.classList.remove('active');
  terminalInput.blur();
}

function isTerminalOpen() {
  return terminalOverlay && terminalOverlay.classList.contains('active');
}

function getSiteMappings() {
  const currentHostname = window.location.hostname;
  const match = mappings.siteMappings.find(site => {
    // Basic match, e.g., "youtube.com" matches "www.youtube.com"
    return currentHostname.includes(site.domain);
  });
  return match ? match.shortcuts : [];
}

function handleInput(e) {
  renderSuggestions(e.target.value.trim().toLowerCase());
}

function renderSuggestions(query) {
  suggestionsList.innerHTML = '';
  
  const siteShortcuts = getSiteMappings().map(s => ({...s, type: 'site'}));
  const globalShortcuts = mappings.globalMappings.map(s => ({...s, type: 'global'}));
  
  let allShortcuts = [...siteShortcuts, ...globalShortcuts];
  
  if (query) {
    allShortcuts = allShortcuts.filter(s => s.shortcut.toLowerCase().includes(query));
  }
  
  filteredSuggestions = allShortcuts;
  selectedIndex = filteredSuggestions.length > 0 ? 0 : -1;
  
  filteredSuggestions.forEach((suggestion, index) => {
    const li = document.createElement('li');
    li.className = 'browser-terminal-suggestion-item';
    if (index === selectedIndex) {
      li.classList.add('selected');
    }
    
    li.innerHTML = `
      <div class="browser-terminal-shortcut">
        <span class="browser-terminal-badge ${suggestion.type === 'site' ? 'site' : ''}">${suggestion.type}</span>
        ${suggestion.shortcut}
      </div>
      <div class="browser-terminal-url">${suggestion.targetUrl}</div>
    `;
    
    li.addEventListener('click', () => {
      navigateTo(suggestion.targetUrl, false);
    });
    
    li.addEventListener('mouseenter', () => {
      const items = suggestionsList.querySelectorAll('.browser-terminal-suggestion-item');
      items.forEach(item => item.classList.remove('selected'));
      li.classList.add('selected');
      selectedIndex = index;
    });
    
    suggestionsList.appendChild(li);
  });
}

function handleInputKeydown(e) {
  if (e.key === '/') {
    // If we type slash while it's open, close it (as per user request)
    e.preventDefault();
    closeTerminal();
    return;
  }
  
  if (e.key === 'Escape') {
    closeTerminal();
    return;
  }
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (selectedIndex < filteredSuggestions.length - 1) {
      selectedIndex++;
      updateSelectionUI();
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (selectedIndex > 0) {
      selectedIndex--;
      updateSelectionUI();
    }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
      navigateTo(filteredSuggestions[selectedIndex].targetUrl, e.ctrlKey || e.metaKey);
    }
  }
}

function updateSelectionUI() {
  const items = suggestionsList.querySelectorAll('.browser-terminal-suggestion-item');
  items.forEach((item, index) => {
    if (index === selectedIndex) {
      item.classList.add('selected');
      item.scrollIntoView({ block: 'nearest' });
    } else {
      item.classList.remove('selected');
    }
  });
}

function navigateTo(url, newTab) {
  closeTerminal();
  if (newTab) {
    chrome.runtime.sendMessage({ action: "open_new_tab", url: url });
  } else {
    window.location.href = url;
  }
}

document.addEventListener('keydown', (e) => {
  // Ignore if typing in an input
  const isInput = e.target.tagName === 'INPUT' || 
                  e.target.tagName === 'TEXTAREA' || 
                  e.target.isContentEditable;
                  
  // However, if the terminal is open, the input is OUR input, which handles its own keydown event for `/`.
  // If the terminal is open and focus is lost or whatever, we still catch it here.
  
  if (e.key === '/') {
    if (isTerminalOpen()) {
      // The terminal input's keydown usually stops this/handles it, but just in case
      e.preventDefault();
      closeTerminal();
    } else if (!isInput) {
      // Not typing in another input, open terminal
      e.preventDefault();
      if (!terminalOverlay) {
        createUI();
      }
      openTerminal();
    }
  }
});

let beforeUnloadListener = (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.returnValue = '';
  return '';
};

function setupProtection(protectedSites) {
  const currentDomain = window.location.hostname;
  const isProtected = protectedSites.some(site => {
    const cleanSite = site.trim();
    return cleanSite.length > 0 && currentDomain.includes(cleanSite);
  });

  console.log('[BrowserTerminal] Checking protection for:', currentDomain, ' against list:', protectedSites);
  console.log('[BrowserTerminal] Is site protected?', isProtected);

  if (isProtected) {
    console.log('[BrowserTerminal] Adding beforeunload listener');
    window.addEventListener('beforeunload', beforeUnloadListener);
  } else {
    window.removeEventListener('beforeunload', beforeUnloadListener);
  }
}

// Initialize protection
chrome.storage.sync.get(['protectedSites'], (result) => {
  setupProtection(result.protectedSites || []);
});

// Listen for updates
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.protectedSites) {
    setupProtection(changes.protectedSites.newValue || []);
  }
});


const siteContainer = document.getElementById('site-mappings-list');

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

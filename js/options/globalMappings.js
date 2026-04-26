const globalContainer = document.getElementById('global-mappings-list');

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

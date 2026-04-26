const protectedContainer = document.getElementById('protected-sites-list');

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

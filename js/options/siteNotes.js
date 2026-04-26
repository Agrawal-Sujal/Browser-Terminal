const notesContainer = document.getElementById('site-notes-list');

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

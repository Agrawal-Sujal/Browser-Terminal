function showSiteNote(note) {
  if (document.getElementById('browser-terminal-site-note-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'browser-terminal-site-note-overlay';
  
  const box = document.createElement('div');
  box.id = 'browser-terminal-site-note-box';
  
  const textEl = document.createElement('div');
  textEl.className = 'browser-terminal-site-note-text';
  textEl.textContent = note.noteText || 'Custom Note';

  const btnEl = document.createElement('button');
  btnEl.className = 'browser-terminal-site-note-btn';
  btnEl.textContent = note.optionName || 'Dismiss';

  btnEl.addEventListener('click', () => {
    overlay.remove();
  });

  box.appendChild(textEl);
  box.appendChild(btnEl);
  overlay.appendChild(box);
  
  document.body.appendChild(overlay);
}

function checkSiteNotes(siteNotes) {
  if (!siteNotes || siteNotes.length === 0) return;
  const currentDomain = window.location.hostname;
  for (const note of siteNotes) {
    const cleanDomain = (note.domain || '').trim();
    if (cleanDomain.length > 0 && currentDomain.includes(cleanDomain)) {
      showSiteNote(note);
      break; 
    }
  }
}

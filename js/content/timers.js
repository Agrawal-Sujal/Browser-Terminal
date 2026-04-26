function showTimerWarning(timer) {
  if (document.getElementById('browser-terminal-timer-warning-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'browser-terminal-timer-warning-overlay';
  // Reusing the site-note styling classes for UI consistency
  overlay.className = 'browser-terminal-site-note-overlay-class';
  
  const box = document.createElement('div');
  box.className = 'browser-terminal-site-note-box-class';
  
  const textEl = document.createElement('div');
  textEl.className = 'browser-terminal-site-note-text';
  textEl.textContent = timer.warningText || 'Time is up!';

  const btnEl = document.createElement('button');
  btnEl.className = 'browser-terminal-site-note-btn';
  btnEl.textContent = timer.buttonText || 'OK';

  btnEl.addEventListener('click', () => {
    overlay.remove();
  });

  box.appendChild(textEl);
  box.appendChild(btnEl);
  overlay.appendChild(box);
  
  document.body.appendChild(overlay);
}

let activeTimers = [];

function checkTimerWarnings(timerWarnings) {
  if (!timerWarnings || timerWarnings.length === 0) return;
  const currentDomain = window.location.hostname;
  
  for (const timer of timerWarnings) {
    const cleanDomain = (timer.domain || '').trim();
    if (cleanDomain.length > 0 && currentDomain.includes(cleanDomain)) {
      const timeMs = parseFloat(timer.timeMin) * 60 * 1000;
      if (!isNaN(timeMs) && timeMs > 0) {
        const timeoutId = setTimeout(() => {
          showTimerWarning(timer);
        }, timeMs);
        activeTimers.push(timeoutId);
      }
    }
  }
}

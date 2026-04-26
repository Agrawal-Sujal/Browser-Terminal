const timersContainer = document.getElementById('timer-warnings-list');

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

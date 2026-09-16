const dateInput = document.getElementById('targetDate');
const startButton = document.getElementById('startCountdown');
const statusText = document.getElementById('status');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function formatForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTimeLeft(targetDateValue) {
  const now = new Date();
  const target = new Date(`${targetDateValue}T00:00:00`);

  let diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { total: diff, days, hours, minutes, seconds };
}

function updateCountdown() {
  const value = dateInput.value;

  if (!value) {
    return;
  }

  const timeLeft = getTimeLeft(value);

  if (timeLeft.total === 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    statusText.textContent = 'Der Countdown ist abgelaufen.';
    return;
  }

  daysEl.textContent = String(timeLeft.days).padStart(2, '0');
  hoursEl.textContent = String(timeLeft.hours).padStart(2, '0');
  minutesEl.textContent = String(timeLeft.minutes).padStart(2, '0');
  secondsEl.textContent = String(timeLeft.seconds).padStart(2, '0');
  statusText.textContent = `Noch bis zum ${value}`;
}

const defaultTarget = addDays(new Date(), 14);
dateInput.value = formatForInput(defaultTarget);
updateCountdown();
startButton.addEventListener('click', updateCountdown);
setInterval(updateCountdown, 1000);

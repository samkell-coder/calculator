// State
let selectedTimezones = JSON.parse(localStorage.getItem('selectedTimezones')) || [];
let is24HourFormat = localStorage.getItem('is24HourFormat') !== 'false';

// DOM elements
const localTimeDisplay = document.getElementById('localTime');
const localDateDisplay = document.getElementById('localDate');
const localTimeZoneName = document.getElementById('localTimeZone');
const timezoneSelect = document.getElementById('timezoneSelect');
const addBtn = document.getElementById('addBtn');
const timezonesGrid = document.getElementById('timezonesGrid');
const clearAllBtn = document.getElementById('clearAllBtn');
const toggleFormat = document.getElementById('toggleFormat');

// Event listeners
addBtn.addEventListener('click', addTimezone);
timezoneSelect.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTimezone();
    }
});
clearAllBtn.addEventListener('click', clearAllTimezones);
toggleFormat.addEventListener('change', toggleTimeFormat);

// Get local timezone
function getLocalTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Format time
function formatTime(date, is24Hour) {
    if (is24Hour) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    } else {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }
}

// Format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get time in timezone
function getTimeInTimezone(timezone) {
    const now = new Date();
    const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const offset = tzTime - utcTime;
    return new Date(now.getTime() + offset);
}

// Get timezone display name
function getTimezoneDisplayName(timezone) {
    const nameMap = {
        'UTC': 'UTC',
        'America/New_York': 'New York (EST/EDT)',
        'America/Chicago': 'Chicago (CST/CDT)',
        'America/Denver': 'Denver (MST/MDT)',
        'America/Los_Angeles': 'Los Angeles (PST/PDT)',
        'America/Anchorage': 'Anchorage (AKST/AKDT)',
        'Pacific/Honolulu': 'Honolulu (HST)',
        'Europe/London': 'London (GMT/BST)',
        'Europe/Paris': 'Paris (CET/CEST)',
        'Europe/Moscow': 'Moscow (MSK)',
        'Asia/Dubai': 'Dubai (GST)',
        'Asia/Kolkata': 'India (IST)',
        'Asia/Bangkok': 'Bangkok (ICT)',
        'Asia/Shanghai': 'Shanghai (CST)',
        'Asia/Tokyo': 'Tokyo (JST)',
        'Asia/Seoul': 'Seoul (KST)',
        'Australia/Sydney': 'Sydney (AEDT/AEST)',
        'Pacific/Auckland': 'Auckland (NZDT/NZST)'
    };
    return nameMap[timezone] || timezone;
}

// Update local time
function updateLocalTime() {
    const now = new Date();
    const localTimezone = getLocalTimezone();
    const localTime = getTimeInTimezone(localTimezone);
    
    localTimeDisplay.textContent = formatTime(localTime, is24HourFormat);
    localDateDisplay.textContent = formatDate(localTime);
    localTimeZoneName.textContent = getTimezoneDisplayName(localTimezone);
}

// Add timezone
function addTimezone() {
    const timezone = timezoneSelect.value;
    
    if (!timezone) {
        alert('Please select a timezone');
        return;
    }

    if (selectedTimezones.includes(timezone)) {
        alert('This timezone is already added');
        return;
    }

    selectedTimezones.push(timezone);
    localStorage.setItem('selectedTimezones', JSON.stringify(selectedTimezones));
    timezoneSelect.value = '';
    renderTimezones();
}

// Remove timezone
function removeTimezone(timezone) {
    selectedTimezones = selectedTimezones.filter(tz => tz !== timezone);
    localStorage.setItem('selectedTimezones', JSON.stringify(selectedTimezones));
    renderTimezones();
}

// Clear all timezones
function clearAllTimezones() {
    if (selectedTimezones.length === 0) {
        alert('No timezones to clear');
        return;
    }

    if (confirm('Are you sure you want to remove all timezones?')) {
        selectedTimezones = [];
        localStorage.setItem('selectedTimezones', JSON.stringify(selectedTimezones));
        renderTimezones();
    }
}

// Toggle time format
function toggleTimeFormat() {
    is24HourFormat = toggleFormat.checked;
    localStorage.setItem('is24HourFormat', is24HourFormat);
    updateLocalTime();
    renderTimezones();
}

// Render timezones
function renderTimezones() {
    timezonesGrid.innerHTML = '';

    if (selectedTimezones.length === 0) {
        timezonesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🌍</div>
                <p class="empty-state-text">Add a timezone to see the current time around the world!</p>
            </div>
        `;
        return;
    }

    selectedTimezones.forEach(timezone => {
        const tzTime = getTimeInTimezone(timezone);
        const card = document.createElement('div');
        card.className = 'timezone-card';
        card.innerHTML = `
            <div class="timezone-name">${getTimezoneDisplayName(timezone)}</div>
            <div class="timezone-time">${formatTime(tzTime, is24HourFormat)}</div>
            <div class="timezone-date">${formatDate(tzTime)}</div>
            <button class="btn-remove" onclick="removeTimezone('${timezone}')">Remove</button>
        `;
        timezonesGrid.appendChild(card);
    });
}

// Update all displays
function updateAll() {
    updateLocalTime();
    renderTimezones();
}

// Initialize and set up interval
window.addEventListener('DOMContentLoaded', () => {
    toggleFormat.checked = is24HourFormat;
    updateAll();
    setInterval(updateAll, 1000);
});
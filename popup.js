document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-button');
  const activityInput = document.getElementById('activity-input');

  saveButton.addEventListener('click', () => {
    const activity = activityInput.value;
    if (activity) {
      const timestamp = new Date().toISOString();
      // Save the activity in local storage
      // TODO: rethink the key and datastructure.
      chrome.storage.local.get({ activities: [] }, (result) => {
        const activities = result.activities;
        activities.push({timestamp, activity});
        chrome.storage.local.set({ activities: activities }, () => {
          console.log('Activities:', activities);
          activityInput.value = ''; // Clear the input field

          // Close the popup
          chrome.windows.getCurrent((window) => {
            chrome.windows.remove(window.id);
          });
        });
      });
    }
  });
});

// For default_popup.html, TODO: move to its own file.
document.addEventListener('DOMContentLoaded', () => {
  const digestButton = document.getElementById('digest-button');
  const digestResults = document.getElementById('digest-results');
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');

  function initDateInputsToToday() {
    document.getElementById('start-date').valueAsDate = new Date();
    document.getElementById('end-date').valueAsDate = new Date();
  }

  function showEntriesForToday() {
      const today = new Date();
      showEntriesForDateRange(today, today);
  }

  function getEntriesClickHandler() {
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
      if (!startDate || !endDate) {
          alert('Please select both start and end dates.');
          return;
      }
      showEntriesForDateRange(startDate, endDate);
  }

  function showEntriesForDateRange(startDate, endDate) {
    chrome.storage.local.get({ activities: [] }, (result) => {
      const activities = result.activities;
      const rangedActivities = filterActivitiesByDateRange(activities, startDate, endDate);
      showEntriesInContainer(rangedActivities, digestResults);
    });
  }

  function showEntriesInContainer(activities, container) {
      container.innerHTML = activities.map(({ timestamp, activity }) => {
          return `<div>${new Date(timestamp).toLocaleTimeString()}: ${activity}</div>`;
      }).join('');
  }

  function filterActivitiesByDateRange(activities, startDate, endDate) {
      return activities.filter(({ timestamp }) => {
          const activityDate = new Date(timestamp);
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0); // set start of day
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // set end of day
          return activityDate >= start && activityDate <= end;
      });
  }

  // Add event listener to digest button
  digestButton.addEventListener('click', getEntriesClickHandler);

  // Initialize entries display
  initDateInputsToToday();
  showEntriesForToday();
});


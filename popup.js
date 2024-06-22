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
  const logsContainer = document.getElementById('logs-container');
  const digestButton = document.getElementById('digest-button');

  // Function to fetch and display the latest entries
  function updateLogs() {
    chrome.storage.local.get({ activities: [] }, (result) => {
      const activities = result.activities;
      const latestActivities = activities.slice(-5); // Get the last 5 entries
      displayLogs(latestActivities);
    });
  }

  // Function to display logs
  function displayLogs(activities) {
    logsContainer.innerHTML = activities.map(({ timestamp, activity }) => {
      return `<div>${new Date(timestamp).toLocaleString()}: ${activity}</div>`;
    }).join('');
  }

  // Function to get weekly digest
  function getWeeklyDigest() {
    chrome.storage.local.get({ activities: [] }, (result) => {
      const activities = result.activities;
      const filteredActivities = filterActivitiesByWeek(activities);
      console.log('Weekly Digest:', filteredActivities);
    });
  }

  // Function to filter activities by week
  function filterActivitiesByWeek(activities) {
    const now = new Date();
    const firstDayOfWeek = now.getDate() - now.getDay();
    const startDate = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
    return activities.filter(({ timestamp }) => new Date(timestamp) >= startDate);
  }

  // Add event listener to digest button
  digestButton.addEventListener('click', getWeeklyDigest);

  // Initialize logs display
  updateLogs();
});

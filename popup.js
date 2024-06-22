document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-button');
  const activityInput = document.getElementById('activity-input');

  saveButton.addEventListener('click', () => {
    const activity = activityInput.value;
    if (activity) {
      // Save the activity in local storage
      chrome.storage.local.get({ activities: [] }, (result) => {
        const activities = result.activities;
        activities.push(activity);
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

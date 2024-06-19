// scripts/prompt.js
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'prompt') {
    // Create a popup to ask the user what they've been doing
    chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 300,
      height: 150
    });
  }
});

let popupWindowId = null;

setInterval(() => {
  if (!popupWindowId) {
    chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 300,
      height: 150,
      left: left,
      top: top,
    }, (window) => {
      popupWindowId = window.id;
    });
  }
}, 10000);

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    popupWindowId = null;
  }
});
let popupWindowId = null;

async function getScreenSizeAndCreatePopup() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    createPopup(tab.width, tab.height);
  }
}

function createPopup(screenWidth, screenHeight) {
  const popupWidth = 400;
  const popupHeight = 150;
  const left = Math.round((screenWidth - popupWidth) / 2);
  const top = Math.round((screenHeight - popupHeight) / 2);

  if (!popupWindowId) {
    chrome.windows.create(
      {
        url: 'popup.html',
        type: 'popup',
        width: popupWidth,
        height: popupHeight,
        left: left,
        top: top,
      },
      (window) => {
        popupWindowId = window.id;
      }
    );
  }
}

setInterval(() => getScreenSizeAndCreatePopup(), 5000);

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    popupWindowId = null;
  }
});


chrome.runtime.onInstalled.addListener(() => {
  console.log('KillShort installed');
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'getStatus') {
    chrome.storage.sync.get({enabled: true}, (res) => {
      sendResponse({enabled: res.enabled});
    });
    return true;
  } else if (message && message.type === 'setStatus') {
    chrome.storage.sync.set({enabled: message.enabled});
    sendResponse({ok: true});
    return true;
  }
});

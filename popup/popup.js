document.addEventListener('DOMContentLoaded', () => {
  const switchEl = document.getElementById('switch');
  const toggleWrap = document.getElementById('toggleWrap');
  const applyBtn = document.getElementById('applyBtn');
  const statusLabel = document.getElementById('statusLabel');

  if (!switchEl || !toggleWrap) return;

  const setVisual=(on)=> {
    if (on) {
      switchEl.classList.add('on');
      switchEl.setAttribute('aria-checked', 'true');
      toggleWrap.setAttribute('aria-pressed', 'true');
      statusLabel.textContent = 'ON';
    } else {
      switchEl.classList.remove('on');
      switchEl.setAttribute('aria-checked', 'false');
      toggleWrap.setAttribute('aria-pressed', 'false');
      statusLabel.textContent = 'OFF';
    }
  }


  chrome.storage.sync.get({ enabled: true }, (res) => {
    setVisual(!!res.enabled);
  });

  let toggling = false;
  const toggleState=()=> {
    if (toggling) return;
    toggling = true;

    chrome.storage.sync.get({ enabled: true }, (res) => {
      const next = !res.enabled;
      chrome.storage.sync.set({ enabled: next }, () => {
        setVisual(next);
        
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((t) => {
            if (t.id) {
              chrome.tabs.sendMessage(t.id, { type: 'applyKillShort' }, () => {});
            }
          });
        });
      });
    });

    setTimeout(() => (toggling = false), 250);
  }

  toggleWrap.addEventListener('click', toggleState);
  toggleWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleState();
    }
  });

  applyBtn.addEventListener('click', () => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((t) => {
        if (t.id) {
          chrome.tabs.sendMessage(t.id, { type: 'applyKillShort' }, () => {});
          if (t.url && (t.url.includes('youtube.com') || t.url.includes('instagram.com'))) {
            chrome.tabs.reload(t.id);
          }
        }
      });
    });
    window.close();
  });
});

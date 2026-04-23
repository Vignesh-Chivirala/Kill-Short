(() => {
  'use strict';

  const getEnabledState = () => 
    new Promise(resolve => {
      chrome.storage.sync.get({ enabled: true }, res => resolve(!!res.enabled));
    });

  const hideReelsUI = (root = document) => {
    try {
      
      const reelsTabs = root.querySelectorAll(
        'a[href*="/reel/"], a[href*="/reels/"], a[aria-label*="Reels"], a[title*="Reels"]'
      );
      reelsTabs.forEach(el => {
        const p = el.closest('nav, div, section');
        if (p) p.remove();
        else el.remove();
      });

      
      const reelSections = root.querySelectorAll('section, div');
      reelSections.forEach(s => {
        try {
          const txt = (s.innerText || '').toLowerCase();
          if (txt.includes('reels') || (txt.includes('recommended') && txt.includes('reels'))) {
            s.remove();
          }
        } catch (e) {}
      });

      
      const anchors = root.querySelectorAll('a[href*="/reel/"], a[href*="/reels/"]');
      anchors.forEach(a => {
        const card = a.closest('article, div');
        if (card) card.remove();
        else a.remove();
      });

      
      if (!document.getElementById('killshort-instagram-style')) {
        const style = document.createElement('style');
        style.id = 'killshort-instagram-style';
        style.textContent = `
          a[href*="/reel/"],
          a[href*="/reels/"],
          section[aria-label*="Reels"],
          div[role="dialog"] a[href*="/reel/"] {
            display: none !important;
          }
        `;
        document.documentElement.appendChild(style);
      }
    } catch (e) {
      console.warn('KillShort IG hideReelsUI', e);
    }
  };

  const filterRecommendations = (root = document) => {
    try {
      const cards = root.querySelectorAll('article, div');
      cards.forEach(c => {
        try {
          const txt = (c.innerText || '').toLowerCase();
          if (txt.includes('reels') || txt.includes('reel')) {
            const maybe = c.closest('article, div, section');
            if (maybe) maybe.remove();
          }
        } catch (e) {}
      });
    } catch (e) {}
  };

  const observe = () => {
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1) {
              hideReelsUI(n);
              filterRecommendations(n);
            }
          });
        }
      });
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  };

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.type === 'applyKillShort') {
      hideReelsUI(document);
      filterRecommendations(document);
      sendResponse({ ok: true });
    }
  });

  getEnabledState().then(enabled => {
    if (!enabled) return;
    hideReelsUI(document);
    filterRecommendations(document);
    observe();
  });
})();

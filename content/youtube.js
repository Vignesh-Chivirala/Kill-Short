(() => {
  'use strict';

  const getEnabledState = () => new Promise(resolve => {
    chrome.storage.sync.get({ enabled: true }, res => resolve(!!res.enabled));
  });

  const hideShortsUI = (root = document) => {
    try {
      
      const leftShorts = root.querySelectorAll(
        'a[title*="Shorts"], a[href*="/shorts/"], tp-yt-paper-item[aria-label*="Shorts"], ytd-mini-guide-entry-renderer a[href*="/shorts/"]'
      );
      leftShorts.forEach(el =>
        el.closest('ytd-mini-guide-entry-renderer, a, tp-yt-paper-item, tp-yt-paper-listbox')?.remove()
      );

      
      const topShorts = root.querySelectorAll(
        'a[title="Shorts"], a[aria-label*="Shorts"], ytd-topbar-logo-renderer a[href*="/shorts/"]'
      );
      topShorts.forEach(el => el.remove());

      
      const shelves = root.querySelectorAll(
        'ytd-reel-shelf-renderer, ytm-reel-player-renderer, ytd-short-reel-video-renderer, ytd-rich-shelf-renderer'
      );
      shelves.forEach(s => s.remove());

      
      const anchors = root.querySelectorAll('a[href*="/shorts/"]');
      anchors.forEach(a => {
        const card = a.closest(
          'ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media'
        );
        if (card) card.remove();
        else a.remove();
      });

      
      const shortsBadges = root.querySelectorAll(
        'ytd-thumbnail-overlay-time-status-renderer, ytd-thumbnail-overlay-now-playing-renderer'
      );
      shortsBadges.forEach(b => {
        const txt = b.innerText || b.textContent || '';
        if (txt.toLowerCase().includes('shorts') || txt.toLowerCase().includes('short')) {
          const card = b.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer');
          if (card) card.remove();
          else b.remove();
        }
      });

      
      if (!document.getElementById('killshort-youtube-style')) {
        const style = document.createElement('style');
        style.id = 'killshort-youtube-style';
        style.textContent = `
          a[href*="/shorts/"], ytd-reel-shelf-renderer, ytm-reel-player-renderer, ytd-short-reel-video-renderer { display: none !important; }
          tp-yt-paper-item[aria-label*="Shorts"], ytd-mini-guide-entry-renderer { display: none !important; }
        `;
        document.documentElement.appendChild(style);
      }
    } catch (e) {
      console.warn('KillShort YT hideShortsUI', e);
    }
  };

  const filterRecommendations = (root = document) => {
    try {
      const candidates = root.querySelectorAll(
        'ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer'
      );
      candidates.forEach(card => {
        try {
          const a = card.querySelector('a');
          const href = a ? a.href : '';
          const durationEl = card.querySelector(
            '#metadata-line, ytd-thumbnail-overlay-time-status-renderer, span.ytd-thumbnail-overlay-time-status-renderer'
          );
          const badgeText = (card.innerText || '').toLowerCase();

          if (
            href.includes('/shorts/') ||
            badgeText.includes('shorts') ||
            (!durationEl && href.includes('watch?v=') && href.includes('&feature=shorts'))
          ) {
            card.remove();
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
              hideShortsUI(n);
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
      hideShortsUI(document);
      filterRecommendations(document);
      sendResponse({ ok: true });
    }
  });

  getEnabledState().then(enabled => {
    if (!enabled) return;
    hideShortsUI(document);
    filterRecommendations(document);
    observe();
  });
})();

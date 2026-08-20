// ==UserScript==
// @name         YouTube — No Shorts
// @namespace    com.rogerchen.ytnoshorts
// @version      1.0
// @description  Removes Shorts from YouTube on the web: hides the Shorts tab, shelves, and every Shorts item, and opens any Short in the normal video player.
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// All-in-one replacement for the native NoShortsEver tweak. Works in the
// Userscripts extension (Safari) and Violentmonkey (Orion).
(function () {
  'use strict';

  // Rules keyed on href^="/shorts/" are the durable ones — YouTube renames its
  // custom elements often, but the URL shape has been stable for years.
  const CSS = `
    /* Shorts entry in the left nav (desktop) */
    ytd-guide-entry-renderer:has(a[title="Shorts"]),
    ytd-mini-guide-entry-renderer:has(a[title="Shorts"]),
    ytd-guide-entry-renderer:has(a[href="/shorts"]),

    /* Shorts button in the bottom bar (mobile) */
    ytm-pivot-bar-item-renderer:has(.pivot-shorts),
    ytm-pivot-bar-item-renderer:has(a[href^="/shorts"]),

    /* Shorts shelves everywhere */
    ytd-reel-shelf-renderer,
    ytd-rich-shelf-renderer[is-shorts],
    ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
    ytd-item-section-renderer:has(ytd-reel-shelf-renderer),
    ytm-reel-shelf-renderer,
    ytm-rich-section-renderer:has(ytm-reel-shelf-renderer),
    ytm-item-section-renderer:has(ytm-reel-shelf-renderer),

    /* Individual Shorts in feeds, search, and channel grids */
    ytd-video-renderer:has(a[href^="/shorts/"]),
    ytd-grid-video-renderer:has(a[href^="/shorts/"]),
    ytd-rich-item-renderer:has(a[href^="/shorts/"]),
    ytd-compact-video-renderer:has(a[href^="/shorts/"]),
    ytm-video-with-context-renderer:has(a[href^="/shorts/"]),
    ytm-compact-video-renderer:has(a[href^="/shorts/"]),
    ytm-rich-item-renderer:has(a[href^="/shorts/"]),
    ytm-shorts-lockup-view-model,
    ytm-shorts-lockup-view-model-v2,
    ytGridShelfViewModelHost:has(a[href^="/shorts/"]) {
      display: none !important;
    }
  `;

  function injectCSS() {
    if (document.getElementById('yt-no-shorts-style')) return;
    const style = document.createElement('style');
    style.id = 'yt-no-shorts-style';
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }
  injectCSS();
  document.addEventListener('DOMContentLoaded', injectCSS);

  // A Short and a normal video share the same id, so /shorts/<id> and
  // /watch?v=<id> are the same content in the standard player.
  function redirect() {
    const m = location.pathname.match(/^\/shorts\/([A-Za-z0-9_-]+)/);
    if (!m) return false;
    location.replace('/watch?v=' + m[1]);
    return true;
  }
  if (redirect()) return;

  // YouTube is a single-page app, so most Shorts opens are history pushes.
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function () {
      const result = original.apply(this, arguments);
      redirect();
      return result;
    };
  }
  window.addEventListener('popstate', redirect);

  // Intercept clicks before YouTube's router sees them, so the swipe feed
  // never mounts in the first place.
  document.addEventListener('click', function (e) {
    const link = e.target.closest && e.target.closest('a[href*="/shorts/"]');
    if (!link) return;
    const m = link.getAttribute('href').match(/\/shorts\/([A-Za-z0-9_-]+)/);
    if (!m) return;
    e.preventDefault();
    e.stopPropagation();
    location.assign('/watch?v=' + m[1]);
  }, true);

  // Catches anything the CSS misses — chiefly nav entries that are identified
  // only by their visible text, which no selector can target.
  function sweep() {
    const labels = document.querySelectorAll(
      'ytd-guide-entry-renderer, ytm-pivot-bar-item-renderer, yt-tab-shape, tp-yt-paper-tab, ytm-tab-renderer, ytd-tab-renderer'
    );
    for (const el of labels) {
      if (el.dataset.ynsChecked) continue;
      el.dataset.ynsChecked = '1';
      if (el.textContent.trim().toLowerCase() === 'shorts') el.style.display = 'none';
    }
  }
  const observer = new MutationObserver(sweep);
  document.addEventListener('DOMContentLoaded', function () {
    sweep();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();

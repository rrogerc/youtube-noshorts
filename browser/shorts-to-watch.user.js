// ==UserScript==
// @name         YouTube Shorts to normal player
// @description  Opens any Short in the regular watch page instead of the swipe feed.
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Web counterpart to the NoShortsEver tweak's YTReelPlayerViewController redirect.
// A Short and a normal video share the same id, so /shorts/<id> -> /watch?v=<id>
// lands on the same content in the standard player.
(function () {
  'use strict';

  function redirect() {
    const m = location.pathname.match(/^\/shorts\/([A-Za-z0-9_-]+)/);
    if (!m) return false;
    location.replace('/watch?v=' + m[1] + location.search.replace(/^\?/, '&'));
    return true;
  }

  if (redirect()) return;

  // YouTube is a single-page app: most Shorts opens are history pushes, not loads.
  for (const method of ['pushState', 'replaceState']) {
    const original = history[method];
    history[method] = function () {
      const result = original.apply(this, arguments);
      redirect();
      return result;
    };
  }
  window.addEventListener('popstate', redirect);

  // Catch clicks before YouTube's router sees them, so the swipe feed never mounts.
  document.addEventListener('click', function (e) {
    const link = e.target.closest && e.target.closest('a[href*="/shorts/"]');
    if (!link) return;
    const m = link.getAttribute('href').match(/\/shorts\/([A-Za-z0-9_-]+)/);
    if (!m) return;
    e.preventDefault();
    e.stopPropagation();
    location.assign('/watch?v=' + m[1]);
  }, true);
})();

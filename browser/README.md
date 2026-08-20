# YouTube without Shorts, in the browser

> **Update (2026-08-20): the native sideloaded app now works** — see the ✅ WORKING
> section in the top-level `CLAUDE.md`. Playback stops cutting off once the app is
> signed in via an account already present on the device. This browser kit is kept
> as a fallback and is still useful if the native build ever breaks again (e.g. a
> lost keychain session or a tightened server policy).

Sideloaded YouTube cuts playback after ~1 minute while **signed out** — a
server-side Proof-of-Origin/attestation guard that can't be patched from userland.
The web version has none of those walls: sign-in works, playback never cuts off,
and Shorts can be removed *more* completely than the native tweak managed —
including the channel-page Shorts tab.

**`youtube-no-shorts.user.js` does everything in one file.** It hides the Shorts
tab, the shelves, and every individual Short, and it opens any Short you do reach
in the normal player. Use it with either browser below.

---

## Which browser?

| | Orion | Safari |
|---|---|---|
| Background audio (screen off / other app) | **Yes** | No, PiP only |
| Runs the userscript | Yes (Violentmonkey) | Yes (Userscripts) |
| Ad blocking | uBlock Origin | AdGuard / Wipr |
| Feel | Extra app | Native, best battery |

**Pick Orion if you want background audio** — YouTube keeps playing when you lock
the phone, which is the thing YTLite gave you and Safari won't do. Pick Safari if
you'd rather stay native and don't care about background playback.

---

## Option A — Orion (recommended)

1. Install **Orion Browser** (by Kagi) from the App Store — free.
2. Install **Violentmonkey**: Orion → Settings → Extensions → browse the Firefox
   add-on store → Violentmonkey.
3. Install **uBlock Origin** the same way, for ads.
4. Open Violentmonkey → **+ New script** → paste the contents of
   `youtube-no-shorts.user.js` → Save. Or open the raw URL and Violentmonkey will
   offer to install it:
   ```
   https://raw.githubusercontent.com/rrogerc/youtube-noshorts/main/browser/youtube-no-shorts.user.js
   ```
5. Enable background audio: Orion → Settings → check that media playback in the
   background is on.
6. Go to `m.youtube.com`, sign in, then **Share → Add to Home Screen**.

## Option B — Safari

1. Install **Userscripts** from the App Store (free, open source, by Justin Wasack).
2. Settings → Apps → Safari → Extensions → enable **Userscripts** and give it
   permission on `youtube.com` (choose **Always Allow** so it runs on every visit).
3. Open the Userscripts app, tap **+**, create a new script, and paste the
   contents of `youtube-no-shorts.user.js`.
4. Optional, for ads: install **AdGuard** (free) and enable its Safari content
   blockers under Settings → Apps → Safari → Extensions.
5. Go to `m.youtube.com`, sign in, then **Share → Add to Home Screen**.

---

## Checking it works

- The **Shorts button** should be gone from the bottom bar.
- The **Shorts shelf** should be gone from Home and from search results.
- On a channel page, the **Shorts tab** should be gone.
- Opening a Shorts link should land you in the **normal player** with a scrubber,
  not the swipe feed.

## If Shorts come back later

YouTube renames its custom elements every so often. The rules that key on
`a[href^="/shorts/"]` match on the URL rather than the element name, so they are
the durable ones. If something reappears, find the new element name (long-press →
Inspect on desktop Safari with the phone connected) and add it to the `CSS` block
in the userscript. The `sweep()` function at the bottom also catches anything
identified purely by the visible text "Shorts".

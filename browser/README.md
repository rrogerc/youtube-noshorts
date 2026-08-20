# Browser route — YouTube without Shorts

The web version of YouTube has none of the walls the sideloaded app runs into: no
integrity cutoff, no forced-update block, and sign-in works normally. Shorts removal
is also *more* complete here than in the native tweak, because filter rules can hide
the channel-page Shorts tab that the native hooks never could.

Two setups. Pick one.

## Option A — Orion + uBlock Origin (most complete)

Orion (by Kagi, free on the App Store) runs real Firefox/Chrome extensions on iOS.

1. Install **Orion** from the App Store.
2. Install **uBlock Origin** from within Orion (Settings → Extensions → get it from the
   Firefox add-on store).
3. uBlock Origin → Settings → **Filter lists** → **Import** → paste this URL:
   ```
   https://raw.githubusercontent.com/rrogerc/youtube-noshorts/main/browser/no-shorts.txt
   ```
4. For the Shorts→normal-player redirect, install a userscript manager extension
   (e.g. Violentmonkey) and add `shorts-to-watch.user.js` from this folder.
5. Open `m.youtube.com`, then **Share → Add to Home Screen** for an app-style icon.

## Option B — Safari + AdGuard (simplest)

1. Install **AdGuard for iOS** (free) from the App Store.
2. Settings → Safari → Extensions → enable AdGuard's content blockers.
3. In AdGuard: **Settings → Filters → User rules** → paste the contents of
   `no-shorts.txt` (the `!` comment lines can stay; they are ignored).
4. Open `m.youtube.com` in Safari → **Share → Add to Home Screen**.

Safari extensions can't run the userscript, so `/shorts/` links still open the swipe
player here — but the filter rules mean you should almost never see a Shorts link to
tap in the first place.

## Trade-offs versus the native app

- Background audio is weaker than a real app (Orion handles it better than Safari).
- No system-level Picture-in-Picture in every case.
- Ads: use a content blocker; YouTube web ads are blocked well by uBlock Origin.
- Upside: your account works, playback never cuts off, and Shorts are gone from
  channel pages too.

## Maintenance

YouTube renames its custom elements every so often. If Shorts reappear, the rules
keyed on `:has(a[href^="/shorts/"])` are the durable ones — they match on the URL
rather than the element name. Update the tag names in `no-shorts.txt` to match
whatever YouTube ships next.

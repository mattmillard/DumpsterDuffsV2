# PWA (Progressive Web App) Setup Guide

This document outlines the setup needed to make the /admin section fully installable as a PWA on iOS and Android.

## Current Status

✅ **Implemented:**

- Manifest.json with PWA metadata
- Viewport meta tags for mobile optimization
- Safe area support for notch devices
- Theme color configuration
- Mobile-first responsive design
- Bottom tab navigation for touch

⏳ **Needed for Full Installability:**

- App icons (192x192, 512x512, maskable variants)
- Screenshots for app store
- Service worker for offline support
- Web app manifest validation

## Step 1: Create App Icons

You need to generate icons in multiple sizes and formats.

### Required Icon Sizes

1. **192x192 PNG**
   - Location: `/public/icon-192.png`
   - Used for: Android launcher, browser tabs
   - Background: Should match theme (dark background with orange accent)

2. **512x512 PNG**
   - Location: `/public/icon-512.png`
   - Used for: Splash screens, app stores
   - Must be high quality

3. **Maskable Icons (192x192 & 512x512)**
   - Filenames: `/public/icon-192-maskable.png`, `/public/icon-512-maskable.png`
   - Used for: iOS-style icon masking, adaptive icons on Android
   - Design: Circular icon design with padding (safe zone)
   - Read more: https://web.dev/maskable-icon/

4. **Apple Touch Icon**
   - Location: `/public/apple-touch-icon.png`
   - Size: 180x180 PNG
   - Used for: iOS home screen (Safari)
   - No transparency, flat design

5. **Favicon**
   - Location: `/public/favicon.ico`
   - Size: 32x32 or 64x64
   - Format: ICO or PNG

### Design Guidelines

**Icon Design:**

- Logo should be simple and recognizable at small sizes
- Use brand colors (orange #FF8C00 on dark background #0F0F0F)
- Include "DumpsterDuff" or "DD" initials
- Clear contrast for readability

**Maskable Icons:**

- Design icon to fill center area (10-15% padding around edge)
- Any colors outside safe zone will be clipped
- Test on Android adaptive icon preview: https://maskable.app/

### Quick Icon Generation

Option 1: Use Figma or design tool

- Create 512x512 canvas
- Design icon
- Export to PNG at each size

Option 2: Use online tool

- https://icon-sets.iconify.design/
- https://www.favicon-generator.org/
- Upload your logo and generate all sizes

Option 3: Use imagemagick (if you have an image)

```bash
# From a 512x512 PNG source:
convert icon-512.png -resize 192x192 icon-192.png
convert icon-512.png -resize 180x180 apple-touch-icon.png

# For favicon:
convert icon-192.png favicon.ico
```

## Step 2: Create App Screenshots

Screenshots are displayed in app store listings and installation prompts.

### Required Screenshots

1. **Narrow Form Factor (540x720)**
   - Location: `/public/screenshot-1.png`, `/public/screenshot-2.png`
   - Used for: Mobile app store listings
   - Show: Dashboard, orders view, key features
   - Include: Branding, key UI elements

Create 2-3 marketing screenshots showing:

1. Dashboard with metrics overview
2. Orders/bookings list
3. Quick actions or settings

**Tips:**

- Use real app screenshots (not mockups)
- Add 1-2 word descriptions if possible
- Show key features clearly
- Maintain consistent branding

## Step 3: Test PWA on Different Devices

### iOS (iPhone/iPad)

**Installation:**

1. Open admin app in Safari
2. Tap Share button (bottom)
3. Scroll down and tap "Add to Home Screen"
4. Customize name (optional)
5. Tap "Add"

**Testing Checklist:**

- [ ] App launches from home screen
- [ ] Header respects notch/safe area
- [ ] Bottom nav is accessible
- [ ] Status bar color matches theme
- [ ] Full screen display (no browser chrome)
- [ ] Splash screen shows during load

### Android

**Installation:**

1. Open admin app in Chrome
2. Tap menu (⋮) → "Install app"
3. Confirm installation

**Testing Checklist:**

- [ ] App installs from play prompt
- [ ] Adaptive icon displays correctly
- [ ] Full screen display
- [ ] Navigation works as expected
- [ ] App appears in launcher

### Desktop (PWA Emulation)

**Chrome DevTools:**

1. F12 → Application tab
2. Left sidebar → Manifest
3. Verify manifest.json loads successfully

**Test Manifest:**

```bash
# Validate manifest at: https://web.dev/pwa-manifest/
# Or use Chrome DevTools Application tab
```

## Step 4: Implement Service Worker (Future Enhancement)

For true offline capability:

```typescript
// public/sw.js
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "/admin/dashboard",
        "/admin/bookings",
        "/admin/calendar",
        "/admin/inventory",
        "/admin/settings",
      ]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
```

Register in `app/layout.tsx`:

```typescript
useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }
}, []);
```

## Step 5: Optimize for Installation Prompts

### Android Install Banner

To trigger the automatic install banner:

- ✅ Manifest.json exists and is valid
- ✅ 192x192 PNG icon included
- ✅ Service worker registered (optional but recommended)
- ✅ HTTPS only
- ✅ App doesn't require permissions on launch

### iOS Install Banner

iOS doesn't show an auto-install banner. Users must use Share → Add to Home Screen.

**For better discoverability:**

1. Include install instructions in settings page
2. Show banner prompting users to add to home screen
3. Provide clear benefits

## Step 6: Manifest Validation

Check your manifest is valid:

```bash
# Using curl with web.dev validate tool
curl -X POST https://www.webmanifest.org/api/validate \
  -F "file=@public/manifest.json"
```

Or use Chrome DevTools:

1. F12 → Application → Manifest
2. Check for errors/warnings
3. Verify all fields load correctly

## Step 7: Deployment Checklist

Before deploying to production:

- [ ] Icons created and optimized (all 5 sizes)
- [ ] Icons saved to `/public/` directory
- [ ] `manifest.json` updated with correct icon paths
- [ ] `app/layout.tsx` has correct viewport and meta tags
- [ ] Site is HTTPS
- [ ] Manifest is served with correct MIME type (application/manifest+json)
- [ ] Tested installation on iOS and Android
- [ ] Tested responsive design on multiple devices
- [ ] Safe areas render correctly (notch support)
- [ ] Bottom nav is accessible and functional

## Common Issues & Solutions

### Icon Not Appearing

**Problem:** Icon shows as generic on home screen

**Solutions:**

- Verify icon file exists at exact path in manifest
- Ensure PNG is valid and not corrupted
- For iOS: use 180x180 PNG for apple-touch-icon
- For Android: icon must be square PNG
- Test with https://maskable.app/ for maskable icons

### Manifest Not Loading

**Problem:** Chrome shows "Manifest not found" error

**Solutions:**

- Verify manifest.json is in `/public` directory
- Check Content-Type header: `application/manifest+json`
- Ensure no typos in manifest.json (JSON must be valid)
- Try clearing browser cache and reloading
- Check network tab in DevTools for 404 errors

### App Won't Install

**Problem:** Install prompt doesn't appear or fails

**Solutions:**

- Ensure HTTPS is enabled
- Verify manifest is valid (DevTools Application tab)
- Add at least 192x192 icon to manifest
- Wait 2+ weeks before retesting (Chrome cache)
- On Android: Clear Chrome cache/app data
- On iOS: Try different Safari version or device

### Notch/Safe Area Not Respected

**Problem:** Content overlaps with notch or status bar

**Solutions:**

- Use `safe-top` class on header: `<header className="safe-top">`
- Verify viewport meta tag includes `viewport-fit=cover`
- Use `padding-top: env(safe-area-inset-top)` for critical elements
- Test on actual device (simulator doesn't always show notch)

### Bottom Nav Hidden on Scroll

**Problem:** Bottom navigation becomes inaccessible

**Solutions:**

- Verify content has `pb-24` (padding-bottom for nav height)
- Check `overflow-y-auto` on main content
- Ensure nav has `fixed bottom-0` positioning
- Test with tall content like booking list

## Monitoring & Analytics

### Track Installation

Add to manifest shortcuts or install prompt:

```typescript
// Track PWA installs
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("Install prompt triggered");
  // Store for later use if needed
});

window.addEventListener("appinstalled", (e) => {
  console.log("App installed");
  // Track installation
});
```

### Monitor Usage

```typescript
// Check if running as PWA
const isPWA = window.matchMedia("(display-mode: standalone)").matches;
console.log("Running as PWA:", isPWA);
```

## Resources

- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [MDN Web Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Maskable Icons Editor](https://maskable.app/)
- [Icon Converter Tool](https://www.favicon-generator.org/)
- [PWA Builder](https://www.pwabuilder.com/)
- [iOS PWA Guide](https://web.dev/install-criteria/)

## Next Steps

1. ✅ Create app icons (all 5 variants)
2. ✅ Create screenshots
3. ✅ Test on iOS Safari
4. ✅ Test on Android Chrome
5. ⏳ Implement service worker (optional, phase 2)
6. ⏳ Set up analytics tracking
7. ⏳ Create in-app install prompts

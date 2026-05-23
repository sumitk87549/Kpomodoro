# Flowssom Assets Needed

This document lists all assets that must be sourced before publishing Flowssom.

## Images (assets/images/)

### App Icons
- `icon.png` - 1024x1024px app icon (PNG with transparency)
- `adaptive-icon.png` - Android adaptive icon foreground (432x432px safe zone)
- `favicon.png` - Web favicon (48x48px)

### Splash Screen
- `splash.png` - Launch screen image (2048x2048px, centered logo on dark background #1a1a2e)

### Notifications
- `notification-icon.png` - Status bar icon (24x24px monochrome)

## Background Wallpapers (assets/images/backgrounds/)

Built-in backgrounds to create (1920x1080px or higher, optimized for mobile):

1. `deep-space.jpg` - Dark cosmic scene with subtle stars
2. `forest-mist.jpg` - Misty forest with soft greens
3. `ocean-depths.jpg` - Deep blue underwater scene
4. `twilight.jpg` - Purple/orange twilight sky
5. `warm-sand.jpg` - Warm desert sand texture
6. `northern-lights.jpg` - Aurora borealis over dark landscape
7. `aurora-borealis.jpg` - Premium: Enhanced aurora
8. `volcanic-glow.jpg` - Premium: Volcanic lava glow

## Ambient Sounds (assets/sounds/)

All sounds must be:
- MP3 format, 128kbps or higher
- Seamlessly loopable (crossfade at loop points)
- 30-60 seconds in length (looped during playback)

### Nature Sounds (Free Tier)
1. `rain.mp3` - Gentle rain falling (30s loop)
2. `forest.mp3` - Forest ambience with birds (45s loop)
3. `ocean.mp3` - Ocean waves on shore (20s loop)
4. `wind.mp3` - Soft wind through trees (35s loop)
5. `cafe.mp3` - Distant cafe chatter and cups (60s loop)
6. `fireplace.mp3` - Crackling fire (40s loop)

### White Noise (Free Tier)
7. `white-noise.mp3` - White noise (30s loop)
8. `pink-noise.mp3` - Pink noise (30s loop)
9. `brown-noise.mp3` - Brown/Brownian noise (30s loop)

### Binaural Beats (Premium Tier)
These require special production - different frequencies in left/right channels:
10. `alpha-10hz.mp3` - 10Hz binaural beat for focus (carrier ~200Hz)
11. `theta-6hz.mp3` - 6Hz binaural beat for creativity
12. `delta-2hz.mp3` - 2Hz binaural beat for deep rest

### Session Chime (Free Tier)
13. `chime-success.mp3` - Gentle chime for session complete (2-3s, warm tone)
14. `chime-break.mp3` - Softer chime for break end (1-2s, cool tone)

## Fonts (assets/fonts/)

Recommended free fonts (download from Google Fonts):

1. `DMSans-Regular.ttf` - Primary UI font
2. `DMSans-Light.ttf` - For large numbers
3. `Nunito-Regular.ttf` - Alternative UI font
4. `Nunito-Light.ttf` - Light variant

## Voice Guides (Premium Tier - Optional)

If implementing voice-guided breaks:
- `guide-box-breathing.mp3` - 2-minute box breathing guide
- `guide-body-scan.mp3` - 5-minute body scan
- `guide-physiological-sigh.mp3` - 1-minute sigh guide

Voice should be calm, warm, and professional. Record in a treated space.

## Asset Sourcing Recommendations

### Free Resources
- **Unsplash** - High-quality wallpapers (check license)
- **Pexels** - Free stock photos and videos
- **Freesound.org** - Community sound effects (check licenses)
- **Google Fonts** - Free, open-source fonts

### Paid Resources (Recommended for Quality)
- **Artlist.io** - Royalty-free music and SFX
- **Epidemic Sound** - High-quality ambient tracks
- **AudioJungle** - Individual sound purchases
- **Adobe Stock** - Premium images

### Custom Production
For the best experience, consider:
- Hiring a sound designer for custom ambient loops
- Working with a photographer for exclusive backgrounds
- Recording original voice guides with a professional narrator

## File Size Guidelines

- Images: Keep under 500KB each (use TinyPNG or similar)
- Sounds: Keep under 2MB each
- Total app size target: Under 100MB initial download

## Licensing Checklist

Before including any asset:
- [ ] Verify commercial use is allowed
- [ ] Check if attribution is required
- [ ] Confirm no exclusivity conflicts
- [ ] Save license documentation

---

**Note:** Placeholder files have been created in the assets directories. Replace them with real assets before building for production.

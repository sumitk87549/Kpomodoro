# Flowssom Setup Guide

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator
- A Supabase account (free tier is sufficient)

## Quick Start

### 1. Install Dependencies

```bash
cd flowssom
npm install
```

### 2. Set Up Supabase (for Focus Rooms)

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In your Supabase dashboard, go to SQL Editor
3. Run the following SQL to create the rooms table:

```sql
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Quiet Room',
  participants JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_rooms_created_at ON rooms(created_at);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
```

4. Get your project URL and anon key from Settings > API
5. Create a `.env` file in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Add Assets

Create placeholder assets in `assets/`:

```bash
mkdir -p assets/images assets/sounds assets/fonts

# Create placeholder images (you'll replace these with real assets)
touch assets/images/icon.png
touch assets/images/splash.png
touch assets/images/adaptive-icon.png
touch assets/images/favicon.png
touch assets/images/notification-icon.png

# Create placeholder sound files
touch assets/sounds/rain.mp3
touch assets/sounds/forest.mp3
touch assets/sounds/ocean.mp3
touch assets/sounds/wind.mp3
touch assets/sounds/cafe.mp3
touch assets/sounds/fireplace.mp3
touch assets/sounds/white-noise.mp3
touch assets/sounds/pink-noise.mp3
touch assets/sounds/brown-noise.mp3
```

### 4. Run the App

```bash
# Start Expo development server
npm start

# Then press:
# - i for iOS simulator
# - a for Android emulator
# - w for web browser
```

## Manual Configuration Required

### Supabase Project Setup

1. Create a Supabase project at supabase.com
2. Run the SQL schema provided above
3. Copy your project URL and anon key to `.env`

### RevenueCat (Dormant - activate at 1k users)

1. Create a RevenueCat account at revenuecat.com
2. Set up Apple App Store and Google Play Connect integrations
3. Create products: Monthly (₹199), Annual (₹1,499), Lifetime (₹999)
4. When ready to activate, update `stores/premiumStore.ts`:
   ```typescript
   export const SHOW_PREMIUM_UPSELL = true;
   ```
5. Add your RevenueCat API keys to `.env`

### Asset Sourcing

See `ASSETS_NEEDED.md` for a complete list of required assets.

## Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

### Web

```bash
npx expo export:web
```

## Troubleshooting

### "Module not found" errors

Make sure all dependencies are installed:
```bash
npm install
```

### Supabase connection errors

Verify your `.env` file exists and contains valid credentials:
```bash
cat .env
```

### Build fails on web

Some native modules don't work on web. The app gracefully degrades, but some features (haptics, certain sounds) may be limited.

## Development Tips

- Use `npm start -- --clear` to clear cache if you see stale behavior
- Hot reload is enabled by default
- Check the Expo DevTools at http://localhost:19002 for debugging

## Next Steps After Setup

1. Replace placeholder assets with real sounds and images
2. Test on physical devices for best experience
3. Configure app icons and splash screens
4. Set up EAS Build for production builds
5. Submit to App Store and Google Play

---

Built with care for focused humans everywhere. 🧘

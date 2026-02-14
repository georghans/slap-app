# SLAP - Sticker Location Archive Platform

A mobile-first image board where users upload photos of stickers they discover in the real world, tagged with location data. Browse stickers on a map or scroll through a feed.

## Features

- **Map View** - Browse sticker posts on a map centered on your location
- **Feed View** - Scroll through posts sorted by date or distance
- **Post Details** - View sticker image, description, location, likes, and comments
- **Google Sign-In** - Authentication via Supabase OAuth

## Tech Stack

- **Frontend**: Expo SDK 54, React Native 0.81, TypeScript, Expo Router
- **Backend**: Supabase (Auth, PostgreSQL, Storage, Edge Functions)

## Getting Started

### Prerequisites

- Node.js
- [Expo Go](https://expo.dev/go) on your device (for development)
- A [Supabase](https://supabase.com) project
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com))

### Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Copy `.env.example` and fill in your Supabase credentials

   ```bash
   cp .env.example .env
   ```

   ```
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
   EXPO_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
   ```

3. Configure Supabase

   - Enable **Google** provider under Authentication → Providers with your OAuth client ID and secret
   - Set **Site URL** under Authentication → URL Configuration to your app's redirect URI
   - Add `exp://**/auth/callback` to **Redirect URLs** for local development
   - Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and push migrations:

     ```bash
     supabase login
     supabase link --project-ref your-project-ref
     supabase db push
     ```

4. Start the app

   ```bash
   npx expo start
   ```

## Project Structure

```
app/
  (auth)/          # Sign-in screen (unauthenticated)
  (tabs)/          # Map and Feed tabs (authenticated)
  _layout.tsx      # Root layout with auth routing
lib/
  supabase.ts      # Supabase client config
providers/
  AuthProvider.tsx  # Auth context and Google OAuth flow
hooks/
  useAuth.ts       # Auth convenience hook
supabase/
  migrations/      # Database migrations (version controlled)
```

# SLAP - Sticker Location Archive Platform

A mobile-first image board where users can upload photos of stickers they discover in the real world, tagged with location data.

## Tech Stack

### Frontend
- **Expo SDK 54** - React Native framework with managed workflow
- **React 19** / **React Native 0.81** - UI framework
- **Expo Router 6** - File-based routing and navigation
- **React Navigation 7** - Navigation primitives (tabs, stacks, modals)
- **React Native Reanimated 4** - Performant animations
- **TypeScript 5.9** - Type safety

### Backend
- **Supabase** - Backend as a Service
  - **Supabase Auth** - Authentication (Google OAuth)
  - **Supabase Database** - PostgreSQL for data storage
  - **Supabase Storage** - Image storage
  - **Supabase Edge Functions** - Serverless functions (Deno)
  - **Supabase Realtime** - Live updates for likes/comments

### Installed Libraries
- `expo-secure-store` - Secure token storage (auth session persistence)
- `expo-auth-session` - OAuth redirect URI utilities
- `expo-crypto` - Crypto primitives for PKCE
- `expo-web-browser` - In-app browser for OAuth flow

### Additional Libraries (To Install)
- `react-native-maps` - Map view component
- `expo-location` - User location access
- `expo-image-picker` - Camera/gallery access

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Expo App (Client)                       │
├─────────────────────────────────────────────────────────────┤
│  Screens          │  Components        │  Hooks/State       │
│  - Map View       │  - PostCard        │  - useAuth         │
│  - Feed View      │  - PostModal       │  - useLocation     │
│  - Auth Screens   │  - MapPin          │  - usePosts        │
│  - Profile        │  - CommentList     │  - useSupabase     │
│  - Create Post    │  - LikeButton      │                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase JS Client                        │
│         (Auth, Database, Storage, Realtime, Edge Fn)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Supabase                             │
├─────────────────────────────────────────────────────────────┤
│  Auth           │  Database (PostgreSQL)  │  Storage        │
│  - Google OAuth │  - profiles             │  - sticker-     │
│  - Session mgmt │  - posts                │    images       │
│                 │  - comments             │                 │
│                 │  - likes                │                 │
├─────────────────────────────────────────────────────────────┤
│  Edge Functions (Deno)        │  Realtime                   │
│  - create-post (with upload)  │  - Post updates             │
│  - add-comment                │  - Like updates             │
│  - toggle-like                │  - Comment updates          │
│  - get-feed                   │                             │
│  - get-nearby-posts           │                             │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
slap/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── _layout.tsx           # Tab layout (Map, Feed tabs)
│   │   ├── index.tsx             # Map view (home)
│   │   └── feed.tsx              # Feed view
│   ├── (auth)/                   # Auth flow (unauthenticated)
│   │   ├── _layout.tsx           # Auth layout
│   │   └── sign-in.tsx           # Sign in screen
│   ├── post/
│   │   ├── [id].tsx              # Post detail modal
│   │   └── create.tsx            # Create post screen
│   ├── profile/
│   │   ├── index.tsx             # User profile
│   │   └── [userId].tsx          # Other user's profile
│   ├── _layout.tsx               # Root layout (auth check)
│   └── +not-found.tsx            # 404 screen
├── components/
│   ├── ui/                       # Generic UI components
│   ├── posts/                    # Post-related components
│   ├── map/                      # Map-related components
│   └── auth/                     # Auth-related components
├── lib/
│   ├── supabase.ts               # Supabase client initialization
│   └── auth.ts                   # Auth helper functions
├── hooks/
│   ├── useAuth.ts                # Authentication hook
│   ├── useLocation.ts            # Location hook
│   └── usePosts.ts               # Posts data hook
├── providers/
│   ├── AuthProvider.tsx          # Auth context provider
│   └── LocationProvider.tsx      # Location context provider
├── types/
│   └── database.ts               # Supabase database types
├── constants/
│   └── theme.ts                  # Colors, fonts, spacing
├── supabase/
│   ├── functions/                # Edge functions source
│   └── migrations/               # Database migrations
└── assets/
    └── images/
```

## Database Schema

```sql
-- Users profile (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts (sticker sightings)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Edge Functions vs Direct Supabase JS

### Using Supabase JS directly (preferred for simple operations)
- Reading posts, comments, likes (with RLS policies)
- User profile updates
- Simple queries and filters

### Using Edge Functions (for complex/atomic operations)
- **create-post**: Upload image to storage + create post record atomically
- **toggle-like**: Optimistic update with conflict handling
- **add-comment**: With notification triggers
- **get-nearby-posts**: Complex geo queries with PostGIS

## Features

### MVP (Phase 1)
- [x] Project setup with Expo
- [x] User authentication (Google Sign-In via Supabase OAuth)
- [x] User profile auto-creation (DB trigger on signup)
- [ ] Map view with user location
- [ ] Create post with image + location
- [ ] Feed view (chronological)
- [ ] Post detail modal
- [ ] Like posts
- [ ] Comment on posts

### Phase 2
- [ ] Feed sorting (nearest to farthest)
- [ ] User profiles with post history
- [ ] Search/filter posts
- [ ] Push notifications

### Phase 3
- [ ] Sticker tagging/categories
- [ ] Leaderboards
- [ ] Following other users
- [ ] Report inappropriate content

## Auth Flow

Google Sign-In uses Supabase's built-in OAuth flow (not expo-auth-session's Google provider):
1. App calls `supabase.auth.signInWithOAuth({ provider: 'google' })` with `skipBrowserRedirect: true`
2. Opens the returned URL in an in-app browser via `expo-web-browser`
3. Google authenticates → redirects to Supabase callback (`/auth/v1/callback`)
4. Supabase redirects back to app via deep link (`exp://` in dev, `slap://` in production)
5. App extracts session tokens from the redirect URL

### Supabase Dashboard Config Required
- **Authentication → Providers → Google**: Web OAuth client ID + secret
- **Authentication → URL Configuration → Site URL**: Must match the app's redirect URI
  - Dev (Expo Go): `exp://192.168.x.x:8081/--/auth/callback`
  - Production: `slap://auth/callback`
- **Authentication → URL Configuration → Redirect URLs**: Add `exp://**/auth/callback` for dev

## Environment Variables

```bash
EXPO_PUBLIC_SUPABASE_URL=   # Supabase project URL
EXPO_PUBLIC_SUPABASE_KEY=   # Supabase anon/publishable key
# Google OAuth credentials are configured in Supabase dashboard only (not in app)
```

## Development Commands

```bash
npx expo start              # Start dev server
npx expo run:ios            # Run on iOS simulator
npx expo run:android        # Run on Android emulator
supabase functions deploy   # Deploy edge functions
supabase gen types typescript --project-id <id> > types/database.ts
```

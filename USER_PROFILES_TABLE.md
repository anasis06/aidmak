# User Profiles Table - Production Real-Time Database Structure

## Overview

The `user_profiles` table is designed for production real-time applications with a one-to-one relationship to the `users` table. It stores all user profile setup details with automatic cascade delete and real-time update capabilities.

---

## Table Schema

### Core Fields

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| `id` | uuid | Primary key, auto-generated | Yes |
| `user_id` | uuid | Foreign key to users table (CASCADE DELETE) | Yes |
| `created_at` | timestamptz | Profile creation timestamp | Auto |
| `updated_at` | timestamptz | Last update timestamp | Auto |

### Profile Setup Fields (Current)

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| `gender` | text | User gender: male, female, other | No |
| `height` | numeric | Height in centimeters | No |
| `weight` | numeric | Weight in kilograms | No |
| `skin_tone` | text | Skin tone: fair, medium, dusky, dark | No |
| `profile_picture_url` | text | Public URL to profile picture | No |

### Body Measurements (Extended)

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| `chest_measurement` | numeric | Chest measurement in cm | No |
| `waist_measurement` | numeric | Waist measurement in cm | No |
| `hips_measurement` | numeric | Hips measurement in cm | No |
| `inseam_measurement` | numeric | Inseam measurement in cm | No |
| `shoe_size` | numeric | Shoe size (region-specific) | No |

### Style & Preferences (Future-Ready)

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| `clothing_size` | text | Standard size: XS, S, M, L, XL, XXL | No |
| `preferred_fit` | text | Fit preference: slim, regular, relaxed | No |
| `body_type` | text | Body type classification | No |
| `style_preferences` | jsonb | JSON object for style data | No |
| `measurements_metadata` | jsonb | JSON object for additional measurements | No |
| `additional_notes` | text | User-provided notes | No |

---

## Key Features

### ✅ One-to-One Relationship
```sql
user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
CONSTRAINT unique_user_profile UNIQUE(user_id)
```
- Each user has exactly ONE profile
- Foreign key enforces referential integrity
- Unique constraint prevents duplicates

### ✅ Cascade Delete
```sql
ON DELETE CASCADE
```
**Behavior:**
- When user is deleted from `users` table
- Their profile is automatically deleted from `user_profiles`
- No orphaned records
- Data consistency maintained automatically

**Example:**
```sql
-- Delete user
DELETE FROM users WHERE id = 'user-123';

-- Profile automatically deleted
-- No manual cleanup needed
```

### ✅ Real-Time Capabilities
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
```
- Enabled for Supabase Realtime
- Instant updates across all connected clients
- Subscribe to profile changes in real-time
- Production-ready synchronization

### ✅ Auto-Updating Timestamps
```sql
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
TRIGGER update_user_profiles_updated_at
```
- `created_at` set automatically on insert
- `updated_at` updated automatically on changes
- No manual timestamp management needed

### ✅ Performance Optimized
```sql
-- Indexes for fast queries
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at DESC);
CREATE INDEX idx_user_profiles_updated_at ON user_profiles(updated_at DESC);
CREATE INDEX idx_user_profiles_gender ON user_profiles(gender);
CREATE INDEX idx_user_profiles_body_type ON user_profiles(body_type);
```
- Fast lookups by user_id
- Quick time-based queries
- Efficient filtering by common fields

### ✅ Row Level Security (RLS)
```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```
**Policies:**
- Users can read their own profile
- Users can insert their own profile
- Users can update their own profile
- Users can delete their own profile

---

## Database Functions

### 1. Get Complete User Profile
```sql
SELECT * FROM get_user_profile('user-id-here');
```
Returns all profile fields for a specific user.

### 2. Check Profile Completeness
```sql
SELECT is_profile_complete('user-id-here');
```
Returns `true` if required fields are filled:
- gender
- height
- weight
- skin_tone
- profile_picture_url

---

## Usage Examples

### Create Profile
```typescript
import { profileService } from '@/services/profileService';

await profileService.upsertProfile({
  user_id: 'user-123',
  gender: 'male',
  height: 175,
  weight: 70,
  skin_tone: 'fair',
  profile_picture_url: 'https://...',
});
```

### Update Profile
```typescript
await profileService.updateProfile('user-123', {
  chest_measurement: 95,
  waist_measurement: 80,
  preferred_fit: 'regular',
});
```

### Get Profile
```typescript
const profile = await profileService.getProfile('user-123');
console.log(profile);
```

### Delete Profile
```typescript
await profileService.deleteProfile('user-123');
```

### Subscribe to Real-Time Updates
```typescript
const unsubscribe = profileService.subscribeToProfile(
  'user-123',
  (profile) => {
    if (profile) {
      console.log('Profile updated:', profile);
    } else {
      console.log('Profile deleted');
    }
  }
);

// Later, unsubscribe
unsubscribe();
```

### Check if Profile is Complete
```typescript
const isComplete = await profileService.isProfileComplete('user-123');
if (!isComplete) {
  // Redirect to profile setup
}
```

---

## Real-Time Application Flow

### 1. User Signs Up
```
users table:
INSERT → id: 'user-123', name: 'John Doe', ...
```

### 2. Profile Setup
```
user_profiles table:
INSERT → user_id: 'user-123', gender: 'male', ...
```

### 3. Real-Time Updates
```
Multiple devices listening to profile changes
Device A updates profile → All devices receive update instantly
```

### 4. User Deletion
```
DELETE FROM users WHERE id = 'user-123';
↓
CASCADE DELETE triggers
↓
Profile automatically deleted from user_profiles
↓
Real-time event sent to all subscribers
```

---

## Data Validation

### Height Validation
- Range: 100-250 cm
- Type: numeric
- Required for complete profile

### Weight Validation
- Range: 20-300 kg
- Type: numeric
- Required for complete profile

### Gender Options
- Valid values: 'male', 'female', 'other'
- Type: text
- Required for complete profile

### Skin Tone Options
- Valid values: 'fair', 'medium', 'dusky', 'dark'
- Type: text
- Required for complete profile

---

## JSON Fields Structure

### style_preferences
```json
{
  "colors": ["black", "blue", "white"],
  "styles": ["casual", "formal"],
  "brands": ["Nike", "Adidas"],
  "favorite_categories": ["shirts", "pants"]
}
```

### measurements_metadata
```json
{
  "measurement_date": "2025-10-18",
  "measured_by": "self",
  "unit_system": "metric",
  "notes": "After workout"
}
```

---

## Migration Files

### Initial Creation
```
20251018000000_create_user_profiles_table.sql
```
- Creates base table structure
- Sets up foreign key with CASCADE
- Enables RLS
- Creates basic policies

### Enhancement
```
20251018100000_enhance_user_profiles_table.sql
```
- Adds extended measurement fields
- Adds JSONB fields for flexibility
- Enables real-time subscriptions
- Creates helper functions
- Adds performance indexes

---

## Production Checklist

✅ **One-to-One Relationship**
- Foreign key constraint: `REFERENCES users(id)`
- Unique constraint: `UNIQUE(user_id)`

✅ **Cascade Delete**
- `ON DELETE CASCADE` configured
- Automatic cleanup on user deletion

✅ **Real-Time Enabled**
- Added to `supabase_realtime` publication
- Instant synchronization across clients

✅ **Row Level Security**
- RLS enabled on table
- Proper policies for all operations

✅ **Performance Optimized**
- Indexed on frequently queried columns
- Efficient query execution

✅ **Future-Proof**
- JSONB fields for extensibility
- All current profile fields included
- Room for growth without schema changes

✅ **Auto-Management**
- Timestamps auto-updated
- Triggers configured
- No manual maintenance needed

---

## Testing

### Test Cascade Delete
```sql
-- Create user and profile
INSERT INTO users (id, full_name) VALUES ('test-user', 'Test User');
INSERT INTO user_profiles (user_id, gender) VALUES ('test-user', 'male');

-- Verify profile exists
SELECT * FROM user_profiles WHERE user_id = 'test-user';

-- Delete user
DELETE FROM users WHERE id = 'test-user';

-- Verify profile was automatically deleted
SELECT * FROM user_profiles WHERE user_id = 'test-user';
-- Returns 0 rows ✅
```

### Test Real-Time Updates
```typescript
// Subscribe in client
const unsubscribe = profileService.subscribeToProfile(
  'user-123',
  (profile) => console.log('Update:', profile)
);

// Update in another client
await profileService.updateProfile('user-123', { height: 180 });

// First client receives update immediately ✅
```

### Test Profile Completeness
```typescript
// Incomplete profile
await profileService.upsertProfile({
  user_id: 'user-123',
  gender: 'male',
});

const complete = await profileService.isProfileComplete('user-123');
// Returns: false ✅

// Complete profile
await profileService.updateProfile('user-123', {
  height: 175,
  weight: 70,
  skin_tone: 'fair',
  profile_picture_url: 'https://...',
});

const nowComplete = await profileService.isProfileComplete('user-123');
// Returns: true ✅
```

---

## Summary

The `user_profiles` table is production-ready with:

✅ **One-to-one relationship** with `users` table via `user_id` foreign key
✅ **Automatic cascade delete** when users are deleted
✅ **All current profile setup fields** (gender, height, weight, skin_tone, picture)
✅ **Extended fields** for body measurements and preferences
✅ **Real-time capabilities** for instant synchronization
✅ **Future-proof design** with JSONB fields for extensibility
✅ **Performance optimized** with proper indexing
✅ **Security enabled** with Row Level Security
✅ **Auto-managed** timestamps and triggers

This structure is suitable for production real-time applications with scalability and data consistency built-in.

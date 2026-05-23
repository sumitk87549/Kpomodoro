// Flowssom Supabase Client
// Minimal configuration for Focus Rooms only

import { createClient } from '@supabase/supabase-js';

// These should be set via environment variables in production
// For now, using placeholder values that will be replaced during setup
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database schema reference for manual setup:
/*
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

-- Auto-delete rooms after 24 hours of inactivity
CREATE OR REPLACE FUNCTION cleanup_stale_rooms()
RETURNS trigger AS $$
BEGIN
  DELETE FROM rooms 
  WHERE updated_at < NOW() - INTERVAL '24 hours'
  AND jsonb_array_length(participants) = 0;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_stale_rooms
AFTER UPDATE ON rooms
EXECUTE FUNCTION cleanup_stale_rooms();
*/

export default supabase;

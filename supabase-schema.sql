-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/oacmxyesowodugqdpkof/sql

CREATE TABLE IF NOT EXISTS offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('graduation', 'honors_first', 'honors_second', 'honors_third')),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_sar DECIMAL(10,2) NOT NULL,
  contact_methods TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read offers
CREATE POLICY "Anyone can view offers" ON offers
  FOR SELECT USING (true);

-- Allow anyone to insert offers
CREATE POLICY "Anyone can insert offers" ON offers
  FOR INSERT WITH CHECK (true);

-- Allow updates and deletes (handled via API with admin password check)
CREATE POLICY "Anyone can update offers" ON offers
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete offers" ON offers
  FOR DELETE USING (true);


-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the avatars bucket
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES 
  (
    'Avatar Policy - Public Read',
    'avatars',
    '(bucket_id = ''avatars''::text)'
  ),
  (
    'Avatar Policy - Auth Insert',
    'avatars',
    '((bucket_id = ''avatars''::text) AND (auth.role() = ''authenticated''::text) AND (storage.foldername(name)[1] = auth.uid()::text))'
  ),
  (
    'Avatar Policy - Owner Update',
    'avatars',
    '((bucket_id = ''avatars''::text) AND (auth.role() = ''authenticated''::text) AND (storage.foldername(name)[1] = auth.uid()::text))'
  ),
  (
    'Avatar Policy - Owner Delete',
    'avatars',
    '((bucket_id = ''avatars''::text) AND (auth.role() = ''authenticated''::text) AND (storage.foldername(name)[1] = auth.uid()::text))'
  )
ON CONFLICT (name, bucket_id) DO NOTHING;

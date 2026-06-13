import { supabase } from './supabase';

const BUCKET = 'inventory-images';
const PUBLIC_PREFIX = `/storage/v1/object/public/${BUCKET}/`;

export async function uploadImage(file, type) {
  const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'jpg';
  const path = `${type}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadImages(files, type) {
  const urls = [];
  for (const file of files) urls.push(await uploadImage(file, type));
  return urls;
}

// Best-effort delete of bucket-hosted images by public URL.
// Silently ignores URLs that don't belong to this bucket (e.g. legacy paths).
export async function deleteImagesByUrl(urls = []) {
  const paths = urls
    .map((url) => {
      const i = url.indexOf(PUBLIC_PREFIX);
      return i === -1 ? null : url.slice(i + PUBLIC_PREFIX.length);
    })
    .filter(Boolean);
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
}

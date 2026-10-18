import { sizedImage } from './specs';

// Vehicle photo that fills its frame. Most uploads are 4:3 phone shots, so a 4:3
// frame shows them uncropped; wider or taller photos are trimmed at the edges.
export default function VehiclePhoto({ src, alt, size = 800, loading = 'lazy', className = '' }) {
  return (
    <div className={`overflow-hidden bg-paper-shade ${className}`}>
      <img
        src={sizedImage(src, size)}
        alt={alt}
        loading={loading}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

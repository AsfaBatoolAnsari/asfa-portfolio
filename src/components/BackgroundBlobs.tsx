/** The two ambient drift-blobs used behind Contact, Designs, DesignDetail and
 * ProjectDetail. Home and Projects have their own richer (3-blob + vignette)
 * variant inlined on the page since it differs from this one. */
export function BackgroundBlobs() {
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute', left: '-12vw', top: '-18vh', width: '56vw', height: '56vw', borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, rgba(240,102,30,0.11), transparent 65%)',
          filter: 'blur(70px)', animation: 'drift1 26s ease-in-out infinite alternate',
        }}
      />
      <div
        style={{
          position: 'absolute', right: '-16vw', top: '30vh', width: '50vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(circle at 55% 45%, rgba(255,138,64,0.055), transparent 62%)',
          filter: 'blur(80px)', animation: 'drift2 32s ease-in-out infinite alternate',
        }}
      />
    </div>
  );
}

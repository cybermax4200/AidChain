// TODO: Field officer offline-first PWA
// Features to implement:
//   - Login with field officer credentials
//   - List assigned beneficiaries and their pending conditions
//   - Record condition fulfillment with photo evidence (stored in IndexedDB offline)
//   - Sync queue: when online, POST to /api/conditions/fulfill with evidence IPFS hash
//   - Service worker via vite-plugin-pwa for offline support

export default function FieldApp() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>AidChain Field App</h1>
      <p>Offline-first condition verification for field officers.</p>
      <p><strong>Status:</strong> Not yet implemented — open for contributors.</p>
    </div>
  );
}

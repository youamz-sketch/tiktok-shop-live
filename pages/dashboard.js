import { useState } from 'react';

export default function Dashboard() {
  const [form, setForm] = useState({ title: '', cta_text: 'Clique ici', cta_url: 'https://example.com', discount_percent: 20, minutes: 10 });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    setLoading(true);
    const res = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const json = await res.json();
    setLoading(false);
    if (json.ok) setSession(json.session);
    else alert(json.error || 'Erreur');
  };

  const startTimer = async () => {
    if (!session) return;
    setLoading(true);
    const res = await fetch('/api/timer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: session.id, action: 'start', durationSec: (form.minutes || 10) * 60 }) });
    const json = await res.json();
    setLoading(false);
    if (json.ok) setSession(json.session); else alert(json.error || 'Erreur');
  };

  const stopTimer = async () => {
    if (!session) return;
    setLoading(true);
    const res = await fetch('/api/timer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: session.id, action: 'stop' }) });
    const json = await res.json();
    setLoading(false);
    if (json.ok) setSession(json.session); else alert(json.error || 'Erreur');
  };

  const overlayUrl = session ? `/overlay?id=${encodeURIComponent(session.id)}&cta=${encodeURIComponent(form.cta_url)}&discount=${form.discount_percent||0}` : '';

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 24, fontFamily: 'system-ui' }}>
      <h1>Dashboard — TikTok Shop Live Studio</h1>

      <section style={{ marginTop: 20, padding: 16, border: '1px solid #333', borderRadius: 12 }}>
        <h2>1) Créer une session</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          <input placeholder="Titre du live" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <input placeholder="CTA texte" value={form.cta_text} onChange={e=>setForm({...form,cta_text:e.target.value})}/>
          <input placeholder="CTA URL" value={form.cta_url} onChange={e=>setForm({...form,cta_url:e.target.value})}/>
          <input type="number" placeholder="Remise (%)" value={form.discount_percent} onChange={e=>setForm({...form,discount_percent:Number(e.target.value)})}/>
          <input type="number" placeholder="Durée (minutes)" value={form.minutes} onChange={e=>setForm({...form,minutes:Number(e.target.value)})}/>
          <button onClick={createSession} disabled={loading || !form.title}>Créer la session</button>
        </div>
      </section>

      {session && (
        <section style={{ marginTop: 20, padding: 16, border: '1px solid #333', borderRadius: 12 }}>
          <h2>2) Contrôler le timer</h2>
          <p><b>ID:</b> {session.id}</p>
          <p><b>Status:</b> {session.status} · <b>Début:</b> {session.start_at || '-'} · <b>Fin:</b> {session.end_at || '-'}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={startTimer} disabled={loading}>Démarrer</button>
            <button onClick={stopTimer} disabled={loading}>Stopper</button>
          </div>

          <h3 style={{ marginTop: 16 }}>3) URL Overlay (à coller dans OBS / TikTok Studio en Browser Source)</h3>
          <code style={{ display: 'block', padding: 12, background: '#111', borderRadius: 8 }}>{overlayUrl}</code>
          <p style={{fontSize:12,opacity:.8}}>Astuce: largeur 1920, hauteur 1080, fond transparent.</p>
        </section>
      )}
    </main>
  );
}

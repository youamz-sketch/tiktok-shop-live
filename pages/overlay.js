import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function useCountdown(startAt, endAt) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(()=>setNow(Date.now()), 250); return () => clearInterval(t); }, []);
  const endMs = endAt ? new Date(endAt).getTime() : 0;
  const diff = Math.max(0, endMs - now);
  const s = Math.floor(diff/1000);
  const m = Math.floor(s/60); const sec = s%60;
  return { totalSec: s, m, sec };
}

export default function Overlay() {
  const url = new URL(typeof window !== 'undefined' ? window.location.href : 'http://localhost');
  const id = url.searchParams.get('id');
  const cta = url.searchParams.get('cta') || '';
  const discount = url.searchParams.get('discount') || 0;

  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!id) return;
    // poll simple (toutes les 2s) — suffisant V0
    const load = async () => {
      const { data, error } = await supabase.from('sessions').select('*').eq('id', id).single();
      if (!error) setSession(data);
    };
    load();
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, [id]);

  const { m, sec } = useCountdown(session?.start_at, session?.end_at);

  const banner = useMemo(() => {
    return `- ${discount}% aujourd’hui seulement — CLIQUE ICI`;
  }, [discount]);

  // Styles overlay full-screen transparent
  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: 'transparent', position: 'relative', fontFamily: 'system-ui'
    }}>
      {/* Bandeau haut */}
      <div style={{
        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
        padding: '10px 18px', background: '#111', color: 'white', borderRadius: 12, border: '1px solid #444'
      }}>
        {banner}
      </div>

      {/* Timer bas droit */}
      <div style={{
        position: 'absolute', right: 20, bottom: 20, padding: '12px 18px',
        background: '#c1121f', color: 'white', borderRadius: 12, fontSize: 28, fontWeight: 700
      }}>
        ⏳ {String(m).padStart(2,'0')}:{String(sec).padStart(2,'0')}
      </div>

      {/* Bouton CTA bas gauche */}
      {cta && (
        <a href={cta} target="_blank" rel="noreferrer" style={{
          position: 'absolute', left: 20, bottom: 20, padding: '12px 18px',
          background: '#0ea5e9', color: 'white', borderRadius: 12, fontSize: 18, textDecoration: 'none'
        }}>
          👉 J’en profite
        </a>
      )}
    </div>
  );
}

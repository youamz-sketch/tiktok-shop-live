// pages/overlay.js
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// === Personnalisation rapide ===
const brandText = 'Live TikTok Shop'; // <- ton texte stylisé
const primary = '#ff2a55'; // rose néon
const secondary = '#2ad1ff'; // bleu néon

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
    return `-${discount}% aujourd’hui seulement — CLIQUE ICI`;
  }, [discount]);

  return (
    <div style={{
      width: '100vw', height: '100vh', background: 'transparent',
      position: 'relative', overflow: 'hidden', fontFamily: 'system-ui'
    }}>
      {/* --- Badge texte stylisé (pas de logo) --- */}
      <div
        style={{
          position: 'absolute', top: 20, left: 20, padding: '8px 14px',
          borderRadius: 14, background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: `0 0 14px ${primary}55, 0 0 28px ${secondary}40, inset 0 0 10px rgba(255,255,255,0.06)`
        }}
      >
        <span
          style={{
            fontWeight: 800, letterSpacing: 0.4,
            backgroundImage: `linear-gradient(90deg, ${primary}, ${secondary})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: `0 0 12px ${primary}66, 0 0 18px ${secondary}55`,
            filter: 'drop-shadow(0 0 4px rgba(0,0,0,.6))'
          }}
        >
          {brandText}
        </span>
      </div>

      {/* Bandeau promo top center */}
      <div style={{
        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
        padding: '10px 18px', background: 'rgba(17,17,17,0.85)',
        color: 'white', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(6px)'
      }}>
        {banner}
      </div>

      {/* Timer bottom-right (pulse) */}
      <div style={{
        position: 'absolute', right: 20, bottom: 20, padding: '12px 18px',
        background: primary, color: 'white', borderRadius: 12,
        fontSize: 28, fontWeight: 800, animation: 'pulse 1s infinite'
      }}>
        ⏳ {String(m).padStart(2,'0')}:{String(sec).padStart(2,'0')}
      </div>

      {/* CTA bottom-left */}
      {cta && (
        <a href={cta} target="_blank" rel="noreferrer" style={{
          position: 'absolute', left: 20, bottom: 20, padding: '12px 18px',
          background: secondary, color: '#001018', borderRadius: 12, fontSize: 18,
          textDecoration: 'none', fontWeight: 700, border: '1px solid rgba(0,0,0,.2)'
        }}>
          👉 J’en profite
        </a>
      )}

      {/* keyframes (injection CSS minimale) */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 ${primary}66; }
          70% { transform: scale(1.03); box-shadow: 0 0 25px 10px ${primary}00; }
          100% { transform: scale(1); box-shadow: 0 0 0 0 ${primary}00; }
        }
      `}</style>
    </div>
  );
}

// pages/api/timer.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { id, action, durationSec = 600 } = req.body || {};
    if (!id || !action) return res.status(400).json({ error: 'id and action are required' });

    if (action === 'start') {
      const start = new Date().toISOString();
      const end = new Date(Date.now() + durationSec * 1000).toISOString();
      const { data, error } = await supabase
        .from('sessions')
        .update({ start_at: start, end_at: end, status: 'live' })
        .eq('id', id).select('*').single();
      if (error) throw error;
      return res.status(200).json({ ok: true, session: data });
    }

    if (action === 'stop') {
      const { data, error } = await supabase
        .from('sessions')
        .update({ end_at: new Date().toISOString(), status: 'ended' })
        .eq('id', id).select('*').single();
      if (error) throw error;
      return res.status(200).json({ ok: true, session: data });
    }

    return res.status(400).json({ error: 'unknown action' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

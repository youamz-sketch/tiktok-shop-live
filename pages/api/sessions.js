// pages/api/sessions.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { title, cta_text, cta_url, discount_percent, minutes = 10, theme = 'default', language = 'fr' } = req.body || {};
      if (!title) return res.status(400).json({ error: 'title is required' });

      // crée une session (user_id null en V0)
      const { data, error } = await supabase
        .from('sessions')
        .insert([{ title, cta_text, cta_url, discount_percent, language, theme, status: 'draft' }])
        .select('*').single();

      if (error) throw error;

      // minute → propose une fin par défaut (non démarrée, juste pour info)
      return res.status(200).json({ ok: true, session: data });
    }

    if (req.method === 'GET') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase.from('sessions').select('*').eq('id', id).single();
      if (error) throw error;
      return res.status(200).json({ ok: true, session: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(400).json({ error: '❌ Variables d’environnement manquantes' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.from('events').select('*').limit(1);
    if (error) throw error;

    return res.status(200).json({ message: '✅ Connexion Supabase réussie !', sampleData: data || [] });
  } catch (err) {
    return res.status(500).json({ error: '❌ Échec de connexion', details: err.message });
  }
}

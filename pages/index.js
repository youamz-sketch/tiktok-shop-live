export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>🎥 TikTok Shop Live Studio</h1>
      <p>Bienvenue sur ton projet Next.js + Supabase 🚀</p>
      <p>
        Test la connexion Supabase ici :{" "}
        <a href="/api/supabaseTest" style={{ color: "blue" }}>
          /api/supabaseTest
        </a>
      </p>
    </main>
  );
}

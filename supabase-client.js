/* GigBoard Supabase Client Configuration
   ==========================================================================
   Connected to Project: jkhvpqlqbddcezyffoiv
   ========================================================================== */

const SUPABASE_CONFIG = {
  url: "https://jkhvpqlqbddcezyffoiv.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraHZwcWxxYmRkY2V6eWZmb2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NTQ0MTksImV4cCI6MjEwNTMzMDQxOX0.JjfNhWLEXLKa5AZEiarXq_nfkxv353BZBFc_rnivBM4"
};

// Global Supabase client instance
let supabaseClient = null;

if (typeof window !== "undefined") {
  if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      console.log("⚡ GigBoard successfully connected to live Supabase backend!");
    } catch (err) {
      console.warn("Supabase init failed, falling back to Local Hybrid Store:", err);
    }
  }
}

function isSupabaseConfigured() {
  return Boolean(supabaseClient && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
}

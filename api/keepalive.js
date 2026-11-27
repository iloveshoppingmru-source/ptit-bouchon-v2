// Called once a day by the Vercel cron declared in vercel.json.
// Runs a real (tiny) read on the Supabase database so the free-tier project
// is never auto-paused for inactivity. Same public anon key and table the
// guest app already uses in index.html.
const SUPABASE_URL = 'https://uthnrcdulkmjlywwtkot.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0aG5yY2R1bGttamx5d3d0a290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NjgxNjEsImV4cCI6MjEwMTM0NDE2MX0.rDx5nwYP61Q9h59PDUPrShGE6Vrx9kyYv2B-Q6RSn6E';

module.exports = async function handler(req, res) {
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/site_content?select=id&limit=1', {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY },
    });
    console.log('Supabase keepalive: HTTP ' + r.status);
    // Non-2xx => report failure so it shows up in Vercel's cron/function logs.
    res.status(r.ok ? 200 : 502).json({ ok: r.ok, supabaseStatus: r.status });
  } catch (e) {
    console.error('Supabase keepalive failed:', e);
    res.status(500).json({ ok: false, error: String(e && e.message || e) });
  }
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const sbHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/logs?select=*&order=time.desc`,
      { headers: sbHeaders }
    );
    const data = await r.json();
    return res.status(r.status).json(data);
  }

  if (req.method === 'POST') {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/logs`, {
      method: 'POST',
      headers: { ...sbHeaders, 'Prefer': 'return=representation' },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/logs?id=eq.${id}`, {
      method: 'DELETE',
      headers: sbHeaders,
    });
    return res.status(r.status).json({ ok: true });
  }

  res.status(405).end();
}

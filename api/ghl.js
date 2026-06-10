// api/ghl.js
// GHL Contact 업데이트 + 태그 추가 → 유형별 이메일 자동 트리거
// 환경변수: GHL_API_KEY, GHL_LOCATION_ID 필요

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey    = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return res.status(500).json({ error: 'GHL credentials not configured' });
  }

  const { email, name, mood_type } = req.body;

  // email만 필수 (mood_type은 sales_page에서만 전달됨)
  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  // mood_type → 태그 매핑 (GHL 워크플로우 트리거용)
  const TAG_MAP = {
    'Soft Luxury':  'mood_soft_luxury',
    'Cool Muse':    'mood_cool_muse',
    'Clean Beauty': 'mood_clean_beauty',
    'Gentle Aura':  'mood_gentle_aura',
  };

  // mood_type 있을 때만 태그/커스텀필드 추가
  const tags = mood_type && TAG_MAP[mood_type] ? [TAG_MAP[mood_type]] : [];
  const customFields = mood_type
    ? [{ key: 'mood_type', field_value: mood_type }]
    : [];

  try {
    const upsertRes = await fetch(
      `https://services.leadconnectorhq.com/contacts/upsert`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
        },
        body: JSON.stringify({
          locationId,
          email,
          firstName: name || '',
          ...(tags.length > 0 && { tags }),
          ...(customFields.length > 0 && { customFields }),
        }),
      }
    );

    if (!upsertRes.ok) {
      const err = await upsertRes.text();
      console.error('GHL upsert error:', err);
      return res.status(upsertRes.status).json({ error: err });
    }

    const data = await upsertRes.json();
    return res.status(200).json({ ok: true, contactId: data.contact?.id });

  } catch (err) {
    console.error('GHL API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// netlify/functions/airtable.js
exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const id = event.queryStringParameters && event.queryStringParameters.id;
    if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing id' }) };

    const BASE_ID = 'appDSjIPinS4TgaHF';
    const TABLE = 'Registros Safety';
    const FIELD_ID = 'ID del reporte';

    const token = process.env.AIRTABLE_PAT;
    if (!token) return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server missing AIRTABLE_PAT' }) };

    const api = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}?filterByFormula=${encodeURIComponent(`{${FIELD_ID}}='${id}'`)}`;

    const res = await fetch(api, { headers: { Authorization: `Bearer ${token}` } });
    const text = await res.text();
    if (!res.ok) return { statusCode: res.status, headers, body: JSON.stringify({ error: 'Airtable error', detail: text }) };

    const data = JSON.parse(text);
    if (!data.records || data.records.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ fields: data.records[0].fields }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

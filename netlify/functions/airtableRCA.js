exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const id = event.queryStringParameters?.id;
    if (!id) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing ID" }) };
    }

    const BASE_ID = 'appDSjIPinS4TgaHF';
    const TABLE = 'RCA';
    const LINK_FIELD = 'ID del reporte';   // EXACTO como está en Airtable

    const token = process.env.AIRTABLE_PAT;
    if (!token) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'No API Key' }) };
    }

    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}?filterByFormula=${encodeURIComponent(`{${LINK_FIELD}}='${id}'`)}&maxRecords=1`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const text = await res.text();
    const data = JSON.parse(text);

    if (!data.records || data.records.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "No RCA found" }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ fields: data.records[0].fields })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};

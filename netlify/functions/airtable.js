// netlify/functions/airtable.js
exports.handler = async (event) => {
const common = {
'Content-Type': 'application/json',
// CORS seguro para dominios propios de Netlify/preview; ajusta si necesitas restringir
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};


if (event.httpMethod === 'OPTIONS') {
return { statusCode: 200, headers: common, body: '' };
}


try {
const id = event.queryStringParameters && event.queryStringParameters.id;
if (!id) {
return { statusCode: 400, headers: common, body: JSON.stringify({ error: 'Missing id' }) };
}


const BASE_ID = 'appDSjIPinS4TgaHF';
const TABLE = 'Registros Safety';
const FIELD_ID = 'ID del reporte (texto)';


const token = process.env.AIRTABLE_PAT;
if (!token) {
return { statusCode: 500, headers: common, body: JSON.stringify({ error: 'Server missing AIRTABLE_PAT' }) };
}


const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}?filterByFormula=${encodeURIComponent(`{${FIELD_ID}}='${id}'`)}&maxRecords=1`;


const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
const text = await res.text();


if (!res.ok) {
return { statusCode: res.status, headers: common, body: JSON.stringify({ error: 'Airtable error', detail: text }) };
}


const data = JSON.parse(text);
  
console.log("DEBUG FIELDS:", data.records[0].fields);

if (!data.records || data.records.length === 0) {
  return { statusCode: 404, headers: common, body: JSON.stringify({ error: 'Not found' }) };
}


// Devolver solo los fields, como antes
return { statusCode: 200, headers: common, body: JSON.stringify({ fields: data.records[0].fields }) };
} catch (err) {
return { statusCode: 500, headers: common, body: JSON.stringify({ error: err.message }) };
}
};

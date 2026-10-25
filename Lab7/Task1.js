const http = require('node:http');
const data = { students: [], teachers: [], attendance: [], marks: [] };
const nextId = { students: 1, teachers: 1, attendance: 1, marks: 1 };

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  let text = '';
  for await (const chunk of req) text += chunk;
  return JSON.parse(text || '{}');
}

const server = http.createServer(async (req, res) => {
  const parts = req.url.split('/').filter(Boolean);
  const moduleName = parts[0];
  const id = parts[1] ? Number(parts[1]) : null;
  const list = data[moduleName];
  if (!list) return send(res, 404, { error: 'Module not found' });

  if (req.method === 'GET') {
    if (id === null) return send(res, 200, list);
    const item = list.find((row) => row.id === id);
    return item ? send(res, 200, item) : send(res, 404, { error: 'Record not found' });
  }

  if (req.method === 'POST') {
    try {
      const fields = await readBody(req);
      const item = { ...fields, id: nextId[moduleName]++ };
      list.push(item);
      return send(res, 201, item);
    } catch {
      return send(res, 400, { error: 'Send valid JSON' });
    }
  }

  if (req.method === 'PUT') {
    if (id === null) return send(res, 400, { error: 'Record ID is required' });
    const index = list.findIndex((row) => row.id === id);
    if (index === -1) return send(res, 404, { error: 'Record not found' });
    try {
      list[index] = { ...(await readBody(req)), id };
      return send(res, 200, list[index]);
    } catch {
      return send(res, 400, { error: 'Send valid JSON' });
    }
  }

  if (req.method === 'DELETE') {
    if (id === null) return send(res, 400, { error: 'Record ID is required' });
    const index = list.findIndex((row) => row.id === id);
    if (index === -1) return send(res, 404, { error: 'Record not found' });
    return send(res, 200, list.splice(index, 1)[0]);
  }

  send(res, 405, { error: 'Method not allowed' });
});

server.listen(3004, () => console.log('Student API: http://localhost:3004'));

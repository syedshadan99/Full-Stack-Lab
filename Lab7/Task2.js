const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const dataFile = path.join(__dirname, 'ecommerce_data.json');

const startingData = {
  products: [
    { id: 1, name: 'Wireless Headphones', price: 4500, category: 'Electronics', stock: 20 },
    { id: 2, name: 'Smart Watch', price: 6500, category: 'Electronics', stock: 15 },
    { id: 3, name: 'Travel Backpack', price: 3200, category: 'Bags', stock: 25 },
    { id: 4, name: 'Running Sneakers', price: 5800, category: 'Fashion', stock: 12 },
    { id: 5, name: 'Sunglasses', price: 1800, category: 'Accessories', stock: 30 },
    { id: 6, name: 'Steel Water Bottle', price: 1200, category: 'Accessories', stock: 40 }
  ],
  users: [], cart: [], orders: []
};
const requiredFields = {
  products: ['name', 'price'], users: ['name', 'email'],
  cart: ['name', 'price', 'quantity'], orders: ['customerName', 'address', 'total']
};

function readData() {
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(startingData, null, 2));
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}
function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}
async function readBody(req) {
  let text = '';
  for await (const chunk of req) text += chunk;
  return JSON.parse(text || '{}');
}
function hasRequiredFields(resource, body) {
  return requiredFields[resource].every((field) => body[field] !== undefined && body[field] !== '');
}

const server = http.createServer(async (req, res) => {
  const parts = new URL(req.url, 'http://localhost').pathname.split('/').filter(Boolean);
  const resource = parts[1];
  const id = parts[2] ? Number(parts[2]) : null;
  if (parts[0] !== 'api' || !requiredFields[resource]) return send(res, 404, { error: 'API route not found' });
  const data = readData();
  const list = data[resource];

  if (req.method === 'GET') {
    if (id === null) return send(res, 200, list);
    const item = list.find((row) => row.id === id);
    return item ? send(res, 200, item) : send(res, 404, { error: 'Record not found' });
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req);
      if (!hasRequiredFields(resource, body)) return send(res, 400, { error: 'Required fields are missing' });
      const newId = list.length ? Math.max(...list.map((row) => row.id)) + 1 : 1;
      const item = { ...body, id: newId };
      list.push(item);
      saveData(data);
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
      const body = await readBody(req);
      if (!hasRequiredFields(resource, body)) return send(res, 400, { error: 'Required fields are missing' });
      list[index] = { ...body, id };
      saveData(data);
      return send(res, 200, list[index]);
    } catch {
      return send(res, 400, { error: 'Send valid JSON' });
    }
  }

  if (req.method === 'DELETE') {
    if (id === null) return send(res, 400, { error: 'Record ID is required' });
    const index = list.findIndex((row) => row.id === id);
    if (index === -1) return send(res, 404, { error: 'Record not found' });
    const removed = list.splice(index, 1)[0];
    saveData(data);
    return send(res, 200, removed);
  }

  send(res, 405, { error: 'Method not allowed' });
});

server.listen(3005, () => {
  readData();
  console.log('Shopora API: http://localhost:3005');
});

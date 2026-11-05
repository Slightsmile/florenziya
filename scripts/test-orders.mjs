// Test script for api/orders.js (ESM). Stubs googleapis via module.register.
import { register } from 'node:module';

globalThis.__appendCalls = [];

register('./googleapis-stub.mjs', import.meta.url);

function mockRes() {
  return {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(c) { this.statusCode = c; return this; },
    json(o) { this.body = o; return this; },
  };
}

function appendCalls() {
  return globalThis.__appendCalls;
}

async function test(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (e) {
    console.log(`FAIL ${name}: ${e.message}`);
  }
}

(async () => {
  delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  delete process.env.GOOGLE_PRIVATE_KEY;
  delete process.env.GOOGLE_SHEET_ID;

  const { default: handler } = await import('../api/orders.js');

  await test('missing env -> 503', async () => {
    const res = mockRes();
    await handler({ method: 'POST', body: {} }, res);
    if (res.statusCode !== 503) throw new Error(`expected 503 got ${res.statusCode}`);
  });

  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'x@x.iam.gserviceaccount.com';
  process.env.GOOGLE_PRIVATE_KEY = 'k';
  process.env.GOOGLE_SHEET_ID = 's';

  await test('GET -> 405', async () => {
    const res = mockRes();
    await handler({ method: 'GET', body: {} }, res);
    if (res.statusCode !== 405) throw new Error(`expected 405 got ${res.statusCode}`);
  });

  await test('tampered price ignored (server catalog price used)', async () => {
    globalThis.__appendCalls = [];
    const res = mockRes();
    await handler({
      method: 'POST',
      body: {
        customer: { name: 'Test Buyer', phone: '01712345678', address: 'House 1, Dhaka', location: 'inside' },
        location: 'inside',
        items: [{ id: 1, quantity: 2, price: 1, name: 'Hacked' }],
      },
    }, res);
    if (res.statusCode !== 201) throw new Error(`expected 201 got ${res.statusCode} ${JSON.stringify(res.body)}`);
    const row = appendCalls()[0].requestBody.values[0];
    // row: [orderId, dateTime, productName, qty, name, address, phone, location, charge, total]
    if (row[2] !== 'Arctic Edge') throw new Error(`name bypass: ${row[2]}`);
    if (row[9] !== 350 * 2 + 70) throw new Error(`total bypass: ${row[9]}`);
    if (!String(row[0]).startsWith('FLZ-')) throw new Error(`order id: ${row[0]}`);
  });

  await test('NaN / missing price does not bypass (price not needed)', async () => {
    globalThis.__appendCalls = [];
    const res = mockRes();
    await handler({
      method: 'POST',
      body: {
        customer: { name: 'A', phone: '+8801712345678', address: 'Some address here', location: 'outside' },
        location: 'outside',
        items: [{ id: 2, quantity: 1 }],
      },
    }, res);
    if (res.statusCode !== 201) throw new Error(`expected 201 got ${res.statusCode}`);
    const row = appendCalls()[0].requestBody.values[0];
    if (row[9] !== 400 + 130) throw new Error(`total: ${row[9]}`);
  });

  await test('phone with spaces/dashes normalized', async () => {
    globalThis.__appendCalls = [];
    const res = mockRes();
    await handler({
      method: 'POST',
      body: {
        customer: { name: 'B', phone: '017 1234-5678', address: 'Some address here', location: 'inside' },
        location: 'inside',
        items: [{ id: 6, quantity: 1 }],
      },
    }, res);
    if (res.statusCode !== 201) throw new Error(`expected 201 got ${res.statusCode} ${JSON.stringify(res.body)}`);
    if (appendCalls()[0].requestBody.values[0][6] !== '01712345678') throw new Error('phone not normalized');
  });

  await test('unknown product rejected', async () => {
    const res = mockRes();
    await handler({
      method: 'POST',
      body: {
        customer: { name: 'B', phone: '01712345678', address: 'Some address here', location: 'inside' },
        location: 'inside',
        items: [{ id: 9999, quantity: 1 }],
      },
    }, res);
    if (res.statusCode !== 400) throw new Error(`expected 400 got ${res.statusCode}`);
  });

  await test('quantity out of range rejected', async () => {
    const res = mockRes();
    await handler({
      method: 'POST',
      body: {
        customer: { name: 'B', phone: '01712345678', address: 'Some address here', location: 'inside' },
        location: 'inside',
        items: [{ id: 1, quantity: 99999 }],
      },
    }, res);
    if (res.statusCode !== 400) throw new Error(`expected 400 got ${res.statusCode}`);
  });

  await test('numeric phone crashes no longer leak 500 (400 instead)', async () => {
    const res = mockRes();
    await handler({
      method: 'POST',
      body: {
        customer: { name: 'B', phone: 123, address: 'Some address here', location: 'inside' },
        location: 'inside',
        items: [{ id: 1, quantity: 1 }],
      },
    }, res);
    if (res.statusCode === 500) throw new Error('unhandled 500');
    if (res.statusCode !== 400) throw new Error(`expected 400 got ${res.statusCode}`);
  });

  console.log('API smoke test complete');
})();

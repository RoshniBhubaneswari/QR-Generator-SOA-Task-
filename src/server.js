const express = require('express');
const { forApp, appIdFromKey } = require('./index');

const app = express();
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// Identify the calling application via API key
app.use('/api', (req, res, next) => {
  const appId = appIdFromKey(req.get('x-api-key'));
  if (!appId) return res.status(401).json({ error: 'invalid api key' });
  req.appId = appId;
  next();
});

// POST /api/qr  body: { input: {...}, format?: 'png'|'svg'|'dataurl' }
app.post('/api/qr', async (req, res) => {
  try {
    const { input = {}, format = 'png' } = req.body;
    const out = await forApp(req.appId).generate(input, { format });
    if (format === 'png') return res.type('png').send(out.data);
    if (format === 'svg') return res.type('image/svg+xml').send(out.data);
    res.json({ payload: out.payload, dataUrl: out.data });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// POST /api/qr/verify  body: { payload: "<scanned string>" }
app.post('/api/qr/verify', (req, res) => {
  try {
    res.json(forApp(req.appId).verify(req.body.payload));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
if (require.main === module) app.listen(port, () => console.log(`QR service on :${port}`));
module.exports = app;

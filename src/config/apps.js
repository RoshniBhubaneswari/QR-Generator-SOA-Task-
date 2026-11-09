/**
 * One entry per consuming application.
 * Same engine, different adapter + rendering + security settings.
 */
module.exports = {
  'banking-app': {
    apiKey: process.env.BANK_KEY || 'bank-demo-key',
    adapter: 'upi',
    adapterOptions: { payeeVpa: 'merchant@okbank', payeeName: 'Demo Bank Merchant' },
    qr: { errorCorrectionLevel: 'H', width: 400, color: { dark: '#0b3d91' } },
    formats: ['png', 'svg'],
  },
  'shop-app': {
    apiKey: process.env.SHOP_KEY || 'shop-demo-key',
    adapter: 'signedOrder',
    adapterOptions: {
      baseUrl: 'https://shop.example.com',
      secret: process.env.SHOP_SECRET || 'change-me-in-prod',
      ttlSeconds: 600,
    },
    qr: { errorCorrectionLevel: 'M', width: 300, color: { dark: '#ff9900' } },
    formats: ['png', 'svg', 'dataurl'],
  },
  'marketing-site': {
    apiKey: process.env.MKT_KEY || 'mkt-demo-key',
    adapter: 'url',
    adapterOptions: { allowedHosts: ['example.com'] },
    qr: { errorCorrectionLevel: 'L', width: 256 },
    formats: ['svg', 'dataurl'],
  },
};

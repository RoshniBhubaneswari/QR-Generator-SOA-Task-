const QRCode = require('qrcode');

const DEFAULT_QR = {
  errorCorrectionLevel: 'M',
  width: 300,
  margin: 2,
  color: { dark: '#000000', light: '#ffffff' },
};

/**
 * App-agnostic QR engine. Knows nothing about payments/orders.
 * An adapter decides WHAT goes inside the QR; this class decides HOW it's rendered.
 */
class QRService {
  constructor({ appId, adapter, qr = {}, formats = ['png', 'svg', 'dataurl'] }) {
    if (!adapter) throw new Error('adapter is required');
    this.appId = appId;
    this.adapter = adapter;
    this.qr = { ...DEFAULT_QR, ...qr, color: { ...DEFAULT_QR.color, ...(qr.color || {}) } };
    this.formats = formats;
  }

  async generate(input, { format = 'png', qr: overrides = {} } = {}) {
    if (!this.formats.includes(format)) {
      throw new Error(`format "${format}" not allowed for app "${this.appId}"`);
    }
    this.adapter.validate(input);
    const payload = this.adapter.build(input);
    const opts = { ...this.qr, ...overrides };

    let data;
    if (format === 'png') data = await QRCode.toBuffer(payload, { ...opts, type: 'png' });
    else if (format === 'svg') data = await QRCode.toString(payload, { ...opts, type: 'svg' });
    else if (format === 'dataurl') data = await QRCode.toDataURL(payload, opts);
    else throw new Error(`unsupported format "${format}"`);

    return { appId: this.appId, adapter: this.adapter.name, format, payload, data };
  }

  /** Verify a scanned payload (only for adapters that support it, e.g. signed tokens). */
  verify(scanned) {
    if (typeof this.adapter.verify !== 'function') {
      throw new Error(`adapter "${this.adapter.name}" does not support verify`);
    }
    return this.adapter.verify(scanned);
  }
}

module.exports = QRService;

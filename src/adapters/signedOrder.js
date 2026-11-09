const crypto = require('crypto');

/**
 * E-commerce order QR (payment / pickup / delivery handoff).
 * Output: https://shop.example/q/<orderId>?exp=<unix>&sig=<hmac>
 * Tamper-proof + expiring, verifiable server-side.
 */
module.exports = function signedOrderAdapter({ baseUrl, secret, ttlSeconds = 900 }) {
  if (!baseUrl || !secret) throw new Error('signedOrder adapter needs baseUrl and secret');
  const sign = (orderId, exp) =>
    crypto.createHmac('sha256', secret).update(`${orderId}.${exp}`).digest('hex').slice(0, 32);

  return {
    name: 'signedOrder',
    validate({ orderId }) {
      if (!orderId) throw new Error('orderId is required');
    },
    build({ orderId }) {
      const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
      return `${baseUrl}/q/${encodeURIComponent(orderId)}?exp=${exp}&sig=${sign(orderId, exp)}`;
    },
    verify(scanned) {
      const u = new URL(scanned);
      const orderId = decodeURIComponent(u.pathname.split('/').pop());
      const exp = Number(u.searchParams.get('exp'));
      const sig = u.searchParams.get('sig') || '';
      const expected = sign(orderId, exp);
      const ok =
        sig.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
      if (!ok) return { valid: false, reason: 'bad signature' };
      if (Date.now() / 1000 > exp) return { valid: false, reason: 'expired' };
      return { valid: true, orderId };
    },
  };
};

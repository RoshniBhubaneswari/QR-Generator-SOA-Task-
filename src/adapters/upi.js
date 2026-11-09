/** Banking / UPI payment QR. Output: upi://pay?pa=...&pn=...&am=...&cu=INR */
module.exports = function upiAdapter({ payeeVpa, payeeName, currency = 'INR' }) {
  if (!payeeVpa || !payeeName) throw new Error('upi adapter needs payeeVpa and payeeName');
  return {
    name: 'upi',
    validate({ amount }) {
      if (amount !== undefined && !(Number(amount) > 0)) throw new Error('amount must be > 0');
    },
    build({ amount, note, txnRef }) {
      const p = new URLSearchParams({ pa: payeeVpa, pn: payeeName, cu: currency });
      if (amount !== undefined) p.set('am', Number(amount).toFixed(2));
      if (note) p.set('tn', note);
      if (txnRef) p.set('tr', txnRef);
      return `upi://pay?${p.toString()}`;
    },
  };
};

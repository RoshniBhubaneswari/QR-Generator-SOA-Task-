const fs = require('fs');
const { forApp } = require('./index');

(async () => {
  fs.mkdirSync('out', { recursive: true });

  const bank = await forApp('banking-app').generate(
    { amount: 499.5, note: 'Invoice 42', txnRef: 'TXN1001' }, { format: 'png' });
  fs.writeFileSync('out/bank.png', bank.data);
  console.log('bank  :', bank.payload);

  const shopSvc = forApp('shop-app');
  const shop = await shopSvc.generate({ orderId: 'ORD-7781' }, { format: 'png' });
  fs.writeFileSync('out/shop.png', shop.data);
  console.log('shop  :', shop.payload);
  console.log('verify:', shopSvc.verify(shop.payload));
  console.log('tamper:', shopSvc.verify(shop.payload.replace('ORD-7781', 'ORD-9999')));

  const mkt = await forApp('marketing-site').generate({ url: 'https://example.com/promo' }, { format: 'svg' });
  fs.writeFileSync('out/mkt.svg', mkt.data);
  console.log('mkt   :', mkt.payload);
})();

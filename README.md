# QR Service

One QR engine, many applications. Each app = config entry + adapter.

```
src/core/QRService.js     rendering (png/svg/dataurl), app-agnostic
src/adapters/*            decide WHAT goes in the QR (upi, signedOrder, url)
src/config/apps.js        per-app adapter, styling, error-correction, allowed formats
src/server.js             REST API (x-api-key identifies the app)
```

## Run
    npm install && npm run demo      # writes out/*.png|svg
    npm start                        # REST API on :3000

## API
    curl -X POST localhost:3000/api/qr -H "x-api-key: bank-demo-key" \
      -H "content-type: application/json" \
      -d '{"input":{"amount":499.5,"note":"Invoice 42"},"format":"png"}' -o bank.png

    curl -X POST localhost:3000/api/qr/verify -H "x-api-key: shop-demo-key" \
      -H "content-type: application/json" -d '{"payload":"<scanned url>"}'

## Add a new app
1. Add an entry in `src/config/apps.js`.
2. Need a new payload format? Add `src/adapters/yourAdapter.js` exporting `(options) => ({name, validate, build, verify?})` and register it in `adapters/index.js`.

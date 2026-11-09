const QRService = require('./core/QRService');
const adapters = require('./adapters');
const apps = require('./config/apps');

const cache = new Map();

/** Get a configured QRService for an application id. */
function forApp(appId) {
  if (cache.has(appId)) return cache.get(appId);
  const cfg = apps[appId];
  if (!cfg) throw new Error(`unknown app "${appId}"`);
  const factory = adapters[cfg.adapter];
  if (!factory) throw new Error(`unknown adapter "${cfg.adapter}"`);
  const svc = new QRService({
    appId, adapter: factory(cfg.adapterOptions), qr: cfg.qr, formats: cfg.formats,
  });
  cache.set(appId, svc);
  return svc;
}

function appIdFromKey(key) {
  return Object.keys(apps).find((id) => apps[id].apiKey === key);
}

module.exports = { QRService, forApp, appIdFromKey };

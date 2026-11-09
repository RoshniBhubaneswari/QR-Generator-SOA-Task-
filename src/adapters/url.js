/** Plain URL / text QR (marketing, links, tickets). */
module.exports = function urlAdapter({ allowedHosts = [] } = {}) {
  return {
    name: 'url',
    validate({ url }) {
      const u = new URL(url); // throws if invalid
      if (allowedHosts.length && !allowedHosts.includes(u.host)) {
        throw new Error(`host ${u.host} not allowed`);
      }
    },
    build({ url }) { return url; },
  };
};

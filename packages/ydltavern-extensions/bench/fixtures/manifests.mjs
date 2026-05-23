export const fiftyManifests = Array.from({ length: 50 }, (_, i) => ({
  display_name: `Ext ${i}`,
  loading_order: i,
  requires: [],
  optional: [],
  js: 'index.js',
  version: '1.0.0',
  author: 'test',
}));

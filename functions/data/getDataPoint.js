const { getNamespace } = require('@cloudflare/kv-namespace');
const myKVNamespace = getNamespace('dataPoints');

const value = await myKVNamespace.get('my-key');
console.log(value);

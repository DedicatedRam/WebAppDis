export async function onRequest(context){
const { getNamespace } = require('@cloudflare/kv-namespace');
const myKVNamespace = getNamespace('dataPoints');

const value = await myKVNamespace.get('1');
console.log(value);
return new Response(value);
}
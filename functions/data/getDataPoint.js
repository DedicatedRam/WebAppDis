export async function onRequest(context){
const { getNamespace } = require('@cloudflare/kv-asset-handler');
const myKVNamespace = getNamespace('dataPoints');

const value = await myKVNamespace.get('1');
console.log(value);
return new Response(value);
}


// import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

// // Initialize the KV namespace
// const namespace = 'dataPoints';
// const kv = await KVNamespace.create(namespace);

// // Get a value from the KV store
// const key = '1';
// const value = await kv.get(key);

// // Log the value to the console
// console.log(value);
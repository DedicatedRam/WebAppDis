export async function onRequest(context) {
  let kList = (await context.env.dataPoints.list()).keys;
  let numberInList = kList.length;

  let body = await readRequestBody(await context.request);

  console.log(await context);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
  return new Response(JSON.stringify(context.env), { headers: corsHeaders });
}

async function readRequestBody(request) {
  console.log(await request.json());
  return JSON.stringify(await request.json());

}

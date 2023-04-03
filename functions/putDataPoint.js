export async function onRequest(context) {
  let kList = (await context.env.dataPoints.list()).keys;
  let numberInList = kList.length;

  console.log(await context);
  //let res = await context.env.dataPoints.put(numberInList, body);
  const body = await context.text()
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
  await context.env.dataPoints.put(numberInList, body);
  return new  Response(body, { status: 200, headers: corsHeaders });
  //return new Response(JSON.stringify(context.env), { headers: corsHeaders });
}

async function readRequestBody(request) {
  console.log(await request.json());
  return JSON.stringify(await request.json());

}

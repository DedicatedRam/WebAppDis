export async function onRequest(context) {
  let kList = (await context.env.dataPoints.list()).keys;
  let numberInList = kList.length;

  console.log(await context);
  let res = await context.env.dataPoints.put(numberInList, body);
  console.log(res);
  const headers = {
    Allow: 'OPTIONS, GET, HEAD, POST',
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json',
  }
  await context.env.dataPoints.put(numberInList, body);
  return new  Response(body, { status: 200, headers: headers });
  //return new Response(JSON.stringify(context.env), { headers: corsHeaders });
}

async function readRequestBody(request) {
  console.log(await request.json());
  return JSON.stringify(await request.json());

}

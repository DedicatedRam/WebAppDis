export async function onRequest(context) {
    let kList = (await context.env.dataPoints.list()).keys;
    let jsnList = [];
    alert(await context.request.json());
    for (let index = 0; index < kList.length; index++) {
        let id = kList[index].name;
        let element = JSON.parse(await context.env.dataPoints.get(id));
        jsnList.push(element);
    }
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
      }
    return new Response(JSON.stringify(jsnList), {headers: corsHeaders}
    );
}

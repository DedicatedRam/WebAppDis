export async function onRequest(context) {
    let kList = (await context.env.dataPoints.list()).keys;
    let jsnList = [];

    const filterParameter = (await context.request.json()).filterParameter;

    for (let index = 0; index < kList.length; index++) {
        let id = kList[index].name;
        let element = JSON.parse(await context.env.dataPoints.get(id));
        let coords = element.geometry.coordinates;
        if (
            coords[0] > filterParameter[0] &&
            coords[0] < filterParameter[1] &&
            coords[1] > filterParameter[2] &&
            coords[1] < filterParameter[3])
        {jsnList.push(element);}
    }
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
      }
    return new Response(JSON.stringify(jsnList), {headers: corsHeaders}
    );
}

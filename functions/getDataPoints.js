export async function onRequest(context) {
    const filterParameter = await context.request.json();
    const kList = (await context.env.dataPoints.list()).keys;
    const jsnList = [];
    for (let index = 0; index < kList.length; index++) {
        let id = kList[index].name;
        const element = JSON.parse(await context.env.dataPoints.get(id));
        const coords = element.geometry.coordinates;
        console.log(element);
        if (
            coords[0] > filterParameter.SWX &&
            coords[0] < filterParameter.NEX &&
            coords[1] > filterParameter.SWY &&
            coords[1] < filterParameter.NEY
        ) {
            jsnList.push(element);
        }
    }

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
    };

    return new Response(JSON.stringify(jsnList), { headers: corsHeaders });
}

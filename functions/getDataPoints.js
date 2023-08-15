export async function onRequest(context) {
    //const filterParameter = await context.request.json();
    const kList = (await context.env.dataPoints.list()).keys;
    const jsnList = [];
    for (const id of kList) {
        const element = JSON.parse(await context.env.dataPoints.get(id));
        const coords = element.geometry.coordinates;
        //console.log(element);
        // if (
        //     coords[0] > filterParameter[0] &&
        //     coords[0] < filterParameter[1] &&
        //     coords[1] > filterParameter[2] &&
        //     coords[1] < filterParameter[3]
        // ) {
            jsnList.push(element);
        //}
    }

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
    };

    return new Response(JSON.stringify(jsnList), { headers: corsHeaders });
}

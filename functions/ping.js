export async function onRequest(context) {
    // await context.env.dataPoints.put(6, Date.now());
    let envkeys = JSON.stringify(await context.env.dataPoints);
    let kList = await context.env.dataPoints.list().keys;
    let keyStr = kList+"";
    //console.log(keyStr);
    return new Response(`keys: ${envkeys}`);
}

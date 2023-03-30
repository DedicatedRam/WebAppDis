export async function onRequest(context) {
    // await context.env.dataPoints.put(6, Date.now());
    let kList = await context.env.dataPoints.list().keys;
    let keyStr = kList+"";
    //console.log(keyStr);
    return new Response(`keys: ${kList}`);
}

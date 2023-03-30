export async function onRequest(context) {
    // await context.env.dataPoints.put(6, Date.now());
    let kList = await context.env.dataPoints.list().keys;
    let keyStr = kList+"";
    return new Response(`keys: ${keyStr}`);
}

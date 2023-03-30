export async function onRequest(context) {
    await context.env.dataPoints.put(6, Date.now());
    let keyStr = Array.from(context.env.dataPoints.list().keys).join(",");
    return new Response(`keys: ${keyStr}`);
}

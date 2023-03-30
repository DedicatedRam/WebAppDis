export async function onRequest(context) {
    await dataPoints.put(6, Date.now());
    return new Response(await context.env.dataPoints.list().keys);
}

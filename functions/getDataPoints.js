export async function onRequest(context) {
    let kList = await context.env.dataPoints.list();
    return new Response(JSON.stringify(kList));
}

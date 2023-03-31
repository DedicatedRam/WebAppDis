export async function onRequest(context) {
    let kList = await context.env.dataPoints.list();
    let jsnList = [];
    for (let index = 0; index < kList.length; index++) {
        const element = context.env.dataPoints.get(kList[index]);
        jsnList.push(element);
    }
    console.log(JSON.stringify(jsnList));
    return new Response(JSON.stringify(jsnList));
}

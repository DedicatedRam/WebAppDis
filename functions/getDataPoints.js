export async function onRequest(context) {
    let kList = (await context.env.dataPoints.list()).keys;
    let jsnList = [];
    for (let index = 0; index < kList.length; index++) {
        let id = kList[index].name;
        let element = JSON.parse(await context.env.dataPoints.get(id));
        jsnList.push(element);
    }
    return new Response(JSON.stringify(jsnList));
}

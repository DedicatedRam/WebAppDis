export async function onRequest(context) {
    let kList = (await context.env.dataPoints.list()).keys;
    let jsnList = [];
    //let test = await JSON.parse(context.env.dataPoints.get(1));
    for(key of kList){
        const element = JSON.parse(await context.env.dataPoints.get(key));
        jsnList.push(element);
    }
    console.log(JSON.stringify(jsnList));
    return new Response(JSON.stringify(kList));
}

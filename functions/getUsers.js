export async function onRequest(context) {
    const param = await context.request.json();
    let kList = (await context.env.users.list()).keys;
    for (let index = 0; index < kList.length; index++) {
        let key = kList[index].name;
        let value = JSON.parse(await context.env.users.get(key));
        
    }
    return new Response(JSON.stringify(kList));
}

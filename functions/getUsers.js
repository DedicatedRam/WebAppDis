export async function onRequest(context) {
    const param = await context.request.json();
    let kList = (await context.env.users.list()).keys;
    let tst = [];
    for (let index = 0; index < kList.length; index++) {
        let key = kList[index].name;
        let value = JSON.parse(await context.env.users.get(key));
        tst.push(value);
    }
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
    };

    return new Response(JSON.stringify(tst), { headers: corsHeaders });
}

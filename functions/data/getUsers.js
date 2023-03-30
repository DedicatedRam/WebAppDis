export async function onRequest(context) {
    let kList = await context.env.users.list();
    return new Response(JSON.stringify(kList));
}

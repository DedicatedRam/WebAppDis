export async function getAllUsers(context){
    let UserList = await context.env.users.list();
    return new Response(JSON.stringify(UserList));
}
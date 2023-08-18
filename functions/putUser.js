export async function onRequest(context) {
    try {
      if (context.request.method === 'OPTIONS') {
        // respond to preflight request
        const headers = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
        return new Response(null, { status: 204, headers: headers });
      } else if (context.request.method === 'POST') {
            let kList = (await context.env.users.list()).keys;
            let numberInList = kList.length;
            const body = await context.request.json();
            await context.env.users.put(numberInList, body);
            const headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            }
            var retMsg = {
            msg : "Success"
            } 
            return new Response(JSON.stringify(retMsg), { status: 201, headers: headers });
      } else {
        // respond with method not allowed
        const headers = {
          'Allow': 'POST',
          'Access-Control-Allow-Origin': '*',
        }
        return new Response(null, { status: 405, headers: headers });
      }
    } catch (e) {
      console.log(e)
      throw new Error(`temp is ` + body);
    }
  }
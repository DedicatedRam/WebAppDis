export async function onRequest(context) {
  let temp=null;
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
      let kList = (await context.env.dataPoints.list()).keys;
      let numberInList = kList.length;

      const body = await context.request.json();
      temp = await context.request;
      console.log(body);

      let res = await context.env.dataPoints.put(numberInList, body);
      console.log(res);

      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    
      return new Response(JSON.stringify(res), { status: 200, headers: headers });
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






// export async function onRequest(context) {
//   let kList = (await context.env.dataPoints.list()).keys;
//   let numberInList = kList.length;

//   console.log(await context);
//   let res = await context.env.dataPoints.put(numberInList, body);
//   console.log(res);
//   const headers = {
//     Allow: 'OPTIONS, GET, HEAD, POST',
//     'Access-Control-Allow-Origin': '*',
//     'Content-type': 'application/json',
//   }
//   await context.env.dataPoints.put(numberInList, body);
//   return new  Response(res, { status: 200, headers: headers });
// }


// export default async function gatherResponse(response) {
//   const { headers } = response;
//   const contentType = headers.get("content-type") || "";
//   if (contentType.includes("application/json")) {
//     return JSON.stringify(await response.json());
//   } else if (contentType.includes("application/text")) {
//     return response.text();
//   } else if (contentType.includes("text/html")) {
//     return response.text();
//   } else {
//     return response.text();
//   }
// }

// const init = {
//   body: JSON.stringify(body),
//   method: "PUT",
//   headers: {
//     "content-type": "application/json;charset=UTF-8",
//   },
// };
// const response = await fetch(url, init);
// const results = await gatherResponse(response);
// return new Response(results, init);

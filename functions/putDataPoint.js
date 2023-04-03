export async function onRequest(context) {
  if (context.request.method === 'POST') {
    const body = await context.request.json();
    const kList = (await context.env.dataPoints.list()).keys;
    const numberInList = kList.length;

    console.log(body);

    const res = await context.env.dataPoints.put(numberInList, JSON.stringify(body));
    console.log(res);

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json',
    };

    return new Response(JSON.stringify({ message: 'Data stored successfully' }), { status: 200, headers: headers });
  } else {
    return new Response('Method Not Allowed', { status: 405 });
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

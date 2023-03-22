addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const value = await dataPoints.get("0");
    if (value === null) {
      return new Response("Value not found", { status: 404 });
    }
  
    return new Response(value);
  }
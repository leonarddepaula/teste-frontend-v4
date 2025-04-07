export default defineEventHandler((event) => {
  const { url, method } = event.node.req;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url}`);
})
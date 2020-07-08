import { serveTLS } from "https://deno.land/std/http/server.ts";

const body = new TextEncoder().encode("Hello HTTPS");
const options = {
  hostname: "localhost",
  port: 443,
  certFile: "./certificate.crt",
  keyFile: "./private.key",
};
console.log("Listening...")
// Top-level await supported
for await (const req of serveTLS(options)) {
  req.respond({ body });
}
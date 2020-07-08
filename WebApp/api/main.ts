/*import { serveTLS } from "https://deno.land/std/http/server.ts";

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
}*/

import { serve } from "https://deno.land/std@0.60.0/http/server.ts";
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
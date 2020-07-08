import { serve } from "https://deno.land/std@0.60.0/http/server.ts";
const s = serve({ port: 8000, hostname: "0.0.0.0"});
console.log("http://0.0.0.0:8000/");
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
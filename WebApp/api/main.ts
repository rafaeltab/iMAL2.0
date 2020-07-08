import { serve } from "https://deno.land/std@0.60.0/http/server.ts";
const s = serve({ port: 80, hostname: "0.0.0.0" });

console.log("http://imal.ml/");
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
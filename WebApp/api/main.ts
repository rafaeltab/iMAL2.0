import { serve } from "https://deno.land/std@0.60.0/http/server.ts";
const s = serve({ port: 80, hostname: "imal.ml" });

console.log("http://imal.ml/");
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
import { Application } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import "jsr:@std/dotenv/load";

import { todosRouter } from "./routes/todos.ts";
import { connectDB } from "./helpers/db_client.ts";

const denoPort = Deno.env.get("DENO_SERVER_PORT");

const app = new Application();

app.use(async ({ request, response }, next) => {
  response.headers.set("Accept", "application/json");
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PATCH, DELETE"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  if (request.method === "OPTIONS") {
    response.status = 200;
  }
  await next();
});

app.use(todosRouter.routes());
app.use(todosRouter.allowedMethods());

connectDB().then(() => app.listen({ port: Number(denoPort) }));

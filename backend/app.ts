import { Application } from "https://deno.land/x/oak@v16.1.0/mod.ts";

import { todosRouter } from "./routes/todos.ts";

const app = new Application();

app.use(todosRouter.routes());
app.use(todosRouter.allowedMethods())

await app.listen({ port: 8000 });

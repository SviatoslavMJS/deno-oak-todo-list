import { Router } from "https://deno.land/x/oak@v16.1.0/mod.ts";

import { Todo, UpdateRequestBody } from "./types.ts";

const todos: Todo[] = [];

const todosRouter = new Router();

todosRouter.get("/todos/:todoId", ({ params, response }) => {
  const { todoId } = params;

  const todo = todos.find(({ id }) => id === todoId);
  if (!todo) {
    response.status = 404;
    response.body = { message: "Not found.", todo: null };
  } else {
    response.status = 200;
    response.body = { message: "Success.", todo: todo ?? null };
  }
});

todosRouter.get("/todos", (ctx) => {
  ctx.response.body = { todos };
});

todosRouter.post("/todos", async ({ request, response }) => {
  const { body } = request;
  const { text = "To do something" }: UpdateRequestBody = body.has
    ? await body.json()
    : {};

  const newTodo: Todo = {
    text: text,
    id: new Date().toISOString(),
  };

  todos.unshift(newTodo);
  response.status = 201;
  response.body = { message: "Created successfully.", todo: newTodo };
});

todosRouter.patch("/todos/:todoId", async ({ params, response, request }) => {
  const { todoId } = params;
  const { body } = request;
  const { text }: UpdateRequestBody = body.has ? await body.json() : {};

  const todoIndex = todos.findIndex(({ id }) => id === todoId);
  if (todoIndex < 0) {
    response.status = 404;
    response.body = { message: "Not found.", todo: null };
  } else {
    todos[todoIndex].text = text;
    response.status = 200;
    response.body = {
      message: "Successfully updated.",
      todo: todos[todoIndex],
    };
  }
});

todosRouter.delete("/todos/:todoId", ({ params, response }) => {
  const { todoId } = params;

  const todoIndex = todos.findIndex(({ id }) => id === todoId);
  if (todoIndex < 0) {
    response.status = 404;
    response.body = { message: "Not found.", todo: null };
  } else {
    const deleted = todos.splice(todoIndex, 1);
    response.status = 200;
    response.body = {
      message: "Successfully deleted.",
      todo: deleted,
    };
  }
});

export { todosRouter };

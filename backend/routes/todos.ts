import { Router } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { Document, InsertOneResult, ObjectId } from "npm:mongodb@6";

import { getDBCollection } from "../helpers/db_client.ts";
import { UpdateRequestBody } from "./types.ts";

const todosRouter = new Router();

todosRouter.get("/todos", async ({ response }) => {
  const todos = await getDBCollection("todos").find();
  if (!todos) {
    response.status = 500;
    response.body = { message: "Failed to fetch.", todos: [] };
  } else {
    const todosData = [];
    for await (const item of todos) {
      todosData.push({ id: item._id.toString(), text: item.text });
    }

    response.status = 200;
    response.body = {
      todos: todosData,
      message: "Success.",
    };
  }
});

todosRouter.post("/todos", async ({ request, response }) => {
  const { body } = request;
  const { text = "" }: UpdateRequestBody = body.has ? await body.json() : {};

  const result: InsertOneResult<Document> = await getDBCollection(
    "todos"
  ).insertOne({
    text: text,
  });

  response.status = 201;
  response.body = {
    message: "Created successfully.",
    todo: { id: result.insertedId.toString(), text },
  };
});

todosRouter.patch("/todos/:todoId", async ({ params, response, request }) => {
  const { todoId } = params;
  const { body } = request;
  const { text }: UpdateRequestBody = body.has ? await body.json() : {};
  const collection = getDBCollection("todos");
  const query = { _id: { $eq: new ObjectId(todoId) } };

  const todo = await collection.findOne(query);

  if (!todo) {
    response.status = 404;
    response.body = { message: "Not found.", todo: null };
  } else {
    await collection.updateOne(query, { $set: { text } });
    response.status = 200;
    response.body = {
      todo: { id: todoId, text },
      message: "Updated successfully.",
    };
  }
});

todosRouter.delete("/todos/:todoId", async ({ params, response }) => {
  const { todoId } = params;

  const collection = getDBCollection("todos");
  const query = { _id: { $eq: new ObjectId(todoId) } };

  const todo = await collection.findOne(query);

  if (!todo) {
    response.status = 404;
    response.body = { message: "Not found.", todo: null };
  } else {
    await collection.deleteOne(query);
    response.status = 200;
    response.body = {
      todo: { id: todoId, text: todo.text },
      message: "Deleted successfully.",
    };
  }
});

export { todosRouter };

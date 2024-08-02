type Todo = {
  id: string;
  text: string;
};

type UpdateRequestBody = Pick<Todo, "text">;

export type { Todo, UpdateRequestBody };

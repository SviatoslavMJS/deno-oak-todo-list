interface CommonProps {
  text: string;
}

type Todo = CommonProps & {
  id: string;
};

type UpdateRequestBody = Pick<Todo, "text">;

export type { Todo, UpdateRequestBody };

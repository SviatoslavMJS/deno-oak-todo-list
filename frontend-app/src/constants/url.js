export const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const todos = "/todos";

export const Routes = {
  Todos: {
    Index: todos,
    Details: `${todos}/:todoId`,
  },
};

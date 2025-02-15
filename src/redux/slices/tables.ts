import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';

export const TODO_TABLE_ID = 'd83e5949-4852-4b09-bb1d-9d658b22b26c';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  owner: string;
  shared_with: string[];
  list: string;
  labels: string[];
  due_date: string;
  priority: string;
  time_spent: number;
}

interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await axiosInstance.get(`/table/${TODO_TABLE_ID}/rows`);
  return response.data.rows.map((row: any) => ({
    id: row.id,
    text: row.fields.text,
    completed: row.fields.completed,
    owner: row.fields.owner,
    shared_with: row.fields.shared_with,
    list: row.fields.list,
    labels: row.fields.labels,
    due_date: row.fields.due_date,
    priority: row.fields.priority,
    time_spent: row.fields.time_spent,
  }));
});

export const addTodo = createAsyncThunk('todos/addTodo', async (todo: Omit<Todo, 'id'>) => {
  const response = await axiosInstance.post(`/table/${TODO_TABLE_ID}/rows`, {
    fields: todo
  });
  return {
    id: response.data.id,
    ...todo
  };
});

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, ...fields }: Partial<Todo> & { id: string }) => {
    const response = await axiosInstance.patch(`/table/${TODO_TABLE_ID}/rows/${id}`, {
      fields
    });
    return {
      id,
      ...fields
    };
  }
);

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: string) => {
  await axiosInstance.delete(`/table/${TODO_TABLE_ID}/rows/${id}`);
  return id;
});

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      })
      // Add Todo
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      // Delete Todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      });
  },
});

export default todosSlice.reducer;
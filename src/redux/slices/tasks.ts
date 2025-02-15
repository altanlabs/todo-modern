import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';

export const TASK_TABLE_ID = 'd83e5949-4852-4b09-bb1d-9d658b22b26c';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  owner: string;
  shared_with: string[];
  list: string;
  labels: string[];
  due_date: string | null;
  priority: 'High' | 'Medium' | 'Low' | null;
  time_spent: number;
}

interface TaskState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (listId: string) => {
    const response = await axiosInstance.get(`/table/${TASK_TABLE_ID}/rows`, {
      params: {
        filter: {
          list: listId
        }
      }
    });
    return response.data.rows || [];
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Partial<Task>) => {
    const response = await axiosInstance.post(`/table/${TASK_TABLE_ID}/rows`, {
      fields: {
        text: task.text,
        completed: false,
        list: task.list,
        owner: task.owner,
        priority: task.priority,
        due_date: task.due_date,
      }
    });
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    const response = await axiosInstance.patch(`/table/${TASK_TABLE_ID}/rows/${id}`, {
      fields: updates
    });
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string) => {
    await axiosInstance.delete(`/table/${TASK_TABLE_ID}/rows/${id}`);
    return id;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((row: any) => ({
          id: row.id,
          text: row.fields.text,
          completed: row.fields.completed,
          owner: row.fields.owner?.[0],
          shared_with: row.fields.shared_with || [],
          list: row.fields.list?.[0],
          labels: row.fields.labels || [],
          due_date: row.fields.due_date,
          priority: row.fields.priority,
          time_spent: row.fields.time_spent || 0
        }));
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload
          };
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
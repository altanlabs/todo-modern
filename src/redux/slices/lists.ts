import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';

export const LIST_TABLE_ID = '5b83e2bb-f93a-413b-85e3-3c9461cf6af1';

interface List {
  id: string;
  name: string;
  board: string;
  created_by: string;
}

interface ListState {
  items: List[];
  loading: boolean;
  error: string | null;
}

const initialState: ListState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async (boardId: string) => {
    const response = await axiosInstance.get(`/table/${LIST_TABLE_ID}/rows`, {
      params: {
        filter: {
          board: boardId
        }
      }
    });
    return response.data.rows || [];
  }
);

export const createList = createAsyncThunk(
  'lists/createList',
  async ({ name, boardId }: { name: string; boardId: string }) => {
    const response = await axiosInstance.post(`/table/${LIST_TABLE_ID}/rows`, {
      fields: {
        name,
        board: boardId
      }
    });
    return response.data;
  }
);

export const updateList = createAsyncThunk(
  'lists/updateList',
  async ({ id, name }: { id: string; name: string }) => {
    const response = await axiosInstance.patch(`/table/${LIST_TABLE_ID}/rows/${id}`, {
      fields: {
        name
      }
    });
    return response.data;
  }
);

export const deleteList = createAsyncThunk(
  'lists/deleteList',
  async (id: string) => {
    await axiosInstance.delete(`/table/${LIST_TABLE_ID}/rows/${id}`);
    return id;
  }
);

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Lists
      .addCase(fetchLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((row: any) => ({
          id: row.id,
          name: row.fields.name,
          board: row.fields.board?.[0],
          created_by: row.fields.created_by?.[0]
        }));
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch lists';
      })
      // Create List
      .addCase(createList.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update List
      .addCase(updateList.fulfilled, (state, action) => {
        const index = state.items.findIndex((list) => list.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete List
      .addCase(deleteList.fulfilled, (state, action) => {
        state.items = state.items.filter((list) => list.id !== action.payload);
      });
  },
});

export default listsSlice.reducer;
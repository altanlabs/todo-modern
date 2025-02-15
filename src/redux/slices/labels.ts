import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';

export const LABEL_TABLE_ID = 'd35e82f7-309d-43c5-8b07-0529f9ce6723';

interface Label {
  id: string;
  name: string;
  color: string;
  created_by: string;
}

interface LabelState {
  items: Label[];
  loading: boolean;
  error: string | null;
}

const initialState: LabelState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchLabels = createAsyncThunk('labels/fetchLabels', async () => {
  const response = await axiosInstance.get(`/table/${LABEL_TABLE_ID}/rows`);
  return response.data.rows || [];
});

export const createLabel = createAsyncThunk(
  'labels/createLabel',
  async ({ name, color }: { name: string; color: string }) => {
    const response = await axiosInstance.post(`/table/${LABEL_TABLE_ID}/rows`, {
      fields: {
        name,
        color
      }
    });
    return response.data;
  }
);

export const updateLabel = createAsyncThunk(
  'labels/updateLabel',
  async ({ id, name, color }: { id: string; name: string; color: string }) => {
    const response = await axiosInstance.patch(`/table/${LABEL_TABLE_ID}/rows/${id}`, {
      fields: {
        name,
        color
      }
    });
    return response.data;
  }
);

export const deleteLabel = createAsyncThunk(
  'labels/deleteLabel',
  async (id: string) => {
    await axiosInstance.delete(`/table/${LABEL_TABLE_ID}/rows/${id}`);
    return id;
  }
);

const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Labels
      .addCase(fetchLabels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((row: any) => ({
          id: row.id,
          name: row.fields.name,
          color: row.fields.color,
          created_by: row.fields.created_by?.[0]
        }));
      })
      .addCase(fetchLabels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch labels';
      })
      // Create Label
      .addCase(createLabel.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Label
      .addCase(updateLabel.fulfilled, (state, action) => {
        const index = state.items.findIndex((label) => label.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Label
      .addCase(deleteLabel.fulfilled, (state, action) => {
        state.items = state.items.filter((label) => label.id !== action.payload);
      });
  },
});

export default labelsSlice.reducer;
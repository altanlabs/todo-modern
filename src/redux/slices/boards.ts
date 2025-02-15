import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';

export const BOARD_TABLE_ID = 'b7bc4aa2-c6ff-42df-9ef1-7abbd1d71f0e';

interface Board {
  id: string;
  name: string;
  description: string;
  created_by: string;
}

interface BoardState {
  items: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  items: [],
  currentBoard: null,
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async () => {
  const response = await axiosInstance.get(`/table/${BOARD_TABLE_ID}/rows`);
  return response.data.rows || [];
});

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async ({ name, description }: { name: string; description: string }) => {
    const response = await axiosInstance.post(`/table/${BOARD_TABLE_ID}/rows`, {
      fields: {
        name,
        description,
      }
    });
    return response.data;
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ id, name, description }: { id: string; name: string; description: string }) => {
    const response = await axiosInstance.patch(`/table/${BOARD_TABLE_ID}/rows/${id}`, {
      fields: {
        name,
        description,
      }
    });
    return response.data;
  }
);

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (id: string) => {
    await axiosInstance.delete(`/table/${BOARD_TABLE_ID}/rows/${id}`);
    return id;
  }
);

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setCurrentBoard: (state, action) => {
      state.currentBoard = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Boards
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((row: any) => ({
          id: row.id,
          name: row.fields.name,
          description: row.fields.description,
          created_by: row.fields.created_by?.[0]
        }));
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch boards';
      })
      // Create Board
      .addCase(createBoard.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Board
      .addCase(updateBoard.fulfilled, (state, action) => {
        const index = state.items.findIndex((board) => board.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Board
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.items = state.items.filter((board) => board.id !== action.payload);
        if (state.currentBoard?.id === action.payload) {
          state.currentBoard = null;
        }
      });
  },
});

export const { setCurrentBoard } = boardsSlice.actions;
export default boardsSlice.reducer;
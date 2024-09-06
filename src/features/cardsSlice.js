import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCards } from "../services/products.service";

export const fetchCards = createAsyncThunk("cards/fetchCards", async () => {
  const response = await new Promise((resolve) => getCards(resolve));
  return response;
});

const cardsSlice = createSlice({
  name: "cards",
  initialState: {
    status: "idle",
    cards: [],
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCards.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCards.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.cards = action.payload;
    });
    builder.addCase(fetchCards.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export default cardsSlice.reducer;

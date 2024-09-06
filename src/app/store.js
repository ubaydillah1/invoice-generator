import { configureStore } from "@reduxjs/toolkit";
import cardsSlice from "../features/cardsSlice";

export const store = configureStore({
  reducer: {
    cards: cardsSlice,
  },
});

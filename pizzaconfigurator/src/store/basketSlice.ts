import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BasketState } from "../../../types/types";
import type { PizzaConfig } from "../../../types/types";


const initialState: BasketState = {
    items: [],
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket(state, action: PayloadAction<PizzaConfig>) {
      state.items.push({id: crypto.randomUUID(), pizza: action.payload});
    },
    removeFromBasket(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearBasket() {
      return initialState;
    },
  },
});

export const { addToBasket, removeFromBasket, clearBasket } =
  basketSlice.actions;

export default basketSlice.reducer;
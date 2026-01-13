import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PizzaConfig } from "./pizzaSlice";

export type BasketItem = {
    id: string;
    pizza: PizzaConfig
}

export type BasketState = {
    items: BasketItem[];
};

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
    removeFromBasket(state, action: PayloadAction<number>) {
      state.items.splice(action.payload, 1);
    },
    clearBasket() {
      return initialState;
    },
  },
});

export const { addToBasket, removeFromBasket, clearBasket } =
  basketSlice.actions;

export default basketSlice.reducer;
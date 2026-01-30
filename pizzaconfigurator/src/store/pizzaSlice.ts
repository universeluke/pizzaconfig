import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PizzaConfig } from "../../../types/types";

const initialState: PizzaConfig = {
  sauce: null,
  cheese: null,
  toppings: [],
  oils: [],
  herbs: [],
  dips: [],
  notes: "",
};

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setSauce(state, action: PayloadAction<string>) {
      state.sauce = action.payload;
    },
    setCheese(state, action: PayloadAction<string>) {
      state.cheese = action.payload;
    },
    toggleTopping(state, action: PayloadAction<string>) {
      state.toppings = toggle(state.toppings, action.payload);
    },
    toggleOil(state, action: PayloadAction<string>) {
      state.oils = toggle(state.oils, action.payload);
    },
    toggleHerb(state, action: PayloadAction<string>) {
      state.herbs = toggle(state.herbs, action.payload);
    },
    toggleDip(state, action: PayloadAction<string>) {
      state.dips = toggle(state.dips, action.payload);
    },
    setNotes(state, action: PayloadAction<string>) {
      state.notes = action.payload;
    },
    resetPizza() {
      return initialState;
    },
  },
});

export const {
  setSauce,
  setCheese,
  toggleTopping,
  toggleOil,
  toggleHerb,
  toggleDip,
  setNotes,
  resetPizza,
} = pizzaSlice.actions;

export default pizzaSlice.reducer;
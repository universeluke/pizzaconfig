import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, test, expect } from "vitest";
import AddToBasket from "./AddToBasket";
import { configureStore } from "@reduxjs/toolkit";
import pizzaReducer from "../store/pizzaSlice";
import basketReducer from "../store/basketSlice";
import { customerTestIds } from "../test/customerTestIds";

function renderWithStore(pizzaState: any) {
  const store = configureStore({
    reducer: {
      pizza: pizzaReducer,
      basket: basketReducer,
    },
    preloadedState: {
      pizza: pizzaState,
      basket: { items: [] },
    },
  });

  render(
    <Provider store={store}>
      <AddToBasket />
    </Provider>
  );

  return store;
}

describe("AddToBasket", () => {
  test("that it does nothing if sauce is missing", async () => {
    const user = userEvent.setup();

    const store = renderWithStore({
      sauce: null,
      cheese: "mozzarella",
      toppings: [],
      oils: [],
      herbs: [],
      dips: [],
      notes: "",
    });

    await user.click(
      screen.getByTestId(customerTestIds.basket.addToBasketButton)
    );

    expect(store.getState().basket.items).toHaveLength(0);
  });

  test("does nothing if cheese is missing", async () => {
    const user = userEvent.setup();

    const store = renderWithStore({
      sauce: "tomato",
      cheese: null,
      toppings: [],
      oils: [],
      herbs: [],
      dips: [],
      notes: "",
    });

    await user.click(
      screen.getByTestId(customerTestIds.basket.addToBasketButton)
    );

    const state = store.getState();
    expect(state.basket.items).toHaveLength(0);
  });

  test("adds pizza to basket and resets pizza when valid", async () => {
    const user = userEvent.setup();

    const store = renderWithStore({
      sauce: "tomato",
      cheese: "mozzarella",
      toppings: ["pepperoni"],
      oils: [],
      herbs: [],
      dips: [],
      notes: "",
    });

    await user.click(
      screen.getByTestId(customerTestIds.basket.addToBasketButton)
    );

    const state = store.getState();

    expect(state.basket.items).toHaveLength(1);
    expect(state.basket.items[0].pizza.sauce).toBe("tomato");

    expect(state.pizza.sauce).toBeNull();
    expect(state.pizza.cheese).toBeNull();
  });
});

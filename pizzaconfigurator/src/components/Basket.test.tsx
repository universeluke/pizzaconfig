import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("../supabaseClient", () => ({
  supabase: {
    auth: { getUser: vi.fn() },
  },
}));

vi.mock("../utils/placeOrder", () => ({
  placeOrder: vi.fn().mockResolvedValue({ ok: true }),
}));

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Basket from "./Basket";
import pizzaReducer from "../store/pizzaSlice";
import basketReducer from "../store/basketSlice";
import { customerTestIds } from "../test/customerTestIds";
import { supabase } from "../supabaseClient";
import { placeOrder } from "../utils/placeOrder";

function renderWithStore(items: any[]) {
  const store = configureStore({
    reducer: { pizza: pizzaReducer, basket: basketReducer },
    preloadedState: {
      pizza: {
        sauce: null,
        cheese: null,
        toppings: [],
        oils: [],
        herbs: [],
        dips: [],
        notes: "",
      },
      basket: { items },
    },
  });

  render(
    <Provider store={store}>
      <Basket />
    </Provider>
  );

  return store;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Basket", () => {
  test("renders nothing if basket empty", () => {
    renderWithStore([]);
    expect(
      screen.queryByTestId(customerTestIds.basket.openBasketButton)
    ).not.toBeInTheDocument();
  });

  test("that it open basket, shows items, and remove works", async () => {
    const user = userEvent.setup();

    const store = renderWithStore([
      {
        id: "1",
        pizza: {
          sauce: "tomato",
          cheese: "mozzarella",
          toppings: [],
          oils: [],
          herbs: [],
          dips: [],
          notes: "",
        },
      },
    ]);

    await user.click(
      screen.getByTestId(customerTestIds.basket.openBasketButton)
    );
    expect(
      screen.getByTestId(customerTestIds.basketItems.itemsList)
    ).toBeInTheDocument();

    await user.click(
      screen.getByTestId(customerTestIds.basket.removeItemButton("1"))
    );
    expect(store.getState().basket.items).toHaveLength(0);
  });

  test("that clicking place order calls placeOrder util function", async () => {
    const user = userEvent.setup();

    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: "user-123" } },
    });

    renderWithStore([
      {
        id: "1",
        pizza: {
          sauce: "tomato",
          cheese: "mozzarella",
          toppings: [],
          oils: [],
          herbs: [],
          dips: [],
          notes: "",
        },
      },
    ]);

    await user.click(
      screen.getByTestId(customerTestIds.basket.openBasketButton)
    );

    await user.click(
      screen.getByTestId(customerTestIds.basket.placeOrderButton)
    );

    expect(placeOrder).toHaveBeenCalledTimes(1);
  });
});

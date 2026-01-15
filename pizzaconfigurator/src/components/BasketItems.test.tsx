import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../store/basketSlice";
import pizzaReducer from "../store/pizzaSlice";
import BasketItems from "./BasketItems";
import { customerTestIds } from "../test/customerTestIds";

function renderWithItems(items: any[]) {
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
      <BasketItems />
    </Provider>
  );

  return store;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("BasketItems", () => {
  test("that it renders the list container", () => {
    renderWithItems([]);

    expect(
      screen.getByTestId(customerTestIds.basketItems.itemsList)
    ).toBeInTheDocument();
  });

  test("that it renders items", () => {
    renderWithItems([
      {
        id: "item-1",
        pizza: {
          sauce: "tomato",
          cheese: "none",
          toppings: ["pepperoni"],
          oils: ["olive oil"],
          herbs: ["oregano"],
          dips: ["bbq"],
          notes: "",
        },
      },
    ]);

    expect(screen.getByText("PIE 1")).toBeInTheDocument();
    expect(screen.getByText("no cheese")).toBeInTheDocument();
    expect(screen.getByText("tomato sauce")).toBeInTheDocument();
    expect(screen.getByText("pepperoni")).toBeInTheDocument();
    expect(screen.getByText("olive oil")).toBeInTheDocument();
    expect(screen.getByText("oregano")).toBeInTheDocument();
    expect(screen.getByText("bbq dip")).toBeInTheDocument();
  });

  test("that clicking remove removes the item from store", async () => {
    const user = userEvent.setup();

    const store = renderWithItems([
      {
        id: "item-1",
        pizza: {
          sauce: "tomato",
          cheese: "none",
          toppings: ["pepperoni"],
          oils: ["olive oil"],
          herbs: ["oregano"],
          dips: ["bbq"],
          notes: "",
        },
      },
    ]);

    await user.click(
      screen.getByTestId(customerTestIds.basket.removeItemButton("item-1"))
    );

    expect(store.getState().basket.items).toHaveLength(0);
  });
});

import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import BuildPage from "./BuildPage";
import pizzaReducer from "../store/pizzaSlice";
import basketReducer from "../store/basketSlice";
import { customerTestIds } from "../test/customerTestIds";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("BuildPage", () => {
  test("does not show enable push notification button when already subscribed", () => {
    navigator.serviceWorker = {
      ready: Promise.resolve({
        pushManager: {
          getSubscription: vi.fn().mockResolvedValue({
            endpoint:
              "and now you do what they told ya! those who died are justified, for wearing the badge, they're the chosen whites. you justify those that died blah blah blah",
          }),
        },
      }),
    };

    const store = configureStore({
      reducer: {
        pizza: pizzaReducer,
        basket: basketReducer,
      },
    });

    const { queryByTestId } = render(
      <Provider store={store}>
        <BuildPage />
      </Provider>,
    );

    expect(
      queryByTestId(customerTestIds.enablePushButton),
    ).not.toBeInTheDocument();
  });

  test("typing in notes dispatches to store", async () => {
    const user = userEvent.setup();

    const store = configureStore({
      reducer: {
        pizza: pizzaReducer,
        basket: basketReducer,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <BuildPage />
      </Provider>,
    );

    await user.type(
      getByTestId(customerTestIds.kitchenNotesTextArea),
      "no olives pls",
    );

    expect(store.getState().pizza.notes).toBe("no olives pls");
  });

  test("the title is rendered", () => {
    const store = configureStore({
      reducer: {
        pizza: pizzaReducer,
        basket: basketReducer,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <BuildPage />
      </Provider>,
    );

    expect(getByTestId(customerTestIds.title)).toBeInTheDocument();
  });
});

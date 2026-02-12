import { describe, test, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { act } from "react";
import notificationReducer from "../store/notificationSlice";
import { useNotification } from "./useNotification";

describe("useNotification", () => {
  test("dispatches pushNotification and adds item to store", () => {
    const store = configureStore({
      reducer: { notification: notificationReducer },
    });

    const { result } = renderHook(() => useNotification(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    act(() => {
      result.current("woohooooooo yay", {
        kind: "success",
        timeout: 2000,
      });
    });

    const state = store.getState().notification.list;

    expect(state[0].text).toBe("woohooooooo yay");
  });
});

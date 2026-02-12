import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import NotificationStack from "./NotificationStack";
import notificationReducer from "../store/notificationSlice";
import { customerTestIds } from "../test/customerTestIds";

describe("NotificationStack", () => {
  test("that it renders nothing when there are no notifications", () => {
    const store = configureStore({
      reducer: { notification: notificationReducer },
      preloadedState: { notification: { list: [] } },
    });

    const { queryByTestId } = render(
      <Provider store={store}>
        <NotificationStack />
      </Provider>,
    );

    expect(
      queryByTestId(customerTestIds.notification.notificationContainer),
    ).not.toBeInTheDocument();
  });

  test("renders a notification when one exists", () => {
    const store = configureStore({
      reducer: { notification: notificationReducer },
      preloadedState: {
        notification: {
          list: [
            {
              id: "1",
              text: "hello",
              kind: "info",
              timeout: 3000,
            },
          ],
        },
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <NotificationStack />
      </Provider>,
    );

    expect(
      getByTestId(customerTestIds.notification.notification),
    ).toBeInTheDocument();
  });
});

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react";
import NotificationItem from "./NotificationItem";
import { customerTestIds } from "../test/customerTestIds";

describe("NotificationItem", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("that it renders the text", () => {
    const onDismiss = vi.fn();

    const { getByTestId } = render(
      <NotificationItem
        id="1"
        text="helloooo i suck"
        kind="info"
        timeout={3000}
        onDismiss={onDismiss}
      />,
    );

    expect(
      getByTestId(customerTestIds.notification.notificationText),
    ).toHaveTextContent("helloooo i suck");
  });

  test("that it calls onDismiss after timeout", () => {
    const onDismiss = vi.fn();

    render(
      <NotificationItem
        id="1"
        text="hello"
        kind="info"
        timeout={3000}
        onDismiss={onDismiss}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onDismiss).toHaveBeenCalledWith("1");
  });

  test("that it calls onDismiss when button clicked", () => {
    const onDismiss = vi.fn();

    const { getByTestId } = render(
      <NotificationItem
        id="1"
        text="hello"
        kind="info"
        onDismiss={onDismiss}
      />,
    );

    fireEvent.click(
      getByTestId(customerTestIds.notification.notificationDismissButton),
    );

    expect(onDismiss).toHaveBeenCalledWith("1");
  });
});

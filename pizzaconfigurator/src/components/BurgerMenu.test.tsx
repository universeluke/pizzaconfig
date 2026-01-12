import { fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import BurgerMenu from "./BurgerMenu";
import { customerTestIds } from "../test/customerTestIds";

describe("BurgerMenu", () => {
  test("menu is closed by default", () => {
    const { queryByTestId } = render(
      <MemoryRouter>
        <BurgerMenu />
      </MemoryRouter>
    );
    expect(queryByTestId(customerTestIds.burger.panel)).not.toBeInTheDocument();
  });

  test("opens when clicking the burger button", async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(
      <MemoryRouter>
        <BurgerMenu />
      </MemoryRouter>
    );

    await user.click(getByTestId(customerTestIds.burger.openButton));

    expect(getByTestId(customerTestIds.burger.panel)).toBeInTheDocument();
  });

  test("closes when clicking the close button after animation ends", async () => {
    const user = userEvent.setup();
    const { getByTestId, queryByTestId } = render(
      <MemoryRouter>
        <BurgerMenu />
      </MemoryRouter>
    );

    await user.click(getByTestId(customerTestIds.burger.openButton));
    expect(getByTestId(customerTestIds.burger.panel)).toBeInTheDocument();

    await user.click(getByTestId(customerTestIds.burger.closeButton));
    fireEvent.animationEnd(getByTestId(customerTestIds.burger.panel));

    expect(queryByTestId(customerTestIds.burger.panel)).not.toBeInTheDocument();
  });

  test("closes when clicking a menu link", async () => {
    const user = userEvent.setup();
    const { getByTestId, queryByTestId } = render(
      <MemoryRouter>
        <BurgerMenu />
      </MemoryRouter>
    );

    await user.click(getByTestId(customerTestIds.burger.openButton));
    expect(getByTestId(customerTestIds.burger.panel)).toBeInTheDocument();

    await user.click(getByTestId(customerTestIds.burger.link("history")));
    fireEvent.animationEnd(getByTestId(customerTestIds.burger.panel));

    expect(queryByTestId(customerTestIds.burger.panel)).not.toBeInTheDocument();
  });
});

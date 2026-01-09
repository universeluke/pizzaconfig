import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccordionSection from "./AccordionSection";
import { describe, test, expect, vi } from "vitest";
import { customerTestIds } from "../test/customerTestIds";

describe("AccordionSection", () => {
  test("toggles open and shows options", async () => {
    const user = userEvent.setup();

    const { getByTestId, queryByTestId } = render(
      <AccordionSection
        title="SAUCE"
        options={["tomato", "pesto"]}
        mode="single"
        value={null}
        values={[]}
        onSelect={() => {}}
      />
    );

    expect(
      queryByTestId(customerTestIds.option("tomato"))
    ).not.toBeInTheDocument();

    await user.click(getByTestId(customerTestIds.category("SAUCE")));
    expect(getByTestId(customerTestIds.option("tomato"))).toBeInTheDocument();
    expect(getByTestId(customerTestIds.option("pesto"))).toBeInTheDocument();

    await user.click(getByTestId(customerTestIds.category("SAUCE")));
    expect(
      screen.queryByTestId(customerTestIds.option("tomato"))
    ).not.toBeInTheDocument();
  });

  test("calls onSelect when an option is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    const { getByTestId } = render(
      <AccordionSection
        title="TOPPINGS"
        options={["pepperoni"]}
        mode="multi"
        value={null}
        values={[]}
        onSelect={onSelect}
      />
    );

    await user.click(getByTestId(customerTestIds.category("TOPPINGS")));
    await user.click(getByTestId(customerTestIds.category("pepperoni")));

    expect(onSelect).toHaveBeenCalledWith("pepperoni");
  });
});

import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import PizzaVisualiser from "./PizzaVisualiser";
import { customerTestIds } from "../test/customerTestIds";

const basePizza = {
  sauce: null,
  cheese: null,
  toppings: [],
  oils: [],
  herbs: [],
  dips: [],
  notes: "",
};

describe("PizzaVisualiser", () => {
  test("that it only renders layers that match the pizza config", () => {
    const { getByTestId } = render(
      <PizzaVisualiser
        pizza={{
          ...basePizza,
          sauce: "tomato",
          cheese: "fior di latte",
          toppings: ["pepperoni", "mushroom"],
          herbs: ["oregano"],
        }}
      />
    );

    expect(
      getByTestId(customerTestIds.pizzaOption("tomato"))
    ).toBeInTheDocument();
    expect(
      getByTestId(customerTestIds.pizzaOption("fiordilatte"))
    ).toBeInTheDocument();
    expect(
      getByTestId(customerTestIds.pizzaOption("pepperoni"))
    ).toBeInTheDocument();
    expect(
      getByTestId(customerTestIds.pizzaOption("mushrooms"))
    ).toBeInTheDocument();
    expect(
      getByTestId(customerTestIds.pizzaOption("oregano"))
    ).toBeInTheDocument();
  });

  test("that it does not render layers when options are not selected", () => {
    const { queryByTestId } = render(<PizzaVisualiser pizza={basePizza} />);

    expect(
      queryByTestId(customerTestIds.pizzaOption("tomato"))
    ).not.toBeInTheDocument();
    expect(
      queryByTestId(customerTestIds.pizzaOption("fiordilatte"))
    ).not.toBeInTheDocument();
    expect(
      queryByTestId(customerTestIds.pizzaOption("pepperoni"))
    ).not.toBeInTheDocument();
    expect(
      queryByTestId(customerTestIds.pizzaOption("mushrooms"))
    ).not.toBeInTheDocument();
    expect(
      queryByTestId(customerTestIds.pizzaOption("oregano"))
    ).not.toBeInTheDocument();
  });
});

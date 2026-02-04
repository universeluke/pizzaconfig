import { describe, test, expect } from "vitest";
import reducer, {
  setSauce,
  setCheese,
  toggleTopping,
  toggleOil,
  toggleHerb,
  toggleDip,
  setNotes,
  resetPizza,
} from "./pizzaSlice";

const initialState = {
  sauce: null,
  cheese: null,
  toppings: [],
  oils: [],
  herbs: [],
  dips: [],
  notes: "",
};

describe("pizzaSlice", () => {
  test("that it sets sauce", () => {
    const state = reducer(initialState, setSauce("tomato"));
    expect(state.sauce).toBe("tomato");
  });

  test("that it sets cheese", () => {
    const state = reducer(initialState, setCheese("mozzarella"));
    expect(state.cheese).toBe("mozzarella");
  });

  test("that it toggles topping on and off", () => {
    let state = reducer(initialState, toggleTopping("pepperoni"));
    expect(state.toppings).toEqual(["pepperoni"]);

    state = reducer(state, toggleTopping("pepperoni"));
    expect(state.toppings).toEqual([]);
  });

  test("that it toggles oil", () => {
    const state = reducer(initialState, toggleOil("olive oil"));
    expect(state.oils).toEqual(["olive oil"]);
  });

  test("toggles herb", () => {
    const state = reducer(initialState, toggleHerb("basil"));
    expect(state.herbs).toEqual(["basil"]);
  });

  test("toggles dip", () => {
    const state = reducer(initialState, toggleDip("garlic mayo"));
    expect(state.dips).toEqual(["garlic mayo"]);
  });

  test("that it sets notes", () => {
    const state = reducer(initialState, setNotes("extra crispy pls"));
    expect(state.notes).toBe("extra crispy pls");
  });

  test("that it resets pizza to initial state", () => {
    const dirtyState = {
      sauce: "tomato",
      cheese: "mozzarella",
      toppings: ["pepperoni"],
      oils: ["olive oil"],
      herbs: ["basil"],
      dips: ["bbq"],
      notes: "hi",
    };

    const state = reducer(dirtyState, resetPizza());
    expect(state).toEqual(initialState);
  });
});
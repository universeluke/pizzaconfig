import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HistoryPage from "./HistoryPage";
import { customerTestIds } from "../test/customerTestIds";

const resultFromSupabase = vi.fn();

vi.mock("../supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: resultFromSupabase,
        })),
      })),
    })),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("HistoryPage", () => {
  test("that it shows empty states when there are no orders", async () => {
    resultFromSupabase.mockResolvedValueOnce({ data: [], error: null });

    const { getByText, findByText } = render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    expect(await findByText("IN PROGRESS")).toBeInTheDocument();
    expect(getByText("COMPLETED")).toBeInTheDocument();

    expect(getByText("No active orders.")).toBeInTheDocument();
    expect(getByText("No completed orders yet.")).toBeInTheDocument();
  });

  test("that it lists the orders that come back from the database", async () => {
    resultFromSupabase.mockResolvedValueOnce({
      error: null,
      data: [
        {
          id: "order-1",
          status: "todo",
          created_at: "2026-01-20T15:23:06.407103+00:00",
          pizza: {
            sauce: "tomato",
            cheese: "mozzarella",
            toppings: ["pepperoni"],
            oils: [],
            herbs: [],
            dips: [],
            notes: "",
          },
        },
      ],
    });

    const { getByTestId } = render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText("IN PROGRESS")).toBeInTheDocument();

    expect(
      getByTestId(customerTestIds.history.sauce("order-1", "tomato")),
    ).toHaveTextContent("tomato sauce");
    expect(
      getByTestId(customerTestIds.history.cheese("order-1", "mozzarella")),
    ).toHaveTextContent("mozzarella cheese");
    expect(
      getByTestId(customerTestIds.history.topping("order-1", "pepperoni")),
    ).toHaveTextContent("pepperoni");
  });

  test("shows an alert when supabase returns an error", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    resultFromSupabase.mockResolvedValueOnce({
      data: null,
      error: { message: "db BUSTED!" },
    });

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("IN PROGRESS")).toBeInTheDocument();
    expect(alertSpy).toHaveBeenCalledWith("db BUSTED!");

    alertSpy.mockRestore();
  });

  test("renders completed orders in the completed section", async () => {
    resultFromSupabase.mockResolvedValueOnce({
      error: null,
      data: [
        {
          id: "order-2",
          status: "collected",
          created_at: "right now yeahhh",
          pizza: {
            sauce: "bbq",
            cheese: "none",
            toppings: ["onion"],
            oils: [],
            herbs: [],
            dips: [],
            notes: "",
          },
        },
      ],
    });

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("COMPLETED")).toBeInTheDocument();

    expect(screen.getByText("bbq sauce")).toBeInTheDocument();
    expect(screen.getByText("no cheese")).toBeInTheDocument();
    expect(screen.getByText("onion")).toBeInTheDocument();
  });
});

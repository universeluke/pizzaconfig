import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RecentPizzaTrack from "./RecentPizzaTrack";
import { customerTestIds } from "../test/customerTestIds";

const limitMock = vi.fn();

vi.mock("../supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({ data: { user: { id: "user-1" } } }),
      ),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          neq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: limitMock,
            })),
          })),
        })),
      })),
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(),
      })),
    })),
    removeChannel: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RecentPizzaTrack", () => {
  test("that it renders nothing when no orders", async () => {
    limitMock.mockResolvedValueOnce({ data: [], error: null });

    const { findByTestId } = render(
      <MemoryRouter>
        <RecentPizzaTrack />
      </MemoryRouter>,
    );

    expect(
      await findByTestId(customerTestIds.recentPizzaTrack.container),
    ).not.toBeInTheDocument();
  });

  test("that it renders orders when returned from supabase", async () => {
    limitMock.mockResolvedValueOnce({
      data: [
        {
          id: "order-1",
          status: "todo",
          created_at: "",
          pizza: {
            sauce: "MMM TOMMY MATOS",
            cheese: "mozzarella",
            toppings: [],
            oils: [],
            herbs: [],
            dips: [],
          },
        },
      ],
      error: null,
    });

    const { getByTestId, findByTestId } = render(
      <MemoryRouter>
        <RecentPizzaTrack />
      </MemoryRouter>,
    );

    expect(
      await findByTestId(customerTestIds.recentPizzaTrack.title),
    ).toBeInTheDocument();

    expect(
      getByTestId(customerTestIds.recentPizzaTrack.item),
    ).toBeInTheDocument();
  });

  test("that it calls closeMenu when link clicked", async () => {
    const user = userEvent.setup();
    const closeMenu = vi.fn();

    limitMock.mockResolvedValueOnce({
      data: [
        {
          id: "order-1",
          status: "todo",
          created_at: "",
          pizza: {
            sauce: "yummy yummy tomatoooooos",
            cheese: "mozzarella",
            toppings: [],
            oils: [],
            herbs: [],
            dips: [],
          },
        },
      ],
      error: null,
    });

    const { findByTestId } = render(
      <MemoryRouter>
        <RecentPizzaTrack closeMenu={closeMenu} />
      </MemoryRouter>,
    );

    await user.click(await findByTestId(customerTestIds.recentPizzaTrack.link));

    expect(closeMenu).toHaveBeenCalledTimes(1);
  });
});

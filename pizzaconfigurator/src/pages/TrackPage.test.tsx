import { describe, test, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import TrackPage from "./TrackPage";
import { customerTestIds } from "../test/customerTestIds";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ orderId: "order-1" }),
}));

vi.mock("../supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              status: "cooking",
              pizza: {
                sauce: "tomato",
                cheese: "mozzarella",
                toppings: [],
                oils: [],
                herbs: [],
                dips: [],
                notes: "",
              },
            },
            error: null,
          }),
        }),
      }),
    }),
    channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
    removeChannel: () => {},
  },
}));

describe("TrackPage", () => {
  test("that it renders the correct message for the pizza's status", async () => {
    const { findByTestId } = render(<TrackPage />);
    // "findBy methods are a combination of getBy queries and waitFor"
    expect(
      await findByTestId(customerTestIds.tracking.trackingMessage("cooking")),
    ).toBeInTheDocument();
  });
});

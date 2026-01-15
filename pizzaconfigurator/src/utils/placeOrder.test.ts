import { describe, test, expect, vi } from "vitest";
import { placeOrder } from "./placeOrder";

describe("placeOrder util", () => {
  test("that it calls insert and returns true", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });

    const supabase: any = { from };

    const basket = [
      {
        id: "1",
        pizza: { sauce: "tomato", cheese: "mozzarella", toppings: [], oils: [], herbs: [], dips: [], notes: "luke is the coolest guy i know" },
      },
      {
        id: "2",
        pizza: { sauce: "tomato", cheese: "vegan", toppings: [], oils: [], herbs: [], dips: [], notes: "luke is the coolest guy i know" },
      },
    ];

    const result = await placeOrder(supabase, "epiclegend123", basket as any);

    expect(from).toHaveBeenCalledWith("orders");
    expect(insert).toHaveBeenCalledWith([
      { user_id: "epiclegend123", pizza: basket[0].pizza },
      { user_id: "epiclegend123", pizza: basket[1].pizza },
    ]);
    expect(result).toEqual({ ok: true });
  });
});
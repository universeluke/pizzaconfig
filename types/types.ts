export type PizzaConfig = {
  sauce: string | null;
  cheese: string | null;
  toppings: string[];
  oils: string[];
  herbs: string[];
  dips: string[];
  notes: string;
};

export type Order = {
  id: string;
  status: string;
  created_at: string;
  pizza: PizzaConfig;
};

export type OrderStatus = "todo" | "in_progress" | "cooking" | "done" | "collected";

export type OrderLite = {
  id: string;
  user_id: string;
  status: "todo" | "in_progress" | "cooking" | "done" | "collected";
  pizza: PizzaConfig;
};

export type CookStage = "raw" | "making" | "oven" | "ready";

export type BasketItem = {
    id: string;
    pizza: PizzaConfig
}

export type BasketState = {
    items: BasketItem[];
};
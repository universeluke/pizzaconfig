import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("../supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

import { supabase } from "../supabaseClient";
import { subscribeToPush } from "./push";

beforeEach(() => {
  vi.clearAllMocks();

  vi.stubGlobal("alert", vi.fn());
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

  vi.stubGlobal("Notification", {
    requestPermission: vi.fn().mockResolvedValue("granted"),
  });

  vi.stubGlobal("atob", vi.fn(() => "abcd"));

  vi.stubGlobal("navigator", {
    userAgent: "test-agent",
    serviceWorker: {
      ready: Promise.resolve({
        pushManager: {
          subscribe: vi.fn().mockResolvedValue({
            endpoint: "luke's got great hair in my opinion",
            toJSON: () => ({ keys: { p256dh: "pkey", auth: "akey" } }),
          }),
        },
      }),
    },
  });

  // logged in by default
  (supabase.auth.getUser).mockResolvedValue({
    data: { user: { id: "user-123" } },
  });
});

describe("subscribeToPush", () => {
  test("alerts and stops if permission denied", async () => {
    (Notification.requestPermission).mockResolvedValueOnce("denied");

    await subscribeToPush();

    expect(alert).toHaveBeenCalledWith("notifications not allowed");
    expect(fetch).not.toHaveBeenCalled();
  });

  test("alerts and stops if not logged in", async () => {
    (supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
    });

    await subscribeToPush();

    expect(alert).toHaveBeenCalledWith("please log in first");
    expect(fetch).not.toHaveBeenCalled();
  });

  test("calls fetch /subscribe when successful", async () => {
    await subscribeToPush();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/subscribe",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
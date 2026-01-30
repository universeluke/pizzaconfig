import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePage from "./ProfilePage";
import { supabase } from "../supabaseClient";
import { customerTestIds } from "../test/customerTestIds";

vi.mock("../supabaseClient", () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(),
        signOut: vi.fn(),
      },
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ProfilePage", () => {
  test("shows 'not signed in' when user is null", async () => {
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
    });

    const { getByTestId } = render(<ProfilePage />);

    expect(
      await getByTestId(customerTestIds.profile.notSignedIn),
    ).toBeInTheDocument();
  });

  test("shows email when user is signed in", async () => {
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: { email: "test@example.com" } },
    });

    const { findByTestId } = render(<ProfilePage />);

    expect(
      await findByTestId(customerTestIds.profile.signedInAs),
    ).toHaveTextContent("test@example.com");
  });

  test("clicking logout calls supabase.auth.signOut", async () => {
    const user = userEvent.setup();

    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: { email: "test@example.com" } },
    });

    const { findByTestId } = render(<ProfilePage />);

    await user.click(await findByTestId(customerTestIds.profile.logoutButton));

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});

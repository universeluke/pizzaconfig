import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";

vi.mock("../supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

import { supabase } from "../supabaseClient";
import { customerTestIds } from "../test/customerTestIds";

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders email, password, and submit button", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(getByTestId(customerTestIds.login.email)).toBeInTheDocument();
    expect(getByTestId(customerTestIds.login.password)).toBeInTheDocument();
    expect(getByTestId(customerTestIds.login.submit)).toBeInTheDocument();
  });

  test("does not submit when fields are empty", async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(getByTestId(customerTestIds.login.submit));

    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  test("calls supabase signInWithPassword with email and password", async () => {
    const user = userEvent.setup();

    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });

    const { getByTestId } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(getByTestId(customerTestIds.login.email), "test@test.com");
    await user.type(
      getByTestId(customerTestIds.login.password),
      "lukeisreallycool",
    );

    await user.click(getByTestId(customerTestIds.login.submit));

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "lukeisreallycool",
    });
  });

  test("that it does not submit when password is missing", async () => {
    const user = userEvent.setup();

    const { getByTestId } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(getByTestId(customerTestIds.login.email), "test@test.com");

    await user.click(getByTestId(customerTestIds.login.submit));

    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  test("that it calls supabase signUp when in signup mode", async () => {
    const user = userEvent.setup();

    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });

    const { getByText, getByTestId } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(getByText("need an account? sign up"));

    await user.type(getByTestId(customerTestIds.login.email), "new@test.com");
    await user.type(getByTestId(customerTestIds.login.password), "password123");
    await user.type(
      getByTestId(customerTestIds.login.confirmPassword),
      "password123",
    );

    await user.click(getByTestId(customerTestIds.login.submit));

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "new@test.com",
      password: "password123",
    });
  });

  test("that it blocks signup when confirm password does not match", async () => {
    const user = userEvent.setup();

    const { getByText, getByTestId } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(getByText("need an account? sign up"));

    await user.type(getByTestId(customerTestIds.login.email), "new@test.com");
    await user.type(getByTestId(customerTestIds.login.password), "password123");

    await user.type(
      getByTestId(customerTestIds.login.confirmPassword),
      "different123",
    );
    await user.click(getByTestId(customerTestIds.login.submit));

    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  test("that it blocks signup when password is shorter than 7 chars", async () => {
    const user = userEvent.setup();

    const { getByText, getByTestId } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(getByText("need an account? sign up"));

    await user.type(getByTestId(customerTestIds.login.email), "new@test.com");
    await user.type(getByTestId(customerTestIds.login.password), "123456");
    await user.type(
      getByTestId(customerTestIds.login.confirmPassword),
      "123456",
    );

    await user.click(getByTestId(customerTestIds.login.submit));

    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });
});

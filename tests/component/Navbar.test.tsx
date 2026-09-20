import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "@/components/Navbar";

let currentPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    currentPathname = "/";
  });

  it("renders both navigation links: Home and Study Guide Generator", () => {
    render(<Navbar />);

    const homeLinks = screen.getAllByRole("link", { name: /^home$/i });
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);

    const generatorLinks = screen.getAllByRole("link", { name: /^study guide generator$/i });
    expect(generatorLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("marks Home as active when pathname is '/'", () => {
    currentPathname = "/";
    render(<Navbar />);

    const homeLink = screen.getAllByRole("link", { name: /^home$/i })[0];
    expect(homeLink).toHaveAttribute("aria-current", "page");

    const generatorLink = screen.getAllByRole("link", { name: /^study guide generator$/i })[0];
    expect(generatorLink).not.toHaveAttribute("aria-current");
  });

  it("marks Generator as active when pathname is '/generate'", () => {
    currentPathname = "/generate";
    render(<Navbar />);

    const homeLink = screen.getAllByRole("link", { name: /^home$/i })[0];
    expect(homeLink).not.toHaveAttribute("aria-current");

    const generatorLink = screen.getAllByRole("link", { name: /^study guide generator$/i })[0];
    expect(generatorLink).toHaveAttribute("aria-current", "page");
  });

  it("toggles mobile menu when clicking hamburger button", async () => {
    render(<Navbar />);

    const toggleBtn = screen.getByRole("button", { name: /toggle navigation menu/i });
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
  });
});

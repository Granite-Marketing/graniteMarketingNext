import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders its children and applies the default variant styling", () => {
    render(<Badge>New</Badge>);

    const badge = screen.getByText("New");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-primary");
  });
});

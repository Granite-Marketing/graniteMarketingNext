import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineCode } from "../InlineCode";

describe("InlineCode", () => {
	it("copies the snippet text on click and confirms", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.assign(navigator, { clipboard: { writeText } });

		render(<InlineCode>Content-Type: text/html</InlineCode>);
		fireEvent.click(screen.getByRole("button"));

		expect(writeText).toHaveBeenCalledWith("Content-Type: text/html");
		expect(await screen.findByText("Copied")).toBeInTheDocument();
	});
});

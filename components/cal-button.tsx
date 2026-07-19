"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { cn } from "@/lib/utils";
import { CAL_LINK, CAL_NAMESPACE } from "./data";

type CalButtonProps = {
	children: React.ReactNode;
	size?: "default" | "lg";
	className?: string;
	/**
	 * Overrides the booking handle passed to Cal.com's `data-cal-link`.
	 * Defaults to the site-wide CAL_LINK — most callers (and every hardcoded
	 * usage on the homepage today) never pass this, only a resolved `link`
	 * object's `calBooking` variant with its own explicit handle does.
	 */
	calLink?: string;
};

/**
 * Opens the Cal.com booking modal. Any instance on the page
 * initialises the shared namespace, so the popup is ready no
 * matter which button the visitor reaches first.
 */
export function CalButton({
	children,
	size = "default",
	className,
	calLink = CAL_LINK,
}: CalButtonProps) {
	useEffect(() => {
		(async () => {
			const cal = await getCalApi({ namespace: CAL_NAMESPACE });
			cal("ui", {
				theme: "dark",
				hideEventTypeDetails: false,
				layout: "month_view",
				cssVarsPerTheme: {
					dark: { "cal-brand": "#3fc6dc" },
					light: { "cal-brand": "#3fc6dc" },
				},
			});
		})();
	}, []);

	return (
		<button
			type="button"
			data-cal-namespace={CAL_NAMESPACE}
			data-cal-link={calLink}
			data-cal-config='{"layout":"month_view","theme":"dark"}'
			className={cn(
				"cursor-pointer rounded bg-relay-cyan font-mono font-semibold text-relay-bg transition-all hover:bg-relay-bright hover:shadow-[0_0_28px_rgba(63,198,220,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-relay-cyan",
				size === "lg" ? "px-6 py-3.5 text-[13px]" : "px-4.5 py-2.5 text-xs",
				className,
			)}
		>
			{children}
		</button>
	);
}

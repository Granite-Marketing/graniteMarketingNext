export const CAL_LINK = "sanindo/30min";
export const CAL_NAMESPACE = "30min";

export const navLinks = [
	{ label: "services", href: "/#services" },
	{ label: "process", href: "/#process" },
	{ label: "results", href: "/#results" },
	{ label: "templates", href: "/templates" },
	{ label: "blog", href: "/blog" },
];

/**
 * Real figures from the n8n dashboards, 2026-07-02.
 * 26 = unique workflows per Stephen (60+ built, ~26 unique).
 * 165+ hrs = "Time saved" on the Syntech instance.
 * 99.8% = weighted success across both instances
 * (granite: 1,451 runs at 0.1% failure; syntech: 347 runs at 0.9%).
 */
export const resultStats = [
	{
		value: "26",
		suffix: "",
		label: "unique workflows in production across client stacks",
	},
	{
		value: "165",
		suffix: "+ hrs",
		label: "returned to a single client team so far",
	},
	{
		value: "99.8",
		suffix: "%",
		label: "run success rate across production executions",
	},
];

export const integrations = [
	"n8n",
	"OpenAI",
	"Slack",
	"HubSpot",
	"Notion",
	"Airtable",
];


export type Capability = {
	tag: string;
	title: string;
	description: string;
	featured?: boolean;
	snippet?: string[];
};

export const capabilities: Capability[] = [
	{
		tag: "agents",
		title: "AI Agents",
		description:
			"Purpose-built agents for support, triage and operations. Trained on your business, working every hour of every day.",
		featured: true,
		snippet: [
			"triaged 14 tickets, routed 3 to humans",
			"drafted 6 replies, queued for review",
		],
	},
	{
		tag: "pipeline",
		title: "Lead generation",
		description:
			"Pipelines that find, enrich and qualify prospects around the clock. Warm, scored leads in your CRM, not raw lists.",
		featured: true,
		snippet: [
			"212 prospects sourced this week",
			"47 qualified · 9 booked calls",
		],
	},
	{
		tag: "ops",
		title: "Project management",
		description:
			"Status updates, task routing and handoffs that happen on their own. Projects move without being pushed.",
	},
	{
		tag: "publishing",
		title: "Content generation",
		description:
			"Briefs become drafts, drafts become posts. Tuned to your voice, running on your schedule.",
	},
	{
		tag: "intel",
		title: "Research assistant",
		description:
			"Market scans and briefing docs compiled overnight, ready before standup.",
	},
	{
		tag: "enablement",
		title: "Educational tools",
		description:
			"Onboarding flows and internal academies that train teams without meetings.",
	},
];

export const processSteps = [
	{
		index: "01 / map",
		title: "Map it out",
		description:
			"We listen to how your team moves through each day and find where time gets lost. Then we pick the workflow with the fastest payback.",
		duration: "week 1 · one call plus an async audit",
	},
	{
		index: "02 / design",
		title: "Design it",
		description:
			"The automation takes shape in n8n, built to fit your exact workflow without forcing change. You sign off a blueprint before we build a thing.",
		duration: "week 2 · a blueprint you approve",
	},
	{
		index: "03 / deploy",
		title: "Deploy it",
		description:
			"The workflow goes live with monitoring and alerting wired in. Your systems talk. The work that took a morning takes minutes.",
		duration: "week 3 · live, monitored, documented",
	},
];

export const footerColumns = [
	{
		heading: "Site",
		links: [
			{ label: "Services", href: "/#services" },
			{ label: "Process", href: "/#process" },
			{ label: "Results", href: "/#results" },
			{ label: "Testimonials", href: "/#testimonials" },
			{ label: "FAQs", href: "/#faq" },
		],
	},
	{
		heading: "Resources",
		links: [
			{ label: "Blog", href: "/blog" },
			{ label: "Templates", href: "/templates" },
			{ label: "Contact", href: "/contact" },
		],
	},
];

/**
 * Wise account compliance requirements. The copyright wording,
 * card scheme logos and these five policy links must stay intact.
 * Do not reword or remove without checking with Stephen.
 */
export const complianceLinks = [
	{ label: "Privacy", href: "/privacy" },
	{ label: "Cookies", href: "/cookies" },
	{ label: "Terms", href: "/terms" },
	{ label: "Refund Policy", href: "/refund-policy" },
	{ label: "Delivery Policy", href: "/delivery-policy" },
];

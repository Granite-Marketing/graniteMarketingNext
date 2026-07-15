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
		tag: "crm-ops",
		title: "CRM & marketing automation",
		description:
			"Bounce detection, lead routing, lifecycle emails and handoffs that keep your CRM trustworthy. Safe actions run themselves; judgement calls land in Slack.",
		featured: true,
		snippet: [
			"flagged 12 repeat bounces in hubspot",
			"cleanup queued in slack for approval",
		],
	},
	{
		tag: "intel",
		title: "Market intelligence",
		description:
			"Hundreds of sources monitored, duplicates removed, relevance judged by AI. A digest of what matters, delivered before standup.",
		featured: true,
		snippet: [
			"scanned 665 sources overnight",
			"digest: 8 stories · 0 duplicates",
		],
	},
	{
		tag: "agents",
		title: "AI Agents",
		description:
			"Purpose-built agents for support, triage and operations. Working around the clock, handing the hard cases to a human.",
	},
	{
		tag: "content",
		title: "Content systems",
		description:
			"From trusted sources to on-brand drafts to a named reviewer. A pipeline your team controls, not a tool to babysit.",
	},
	{
		tag: "ops",
		title: "Ops automation",
		description:
			"Status updates, task routing and handoffs that happen on their own. Projects move without being pushed along by hand.",
	},
	{
		tag: "platforms",
		title: "Custom platforms",
		description:
			"Dashboards, admin panels and full web platforms. Built when an automation needs a home, and run in production by us.",
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
			"The system takes shape on whatever fits the job: an n8n workflow, custom code or a full app. What needs sign-off waits for you.",
		duration: "week 2 · a blueprint you approve",
	},
	{
		index: "03 / deploy",
		title: "Deploy it",
		description:
			"The workflow goes live with monitoring and alerting wired in. When something fails, you hear it from us, not from a customer.",
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

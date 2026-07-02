const NODE = "fill-relay-raised stroke-relay-line";
const LABEL =
	"fill-relay-faint font-mono text-[9px] uppercase tracking-[0.12em]";
const TEXT = "fill-relay-ink font-mono text-xs";
const WIRE = "fill-none stroke-relay-line stroke-2";
const PULSE = "fill-none stroke-relay-cyan stroke-2 animate-relay-dash";

/**
 * Illustrative n8n-style execution trace for the hero.
 * Pure SVG with CSS-only pulses along the wires.
 */
export function WorkflowDiagram() {
	return (
		<svg
			viewBox="0 0 460 380"
			role="img"
			aria-label="Diagram of an automated lead qualification workflow"
			className="block h-auto w-full"
		>
			<path className={WIRE} d="M124,74 V106" />
			<path className={WIRE} d="M124,158 V206" />
			<path className={WIRE} d="M124,158 V182 H342 V206" />
			<path className={WIRE} d="M124,258 V306" />

			<path
				className={PULSE}
				style={{ strokeDasharray: "5 90" }}
				d="M124,74 V106"
			/>
			<path
				className={PULSE}
				style={{ strokeDasharray: "5 90", animationDelay: "1s" }}
				d="M124,158 V206 M124,258 V306"
			/>
			<path
				className={PULSE}
				style={{ strokeDasharray: "5 90", animationDelay: "2s" }}
				d="M124,158 V182 H342 V206"
			/>

			<rect className={NODE} x="24" y="22" width="200" height="52" rx="6" />
			<text className={LABEL} x="40" y="43">
				Webhook
			</text>
			<text className={TEXT} x="40" y="60">
				New lead received
			</text>

			<rect className={NODE} x="24" y="106" width="200" height="52" rx="6" />
			<text className={LABEL} x="40" y="127">
				OpenAI
			</text>
			<text className={TEXT} x="40" y="144">
				Enrich &amp; score lead
			</text>

			<rect className={NODE} x="24" y="206" width="200" height="52" rx="6" />
			<text className={LABEL} x="40" y="227">
				HubSpot · score ≥ 80
			</text>
			<text className={TEXT} x="40" y="244">
				Create deal, assign owner
			</text>

			<rect className={NODE} x="248" y="206" width="188" height="52" rx="6" />
			<text className={LABEL} x="264" y="227">
				Email · score &lt; 80
			</text>
			<text className={TEXT} x="264" y="244">
				Add to nurture sequence
			</text>

			<rect className={NODE} x="24" y="306" width="200" height="52" rx="6" />
			<text className={LABEL} x="40" y="327">
				Slack
			</text>
			<text className={TEXT} x="40" y="344">
				Alert #sales with summary
			</text>
		</svg>
	);
}

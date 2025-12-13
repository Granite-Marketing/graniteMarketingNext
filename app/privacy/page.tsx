import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const metadata = {
	title: "Privacy Policy - Granite Marketing",
	description: "Privacy policy for Granite Marketing.",
};

export default function PrivacyPage() {
	return (
		<>
			<Navigation />
			<main className="min-h-screen pt-32 pb-16">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-4xl md:text-5xl font-semibold mb-8">Privacy Policy</h1>
						<div className="prose prose-lg dark:prose-invert max-w-none">
							<p className="text-muted-foreground">
								Content will be added here.
							</p>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}


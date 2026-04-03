import Link from "next/link";
import {
	getInitialSearchTerms,
	getRegions,
	getStats,
	getTopCategories,
} from "@/lib/data";

export default function Home() {
	const stats = getStats();
	const categories = getTopCategories(5);
	const regions = getRegions().slice(0, 5);
	const searchTerms = getInitialSearchTerms();

	return (
		<main className="max-w-[1120px] mx-auto px-4 sm:px-6">
			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-5 sm:py-6">
				<StatCard
					number={stats.total.toLocaleString("no-NO")}
					label="Totalt registrert"
					color="text-[var(--green-900)]"
				/>
				<StatCard
					number={stats.confirmed.toLocaleString("no-NO")}
					label="Bekreftet netthandel"
					color="text-[var(--green-900)]"
				/>
				<StatCard
					number={stats.probable.toLocaleString("no-NO")}
					label="Sannsynlig netthandel"
					color="text-[var(--amber-800)]"
				/>
			</div>

			{/* Search */}
			<form action="/sok" method="get" className="pb-6">
				<div className="flex flex-col sm:flex-row gap-3">
					<input
						type="text"
						name="q"
						placeholder="Søk etter selskap, kategori eller sted..."
						className="flex-1 px-4 py-3.5 border-[1.5px] border-[var(--border)] rounded-lg text-[16px] sm:text-[16px] outline-none focus:border-[var(--green-900)] bg-[var(--surface)] placeholder:text-[#A3A3A0]"
					/>
					<button
						type="submit"
						className="px-7 py-3.5 bg-[var(--green-900)] text-white rounded-md font-[family-name:Satoshi,system-ui,sans-serif] font-medium text-[15px] sm:text-[15px] hover:bg-[var(--green-800)] transition-colors"
					>
						Søk
					</button>
				</div>
			</form>

			{/* Breakdowns */}
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-8">
				<BreakdownCard
					title="Kategorier"
					items={categories}
					linkPrefix="kategori"
				/>
				<div className="hidden sm:block">
					<BreakdownCard
						title="Etter region"
						items={regions}
						linkPrefix="fylke"
					/>
				</div>
				<SearchTermsCard terms={searchTerms} />
			</div>
		</main>
	);
}

function StatCard({
	number,
	label,
	color,
}: {
	number: string;
	label: string;
	color: string;
}) {
	return (
		<div className="bg-[var(--surface)] rounded-md p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] text-center">
			<div
				className={`font-[family-name:Satoshi,system-ui,sans-serif] text-[26px] sm:text-[30px] font-bold tabular-nums ${color}`}
			>
				{number}
			</div>
			<div className="text-[16px] text-[var(--muted)] mt-1">{label}</div>
		</div>
	);
}

function BreakdownCard({
	title,
	items,
	linkPrefix,
}: {
	title: string;
	items: [string, number][];
	linkPrefix: string;
}) {
	return (
		<div className="bg-[var(--surface)] rounded-md p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]">
			<h3 className="font-[family-name:Satoshi,system-ui,sans-serif] font-semibold text-[15px] mb-3.5">
				{title}
			</h3>
			{items.map(([name, count]) => (
				<div
					key={name}
					className="flex justify-between py-[7px] sm:py-[7px] text-[16px]"
				>
					<Link
						href={`/sok?${linkPrefix}=${encodeURIComponent(name)}&status=all`}
						className="text-[var(--green-900)] hover:underline truncate mr-2"
					>
						{name.length > 30 ? name.slice(0, 30) + "..." : name}
					</Link>
					<span className="text-[var(--muted)] font-medium shrink-0 tabular-nums">
						{count.toLocaleString("no-NO")}
					</span>
				</div>
			))}
		</div>
	);
}

function SearchTermsCard({ terms }: { terms: string[] }) {
	return (
		<div className="bg-[var(--surface)] rounded-md p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]">
			<h3 className="font-[family-name:Satoshi,system-ui,sans-serif] font-semibold text-[15px] mb-3.5">
				Søkeord
			</h3>
			{terms.map((term) => (
				<div key={term} className="py-[7px] text-[16px]">
					<Link
						href={`/sok?q=${encodeURIComponent(term.toLowerCase())}&status=all`}
						className="text-[var(--green-900)] hover:underline"
					>
						{term}
					</Link>
				</div>
			))}
		</div>
	);
}

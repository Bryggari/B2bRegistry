import Link from "next/link";
import {
	getPlatforms,
	getRegions,
	getStats,
	getTopIndustries,
} from "@/lib/data";

export default function Home() {
	const stats = getStats();
	const industries = getTopIndustries();
	const regions = getRegions();
	const platforms = getPlatforms();

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6">
			{/* Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-5 sm:py-6">
				<StatCard
					number={stats.total.toLocaleString("no-NO")}
					label="Totalt registrert"
					color="text-blue-700"
				/>
				<StatCard
					number={stats.confirmed.toLocaleString("no-NO")}
					label="Bekreftet netthandel"
					color="text-emerald-600"
				/>
				<StatCard
					number={stats.probable.toLocaleString("no-NO")}
					label="Sannsynlig netthandel"
					color="text-amber-600"
				/>
				<StatCard
					number={(stats.confirmed + stats.probable).toLocaleString("no-NO")}
					label="Totalt med netthandel"
					color="text-blue-700"
				/>
			</div>

			{/* Search */}
			<form action="/sok" method="get" className="pb-6">
				<div className="flex gap-3">
					<input
						type="text"
						name="q"
						placeholder="Sok etter selskap, bransje, eller sted..."
						className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-base outline-none focus:border-blue-500 bg-white"
					/>
					<button
						type="submit"
						className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium text-base hover:bg-blue-800"
					>
						Sok
					</button>
				</div>
			</form>

			{/* Breakdowns */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8">
				<BreakdownCard
					title="Topp bransjer"
					items={industries}
					linkPrefix="q"
				/>
				<BreakdownCard
					title="Etter region"
					items={regions}
					linkPrefix="fylke"
				/>
				<BreakdownCard
					title="Plattformer"
					items={platforms}
					linkPrefix="platform"
				/>
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
		<div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
			<div className={`text-2xl sm:text-3xl font-bold ${color}`}>{number}</div>
			<div className="text-xs sm:text-sm text-gray-500 mt-1">{label}</div>
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
		<div className="bg-white border border-gray-200 rounded-xl p-5">
			<h3 className="font-semibold text-[15px] mb-3">{title}</h3>
			{items.map(([name, count]) => (
				<div
					key={name}
					className="flex justify-between py-1.5 sm:py-1 text-sm sm:text-[13px]"
				>
					<Link
						href={`/sok?${linkPrefix}=${encodeURIComponent(name)}&status=all`}
						className="text-blue-700 hover:underline truncate mr-2"
					>
						{name.length > 45 ? name.slice(0, 45) + "..." : name}
					</Link>
					<span className="text-gray-500 font-medium shrink-0">{count}</span>
				</div>
			))}
		</div>
	);
}

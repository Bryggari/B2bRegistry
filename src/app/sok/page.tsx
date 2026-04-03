import Link from "next/link";
import { getFylker, getPlatformNames, searchCompanies } from "@/lib/data";
import type { Company } from "@/types";

const PER_PAGE = 50;

export default async function SokPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | undefined>>;
}) {
	const params = await searchParams;
	const q = params.q || "";
	const fylke = params.fylke || "";
	const platform = params.platform || "";
	const status = params.status || "confirmed";
	const page = Math.max(1, parseInt(params.page || "1", 10));

	const all = searchCompanies({ q, fylke, platform, status });
	const totalPages = Math.ceil(all.length / PER_PAGE);
	const results = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	const fylker = getFylker();
	const platforms = getPlatformNames();

	return (
		<>
			{/* Sticky search */}
			<div className="sticky top-[49px] sm:top-[57px] z-40 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
				<form action="/sok" method="get" className="max-w-7xl mx-auto">
					<div className="flex gap-3">
						<input
							type="text"
							name="q"
							defaultValue={q}
							placeholder="Sok etter selskap, bransje, eller sted..."
							className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-base outline-none focus:border-blue-500 bg-white"
						/>
						<button
							type="submit"
							className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium text-base hover:bg-blue-800 shrink-0"
						>
							Sok
						</button>
					</div>

					{/* Desktop filters */}
					<div className="hidden sm:flex gap-3 mt-3">
						<SelectFilter
							name="fylke"
							value={fylke}
							label="Alle regioner"
							options={fylker}
						/>
						<SelectFilter
							name="platform"
							value={platform}
							label="Alle plattformer"
							options={platforms}
						/>
						<SelectFilter
							name="status"
							value={status}
							label=""
							options={["all", "confirmed", "probable"]}
							labels={["Alle", "Bekreftet", "Sannsynlig"]}
						/>
					</div>

					{/* Mobile filter details/summary */}
					<details className="sm:hidden mt-3">
						<summary className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium cursor-pointer">
							Filtre
							{fylke || platform || status !== "confirmed" ? " (aktive)" : ""}
						</summary>
						<div className="flex flex-col gap-3 mt-3">
							<SelectFilter
								name="fylke"
								value={fylke}
								label="Alle regioner"
								options={fylker}
								mobile
							/>
							<SelectFilter
								name="platform"
								value={platform}
								label="Alle plattformer"
								options={platforms}
								mobile
							/>
							<SelectFilter
								name="status"
								value={status}
								label=""
								options={["all", "confirmed", "probable"]}
								labels={["Alle", "Bekreftet", "Sannsynlig"]}
								mobile
							/>
							<button
								type="submit"
								className="w-full py-3.5 bg-blue-700 text-white rounded-lg font-medium text-base"
							>
								Bruk filtre
							</button>
						</div>
					</details>
				</form>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				{/* Results header */}
				<div className="flex justify-between items-center py-4 text-sm text-gray-500">
					<span>{all.length.toLocaleString("no-NO")} resultater</span>
					{totalPages > 1 && (
						<span>
							Side {page} av {totalPages}
						</span>
					)}
				</div>

				{/* Company list */}
				<div className="pb-8 space-y-3">
					{results.map((c) => (
						<CompanyCard key={c.org_nr} company={c} />
					))}

					{results.length === 0 && (
						<div className="text-center py-12 text-gray-500">
							<p className="text-base">Ingen resultater funnet.</p>
							<p className="text-sm mt-2">
								Prov et annet sokeord eller fjern filtre.
							</p>
						</div>
					)}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<Pagination
						page={page}
						totalPages={totalPages}
						q={q}
						fylke={fylke}
						platform={platform}
						status={status}
					/>
				)}
			</div>
		</>
	);
}

function CompanyCard({ company: c }: { company: Company }) {
	const siteUrl = c.url || (c.hjemmeside ? `https://${c.hjemmeside}` : null);

	return (
		<div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-sm transition-shadow">
			<Link href={`/selskap/${c.org_nr}`} className="block">
				{/* Top: name + badges */}
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
					<h3 className="text-base sm:text-[17px] font-semibold leading-tight">
						{c.name}
					</h3>
					<div className="flex gap-1.5 shrink-0">
						{c.has_webshop === "confirmed" ? (
							<span className="inline-block px-2.5 py-1 sm:py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold uppercase tracking-wide">
								Bekreftet
							</span>
						) : (
							<span className="inline-block px-2.5 py-1 sm:py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-semibold uppercase tracking-wide">
								Sannsynlig
							</span>
						)}
						{c.webshop_platform && (
							<span className="inline-block px-2.5 py-1 sm:py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold uppercase tracking-wide">
								{c.webshop_platform}
							</span>
						)}
					</div>
				</div>

				{/* Meta — stacked on mobile, inline on desktop */}
				<div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 gap-1 mt-2.5 text-sm sm:text-[13px] text-gray-500">
					<span>
						{c.kommune}
						{c.fylke ? `, ${c.fylke}` : ""}
					</span>
					<span>{c.antall_ansatte || 0} ansatte</span>
					<span>Org: {c.org_nr}</span>
				</div>

				<p className="text-sm sm:text-[13px] text-gray-500 mt-1.5">
					{c.nace_desc}
				</p>
			</Link>

			{/* Website link */}
			{siteUrl && (
				<>
					{/* Desktop: text link */}
					<div className="hidden sm:block mt-1.5">
						<a
							href={siteUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[13px] text-blue-700 hover:underline break-all"
						>
							{c.hjemmeside}
						</a>
					</div>
					{/* Mobile: full-width button */}
					<div className="sm:hidden mt-3">
						<a
							href={siteUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="block py-3 px-4 bg-blue-50 text-blue-700 border border-blue-700 rounded-lg text-[15px] font-medium text-center"
						>
							Besok nettside
						</a>
					</div>
				</>
			)}

			{/* Signals */}
			{c.signals && (
				<div className="flex flex-wrap gap-1.5 sm:gap-1 mt-2.5 sm:mt-2">
					{c.signals.split("; ").map((s) => (
						<span
							key={s}
							className="px-2.5 py-1.5 sm:px-1.5 sm:py-0.5 bg-gray-100 rounded-md sm:rounded text-xs text-gray-500"
						>
							{s}
						</span>
					))}
				</div>
			)}
		</div>
	);
}

function SelectFilter({
	name,
	value,
	label,
	options,
	labels,
	mobile,
}: {
	name: string;
	value: string;
	label: string;
	options: string[];
	labels?: string[];
	mobile?: boolean;
}) {
	return (
		<select
			name={name}
			defaultValue={value}
			className={`border border-gray-200 rounded-lg bg-white text-gray-900 outline-none ${
				mobile ? "w-full px-4 py-3.5 text-base" : "px-3 py-2 text-sm"
			}`}
		>
			{label && <option value="">{label}</option>}
			{options.map((opt, i) => (
				<option key={opt} value={opt}>
					{labels ? labels[i] : opt}
				</option>
			))}
		</select>
	);
}

function Pagination({
	page,
	totalPages,
	q,
	fylke,
	platform,
	status,
}: {
	page: number;
	totalPages: number;
	q: string;
	fylke: string;
	platform: string;
	status: string;
}) {
	function href(p: number) {
		const params = new URLSearchParams();
		if (q) params.set("q", q);
		if (fylke) params.set("fylke", fylke);
		if (platform) params.set("platform", platform);
		if (status) params.set("status", status);
		params.set("page", String(p));
		return `/sok?${params.toString()}`;
	}

	const pages: (number | "...")[] = [];
	for (let p = 1; p <= totalPages; p++) {
		if (p <= 2 || p >= totalPages - 1 || (p >= page - 1 && p <= page + 1)) {
			pages.push(p);
		} else if (pages[pages.length - 1] !== "...") {
			pages.push("...");
		}
	}

	return (
		<div className="flex justify-center flex-wrap gap-2 pb-8">
			{page > 1 && (
				<Link
					href={href(page - 1)}
					className="px-4 py-3 sm:py-2 border border-gray-200 rounded-lg text-sm hover:bg-blue-50"
				>
					Forrige
				</Link>
			)}
			{pages.map((p, i) =>
				p === "..." ? (
					<span
						key={`dots-${i}`}
						className="px-3 py-3 sm:py-2 text-sm text-gray-400"
					>
						...
					</span>
				) : p === page ? (
					<span
						key={p}
						className="px-4 py-3 sm:py-2 bg-blue-700 text-white rounded-lg text-sm font-medium min-w-[44px] text-center"
					>
						{p}
					</span>
				) : (
					<Link
						key={p}
						href={href(p)}
						className="px-4 py-3 sm:py-2 border border-gray-200 rounded-lg text-sm hover:bg-blue-50 min-w-[44px] text-center"
					>
						{p}
					</Link>
				),
			)}
			{page < totalPages && (
				<Link
					href={href(page + 1)}
					className="px-4 py-3 sm:py-2 border border-gray-200 rounded-lg text-sm hover:bg-blue-50"
				>
					Neste
				</Link>
			)}
		</div>
	);
}

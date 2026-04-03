import Link from "next/link";
import { getCategoryNames, getFylker, searchCompanies } from "@/lib/data";
import type { Company } from "@/types";

const PER_PAGE = 50;

export default async function SokPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | undefined>>;
}) {
	const rawParams = await searchParams;
	const first = (v: string | string[] | undefined) =>
		Array.isArray(v) ? v[0] : v;
	const q = first(rawParams.q) || "";
	const fylke = first(rawParams.fylke) || "";
	const kategori = first(rawParams.kategori) || "";
	const status = first(rawParams.status) || "confirmed";
	const page = Math.max(1, parseInt(first(rawParams.page) || "1", 10));

	const all = searchCompanies({ q, fylke, kategori, status });
	const totalPages = Math.ceil(all.length / PER_PAGE);
	const results = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	const fylker = getFylker();
	const categoryNames = getCategoryNames();

	return (
		<>
			{/* Sticky search */}
			<div className="sticky top-[49px] sm:top-[57px] z-40 bg-[var(--surface)] border-b border-[var(--border)] px-4 sm:px-6 py-4">
				<form action="/sok" method="get" className="max-w-[1120px] mx-auto">
					<div className="flex flex-col sm:flex-row gap-3">
						<input
							type="text"
							name="q"
							defaultValue={q}
							placeholder="Søk etter selskap, kategori eller sted..."
							className="flex-1 px-4 py-3.5 border-[1.5px] border-[var(--border)] rounded-lg text-[16px] outline-none focus:border-[var(--green-900)] bg-[var(--surface)] placeholder:text-[#A3A3A0]"
						/>
						<button
							type="submit"
							className="px-7 py-3.5 bg-[var(--green-900)] text-white rounded-md font-[family-name:Satoshi,system-ui,sans-serif] font-medium text-[15px] hover:bg-[var(--green-800)] transition-colors shrink-0"
						>
							Søk
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
							name="kategori"
							value={kategori}
							label="Alle kategorier"
							options={categoryNames}
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
						<summary className="px-4 py-3.5 bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-lg text-[15px] font-medium cursor-pointer">
							Filtre
							{fylke || kategori || status !== "confirmed" ? " (aktive)" : ""}
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
								name="kategori"
								value={kategori}
								label="Alle kategorier"
								options={categoryNames}
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
								className="w-full py-3.5 bg-[var(--green-900)] text-white rounded-lg font-medium text-[16px]"
							>
								Bruk filtre
							</button>
						</div>
					</details>
				</form>
			</div>

			<div className="max-w-[1120px] mx-auto px-4 sm:px-6">
				{/* Results header */}
				<div className="flex justify-between items-center py-4 text-[14px] text-[var(--muted)]">
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
						<div className="text-center py-12 text-[var(--muted)]">
							<p className="text-[16px]">Ingen resultater funnet.</p>
							<p className="text-[14px] mt-2">
								Prøv et annet søkeord eller fjern filtre.
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
						kategori={kategori}
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
		<div className="bg-[var(--surface)] rounded-md p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.06)] transition-shadow">
			<Link href={`/selskap/${c.org_nr}`} className="block">
				{/* Top: name + badges */}
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
					<h3 className="font-[family-name:Satoshi,system-ui,sans-serif] text-[18px] sm:text-[17px] font-semibold leading-tight">
						{c.name}
					</h3>
					<div className="flex gap-1.5 shrink-0">
						{c.has_webshop === "confirmed" ? (
							<span className="inline-block px-2.5 py-1 bg-[var(--green-50)] text-[var(--green-900)] rounded text-[12px] font-semibold uppercase tracking-wide">
								Bekreftet
							</span>
						) : (
							<span className="inline-block px-2.5 py-1 bg-[var(--amber-50)] text-[var(--amber-800)] rounded text-[12px] font-semibold uppercase tracking-wide">
								Sannsynlig
							</span>
						)}
						{c.webshop_platform && (
							<span className="inline-block px-2.5 py-1 bg-[var(--blue-50)] text-[var(--blue-700)] rounded text-[12px] font-semibold uppercase tracking-wide">
								{c.webshop_platform}
							</span>
						)}
					</div>
				</div>

				{/* Meta */}
				<div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 gap-1 mt-2.5 text-[15px] sm:text-[14px] text-[var(--muted)]">
					<span>
						{c.kommune}
						{c.fylke ? `, ${c.fylke}` : ""}
					</span>
					<span>{c.antall_ansatte || 0} ansatte</span>
					<span>Org: {c.org_nr}</span>
				</div>

				<p className="text-[15px] sm:text-[14px] text-[var(--muted)] mt-1.5">
					{c.nace_desc}
				</p>
			</Link>

			{/* Website link */}
			{siteUrl && (
				<>
					{/* Desktop */}
					<div className="hidden sm:block mt-2">
						<a
							href={siteUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[15px] font-medium text-[var(--green-900)] hover:underline inline-flex items-center gap-1"
						>
							{c.hjemmeside}
							<span className="text-[13px] opacity-60">↗</span>
						</a>
					</div>
					{/* Mobile */}
					<div className="sm:hidden mt-3.5">
						<a
							href={siteUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-1.5 py-3.5 px-4 bg-[var(--green-900)] text-white rounded-md text-[16px] font-medium"
						>
							{c.hjemmeside}
							<span className="text-[14px] opacity-70">↗</span>
						</a>
					</div>
				</>
			)}

			{/* Signals */}
			{c.signals && (
				<div className="flex flex-wrap gap-1.5 sm:gap-1.5 mt-2.5 sm:mt-2.5">
					{c.signals.split("; ").map((s) => (
						<span
							key={s}
							className="px-2.5 py-1.5 sm:py-1 bg-[#F3F3F1] rounded text-[13px] text-[var(--muted)]"
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
			className={`border-[1.5px] border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text)] outline-none ${
				mobile ? "w-full px-4 py-3.5 text-[16px]" : "px-3.5 py-2.5 text-[14px]"
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
	kategori,
	status,
}: {
	page: number;
	totalPages: number;
	q: string;
	fylke: string;
	kategori: string;
	status: string;
}) {
	function href(p: number) {
		const params = new URLSearchParams();
		if (q) params.set("q", q);
		if (fylke) params.set("fylke", fylke);
		if (kategori) params.set("kategori", kategori);
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
					className="px-4 py-3 sm:py-2 border border-[var(--border)] rounded-lg text-[14px] hover:bg-[var(--green-50)] min-h-[44px] flex items-center"
				>
					Forrige
				</Link>
			)}
			{pages.map((p, i) =>
				p === "..." ? (
					<span
						key={`dots-${i}`}
						className="px-3 py-3 sm:py-2 text-[14px] text-[var(--muted)]"
					>
						...
					</span>
				) : p === page ? (
					<span
						key={p}
						className="px-4 py-3 sm:py-2 bg-[var(--green-900)] text-white rounded-lg text-[14px] font-medium min-w-[44px] min-h-[44px] flex items-center justify-center"
					>
						{p}
					</span>
				) : (
					<Link
						key={p}
						href={href(p)}
						className="px-4 py-3 sm:py-2 border border-[var(--border)] rounded-lg text-[14px] hover:bg-[var(--green-50)] min-w-[44px] min-h-[44px] flex items-center justify-center"
					>
						{p}
					</Link>
				),
			)}
			{page < totalPages && (
				<Link
					href={href(page + 1)}
					className="px-4 py-3 sm:py-2 border border-[var(--border)] rounded-lg text-[14px] hover:bg-[var(--green-50)] min-h-[44px] flex items-center"
				>
					Neste
				</Link>
			)}
		</div>
	);
}

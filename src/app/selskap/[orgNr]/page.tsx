import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCompanies, getCompany } from "@/lib/data";

export function generateStaticParams() {
	return getAllCompanies().map((c) => ({ orgNr: c.org_nr }));
}

export default async function SelskapPage({
	params,
}: {
	params: Promise<{ orgNr: string }>;
}) {
	const { orgNr } = await params;
	const c = getCompany(orgNr);
	if (!c) notFound();

	const siteUrl = c.url || (c.hjemmeside ? `https://${c.hjemmeside}` : null);
	const signals = c.signals ? c.signals.split("; ") : [];

	return (
		<main className="max-w-[1120px] mx-auto px-4 sm:px-6">
			{/* Header */}
			<div className="pt-5 sm:pt-8 pb-4">
				<div className="flex flex-wrap gap-2 mb-2">
					{c.has_webshop === "confirmed" ? (
						<span className="px-2.5 py-1 bg-[var(--green-50)] text-[var(--green-900)] rounded text-[12px] font-semibold uppercase">
							Bekreftet netthandel
						</span>
					) : (
						<span className="px-2.5 py-1 bg-[var(--amber-50)] text-[var(--amber-800)] rounded text-[12px] font-semibold uppercase">
							Sannsynlig netthandel
						</span>
					)}
					{c.webshop_platform && (
						<span className="px-2.5 py-1 bg-[var(--blue-50)] text-[var(--blue-700)] rounded text-[12px] font-semibold uppercase">
							{c.webshop_platform}
						</span>
					)}
				</div>
				<h1 className="font-[family-name:Satoshi,system-ui,sans-serif] text-[22px] sm:text-[26px] font-bold">
					{c.name}
				</h1>

				{siteUrl && (
					<>
						{/* Desktop */}
						<a
							href={siteUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hidden sm:inline-flex items-center gap-1 mt-2 text-[16px] font-medium text-[var(--green-900)] hover:underline"
						>
							{c.hjemmeside}
							<span className="text-[14px] opacity-60">↗</span>
						</a>
						{/* Mobile */}
						<a
							href={siteUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="sm:hidden flex items-center justify-center gap-1.5 mt-3 py-3.5 px-4 bg-[var(--green-900)] text-white rounded-md text-[16px] font-medium"
						>
							{c.hjemmeside}
							<span className="text-[14px] opacity-70">↗</span>
						</a>
					</>
				)}
			</div>

			{/* Info grid — 2x2 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
				<InfoCard title="Kontakt">
					<InfoRow
						label="Adresse"
						value={`${c.kommune || "-"}${c.fylke ? `, ${c.fylke}` : ""}`}
					/>
					<InfoRow
						label="Nettside"
						value={
							siteUrl ? (
								<a
									href={siteUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[var(--green-900)] hover:underline"
								>
									{c.hjemmeside}
								</a>
							) : (
								"-"
							)
						}
					/>
					<InfoRow
						label="E-post"
						value={
							c.epost ? (
								<a
									href={`mailto:${c.epost}`}
									className="text-[var(--green-900)] hover:underline"
								>
									{c.epost}
								</a>
							) : (
								"-"
							)
						}
					/>
					<InfoRow
						label="Telefon"
						value={
							c.telefon ? (
								<a
									href={`tel:${c.telefon}`}
									className="text-[var(--green-900)] hover:underline"
								>
									{c.telefon}
								</a>
							) : (
								"-"
							)
						}
					/>
				</InfoCard>

				<InfoCard title="Næringsformål">
					{c.formaal ? (
						<p className="text-[15px] sm:text-[15px] leading-relaxed">
							{c.formaal}
						</p>
					) : c.aktivitet ? (
						<p className="text-[15px] sm:text-[15px] leading-relaxed">
							{c.aktivitet}
						</p>
					) : (
						<p className="text-[15px] text-[var(--muted)]">Ikke tilgjengelig</p>
					)}
				</InfoCard>

				<InfoCard title="Selskapsinformasjon">
					<InfoRow label="Organisasjonsnummer" value={c.org_nr} />
					<InfoRow label="Selskapsform" value={c.org_form} />
					<InfoRow label="Ansatte" value={String(c.antall_ansatte || 0)} />
					<InfoRow label="MVA-registrert" value="Ja" />
				</InfoCard>

				<InfoCard title="Bransje">
					<InfoRow label="NACE-kode" value={c.nace_code} />
					<InfoRow label="Beskrivelse" value={c.nace_desc} />
					{c.product_category && (
						<InfoRow label="Kategori" value={c.product_category} />
					)}
				</InfoCard>

				{signals.length > 0 && (
					<div className="sm:col-span-2 bg-[var(--surface)] rounded-md p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]">
						<h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wide mb-3">
							Netthandel-signaler
						</h3>
						<div className="flex flex-wrap gap-2">
							{signals.map((s) => (
								<span
									key={s}
									className="px-3 py-1.5 bg-[#F3F3F1] rounded text-[13px] text-[var(--muted)]"
								>
									{s}
								</span>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="pb-8">
				<Link
					href="/sok"
					className="text-[14px] text-[var(--green-900)] hover:underline"
				>
					← Tilbake til søk
				</Link>
			</div>
		</main>
	);
}

function InfoCard({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="bg-[var(--surface)] rounded-md p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]">
			<h3 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wide mb-3">
				{title}
			</h3>
			{children}
		</div>
	);
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex flex-col sm:flex-row sm:justify-between py-[9px] text-[15px] sm:text-[15px] border-b border-[#F3F3F1] last:border-0">
			<span className="text-[var(--muted)]">{label}</span>
			<span className="font-medium sm:text-right">{value}</span>
		</div>
	);
}

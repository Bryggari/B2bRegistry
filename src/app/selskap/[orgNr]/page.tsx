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
		<main className="max-w-7xl mx-auto px-4 sm:px-6">
			{/* Header */}
			<div className="pt-6 sm:pt-8 pb-4">
				<div className="flex flex-wrap gap-2 mb-2">
					{c.has_webshop === "confirmed" ? (
						<span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold uppercase">
							Bekreftet netthandel
						</span>
					) : (
						<span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded text-xs font-semibold uppercase">
							Sannsynlig netthandel
						</span>
					)}
					{c.webshop_platform && (
						<span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold uppercase">
							{c.webshop_platform}
						</span>
					)}
				</div>
				<h1 className="text-xl sm:text-2xl font-bold">{c.name}</h1>

				{siteUrl && (
					<>
						{/* Desktop link */}
						<a
							href={siteUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hidden sm:inline-block mt-2 text-[15px] text-blue-700 hover:underline"
						>
							{c.hjemmeside}
						</a>
						{/* Mobile button */}
						<a
							href={siteUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="sm:hidden block mt-3 py-3.5 px-4 bg-blue-700 text-white rounded-lg text-base font-medium text-center"
						>
							Besok nettside
						</a>
					</>
				)}
			</div>

			{/* Info grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
				<InfoCard title="Selskapsinformasjon">
					<InfoRow label="Organisasjonsnummer" value={c.org_nr} />
					<InfoRow label="Selskapsform" value={c.org_form} />
					<InfoRow label="Ansatte" value={String(c.antall_ansatte || 0)} />
					<InfoRow label="MVA-registrert" value="Ja" />
				</InfoCard>

				<InfoCard title="Lokasjon">
					<InfoRow label="Kommune" value={c.kommune || "-"} />
					<InfoRow label="Fylke" value={c.fylke || "-"} />
				</InfoCard>

				<InfoCard title="Bransje">
					<InfoRow label="NACE-kode" value={c.nace_code} />
					<InfoRow label="Beskrivelse" value={c.nace_desc} />
				</InfoCard>

				<InfoCard title="Kontakt">
					<InfoRow
						label="Nettside"
						value={
							siteUrl ? (
								<a
									href={siteUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-700 hover:underline"
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
									className="text-blue-700 hover:underline"
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
									className="text-blue-700 hover:underline"
								>
									{c.telefon}
								</a>
							) : (
								"-"
							)
						}
					/>
				</InfoCard>

				{signals.length > 0 && (
					<div className="sm:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
						<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
							Netthandel-signaler
						</h3>
						<div className="flex flex-wrap gap-2">
							{signals.map((s) => (
								<span
									key={s}
									className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-600"
								>
									{s}
								</span>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="pb-8">
				<Link href="/sok" className="text-sm text-blue-700 hover:underline">
					Tilbake til sok
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
		<div className="bg-white border border-gray-200 rounded-xl p-5">
			<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
				{title}
			</h3>
			{children}
		</div>
	);
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex flex-col sm:flex-row sm:justify-between py-1.5 text-sm border-b border-gray-100 last:border-0">
			<span className="text-gray-500">{label}</span>
			<span className="font-medium sm:text-right">{value}</span>
		</div>
	);
}

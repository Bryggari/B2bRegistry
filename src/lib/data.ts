import companiesJson from "@/data/companies.json";
import type { Company } from "@/types";

const companies: Company[] = companiesJson as Company[];

export function getAllCompanies(): Company[] {
	return companies;
}

export function getCompany(orgNr: string): Company | undefined {
	return companies.find((c) => c.org_nr === orgNr);
}

export function getStats() {
	const confirmed = companies.filter(
		(c) => c.has_webshop === "confirmed",
	).length;
	const probable = companies.filter((c) => c.has_webshop === "probable").length;
	return { total: companies.length, confirmed, probable };
}

export function getTopIndustries(limit = 15) {
	const counts: Record<string, number> = {};
	for (const c of companies) {
		if (c.nace_desc) {
			counts[c.nace_desc] = (counts[c.nace_desc] || 0) + 1;
		}
	}
	return Object.entries(counts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit);
}

export function getRegions() {
	const counts: Record<string, number> = {};
	for (const c of companies) {
		if (c.fylke) {
			counts[c.fylke] = (counts[c.fylke] || 0) + 1;
		}
	}
	return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export function getPlatforms() {
	const counts: Record<string, number> = {};
	for (const c of companies) {
		if (c.webshop_platform) {
			counts[c.webshop_platform] = (counts[c.webshop_platform] || 0) + 1;
		}
	}
	return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export function getFylker(): string[] {
	const set = new Set<string>();
	for (const c of companies) {
		if (c.fylke) set.add(c.fylke);
	}
	return [...set].sort();
}

export function getPlatformNames(): string[] {
	const set = new Set<string>();
	for (const c of companies) {
		if (c.webshop_platform) set.add(c.webshop_platform);
	}
	return [...set].sort();
}

export function searchCompanies(params: {
	q?: string;
	fylke?: string;
	platform?: string;
	status?: string;
}): Company[] {
	let results = companies;

	if (params.status === "confirmed") {
		results = results.filter((c) => c.has_webshop === "confirmed");
	} else if (params.status === "probable") {
		results = results.filter((c) => c.has_webshop === "probable");
	}

	if (params.fylke) {
		results = results.filter((c) => c.fylke === params.fylke);
	}

	if (params.platform) {
		results = results.filter((c) => c.webshop_platform === params.platform);
	}

	if (params.q) {
		const q = params.q.toLowerCase();
		results = results.filter(
			(c) =>
				c.name.toLowerCase().includes(q) ||
				(c.nace_desc && c.nace_desc.toLowerCase().includes(q)) ||
				(c.kommune && c.kommune.toLowerCase().includes(q)) ||
				(c.fylke && c.fylke.toLowerCase().includes(q)) ||
				c.org_nr.includes(q) ||
				(c.signals && c.signals.toLowerCase().includes(q)),
		);
	}

	return results;
}

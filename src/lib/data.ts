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

export function getTopCategories(limit = 5): [string, number][] {
	const counts: Record<string, number> = {};
	for (const c of companies) {
		const cat = c.product_category;
		if (cat && !cat.includes("Detaljhandel")) {
			counts[cat] = (counts[cat] || 0) + 1;
		}
	}
	return Object.entries(counts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit) as [string, number][];
}

export function getRegions(): [string, number][] {
	const counts: Record<string, number> = {};
	for (const c of companies) {
		if (c.fylke) {
			counts[c.fylke] = (counts[c.fylke] || 0) + 1;
		}
	}
	return Object.entries(counts).sort((a, b) => b[1] - a[1]) as [
		string,
		number,
	][];
}

export function getInitialSearchTerms(): string[] {
	return ["Varmepumpe", "Sveising", "Betong", "Maling", "Aluminium"];
}

export function getFylker(): string[] {
	const set = new Set<string>();
	for (const c of companies) {
		if (c.fylke) set.add(c.fylke);
	}
	return [...set].sort();
}

export function getCategoryNames(): string[] {
	const set = new Set<string>();
	for (const c of companies) {
		const cat = c.product_category;
		if (cat && !cat.includes("Detaljhandel")) {
			set.add(cat);
		}
	}
	return [...set].sort();
}

export function searchCompanies(params: {
	q?: string;
	fylke?: string;
	kategori?: string;
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

	if (params.kategori) {
		results = results.filter((c) => c.product_category === params.kategori);
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
				(c.signals && c.signals.toLowerCase().includes(q)) ||
				(c.product_category && c.product_category.toLowerCase().includes(q)) ||
				(c.formaal && c.formaal.toLowerCase().includes(q)) ||
				(c.product_keywords &&
					c.product_keywords.some((kw) => kw.toLowerCase().includes(q))),
		);
	}

	return results;
}

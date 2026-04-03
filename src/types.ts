export interface Company {
	org_nr: string;
	name: string;
	hjemmeside: string | null;
	nace_code: string;
	nace_desc: string;
	kommune: string;
	fylke: string;
	antall_ansatte: number;
	epost: string | null;
	telefon: string | null;
	org_form: string;
	formaal: string | null;
	aktivitet: string | null;
	has_webshop: "confirmed" | "probable";
	webshop_platform: string | null;
	signals: string | null;
	url: string | null;
	product_category: string | null;
	product_keywords: string[];
}

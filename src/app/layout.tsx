import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
	title: "B2B Netthandel i Norge",
	description:
		"Komplett oversikt over norske bedrifter med B2B netthandel. Søk etter leverandører, kategorier og regioner.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="no" className={dmSans.variable}>
			<head>
				<link rel="preconnect" href="https://api.fontshare.com" />
				<link
					href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="min-h-screen font-[family-name:var(--font-body)]">
				<header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]">
					<div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
						<Link
							href="/"
							className="font-[family-name:Satoshi,system-ui,sans-serif] text-[17px] sm:text-[19px] font-bold"
						>
							B2B <span className="text-[var(--green-900)]">Netthandel</span> i
							Norge
						</Link>
						<nav className="flex gap-4 sm:gap-6">
							<Link
								href="/"
								className="text-[15px] text-[var(--muted)] hover:text-[var(--text)] font-medium"
							>
								Oversikt
							</Link>
							<Link
								href="/sok"
								className="text-[15px] text-[var(--muted)] hover:text-[var(--text)] font-medium"
							>
								Søk
							</Link>
						</nav>
					</div>
				</header>
				{children}
			</body>
		</html>
	);
}

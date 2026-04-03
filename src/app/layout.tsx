import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "B2B Netthandel Norge",
	description:
		"Komplett oversikt over norske bedrifter med B2B netthandel. Sok etter leverandorer, bransjer og regioner.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="no" className={inter.className}>
			<body className="min-h-screen bg-gray-50 text-gray-900">
				<header className="sticky top-0 z-50 bg-white border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
						<Link href="/" className="text-lg sm:text-xl font-bold">
							B2B <span className="text-blue-700">Netthandel</span> Norge
						</Link>
						<nav className="flex gap-4 sm:gap-6">
							<Link
								href="/"
								className="text-sm sm:text-[15px] text-gray-500 hover:text-gray-900 font-medium"
							>
								Oversikt
							</Link>
							<Link
								href="/sok"
								className="text-sm sm:text-[15px] text-gray-500 hover:text-gray-900 font-medium"
							>
								Sok
							</Link>
						</nav>
					</div>
				</header>
				{children}
			</body>
		</html>
	);
}

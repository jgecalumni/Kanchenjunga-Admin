import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/store/AuthContext";
import Providers from "@/store/provider";
import ReactQueryProvider from "@/store/query-client";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "StudentStay - Admin Dashboard",
	description:
		"Modern student accommodation management system for administrators",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange>
					<Providers>
						<ReactQueryProvider>
							<AuthProvider>
								{children}
								<Toaster
									richColors
									position="top-center"
									theme="light"
								/>
							</AuthProvider>
						</ReactQueryProvider>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}

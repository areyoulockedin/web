import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/providers/theme-provider"
import { ClerkProvider } from "@clerk/nextjs";
// import { AuthProvider } from "@/providers/auth-provider";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://areyoulokced.in'),
  title: "areyoulocked.in",
  description: "coding activity tracker with a public leaderboard, for developers, by developers",
  openGraph: {
    type: "website",
    url: "https://areyoulocked.in",
    title: "areyoulocked.in",
    description: "coding activity tracker with a public leaderboard, for developers, by developers",
    images: "/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    // site: "@heymatty",
    creator: "@voltycodes",
    title: "areyoulocked.in",
    description: "coding activity tracker with a public leaderboard, for developers, by developers",
    images: "/og-image.jpg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {/* <AuthProvider> */}
            <Navbar />
            {children}
            <Footer />
            {/* </AuthProvider> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

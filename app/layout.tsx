import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import SessionProviderWrapper from "@/components/SessionProviderWrapper"; // ✅ Import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter X",
  description: "Twitter X is a Twitter clone built with Next.js and MongoDB.",
  icons: { icon: "/images/x.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Provider>
          <SessionProviderWrapper> {/* ✅ SessionProvider ni Client Component ichiga oldik */}
            {children}
          </SessionProviderWrapper>
        </Provider>
      </body>
    </html>
  );
}

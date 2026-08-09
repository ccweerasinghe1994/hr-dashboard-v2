import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "TeamHub | One place for your people operations",
  description:
    "Recruit, manage, and grow your workforce with TeamHub's connected HR platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full scroll-smooth font-sans antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

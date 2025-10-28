import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "A modern Kanban board built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

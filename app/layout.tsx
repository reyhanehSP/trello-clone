import type { Metadata } from "next";
import "./globals.scss";
import { Inter } from "next/font/google";
import { KanbanProvider } from "@/context/KanbanContext";

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "A modern Kanban board built with Next.js",
};


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <KanbanProvider> {children}</KanbanProvider>
      </body>
    </html>
  );
}

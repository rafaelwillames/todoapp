import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TodoAPP",
  description: "Task management built with Next.js, TypeScript and Tailwind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hangul Wall",
  description: "Media-art style Hangul tile installation display",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

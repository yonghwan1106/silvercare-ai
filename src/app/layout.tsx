import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "실버케어 AI | AI 라이프 아이디어 챌린지",
  description: "독거노인을 위한 스마트 돌봄 서비스 - AI 기반 건강관리, 대화형 케어봇, 응급상황 대응",
  keywords: "실버케어, AI 돌봄, 독거노인, 건강관리, 스마트케어, 노인돌봄",
  authors: [{ name: "SilverCare AI Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

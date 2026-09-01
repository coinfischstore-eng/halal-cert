import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HalalPro - Jasa Pendampingan Sertifikasi Halal",
  description:
    "Layanan pendampingan profesional untuk pengurusan sertifikasi halal produk Anda. Kami membantu UMKM dan pelaku usaha mendapatkan sertifikat halal dengan mudah, cepat, dan tepat.",
  keywords: ["sertifikasi halal", "pendampingan halal", "BPJPH", "halal UMKM", "jasa halal"],
  openGraph: {
    title: "HalalPro - Jasa Pendampingan Sertifikasi Halal",
    description:
      "Layanan pendampingan profesional untuk pengurusan sertifikasi halal produk Anda.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geist.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

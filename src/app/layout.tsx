import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "LimeCredit",
  description: "Fast loans for gig workers. $100 to $10,000.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          toastOptions={{
            style: {
              background: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              color: '#1a1a1a',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}

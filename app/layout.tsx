import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ConditionalLayout from "@/components/common/ConditionalLayout";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "M11",
  description: "M11 - Modern Web Application",
  icons: {
    icon: "/brand-circle.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <div className="overflow-x-hidden">
              <SmoothScroll />
              <Toaster position="top-right" />
              <ConditionalLayout>{children}</ConditionalLayout>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

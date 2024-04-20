import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { Provider } from "./provider";
import { lazy } from "react";
const Header = lazy(() => import("@/components/layout/main/header"));
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ceezar",
  description: "Ceezar - The best way to earn from digital assets",
  generator: "Next.js",
  keywords: [
    "eccomerce",
    "ceezar",
    "ceezar digital store",
    "ecommerce",
    "producthunt",
    "streams of revenue",
    "revenue channels",
    "define revenue stream",
    "stuff you can sell to make money",
    "sell and make money",
    "sell and earn money",
    "selling for profit",
  ],
  verification: {
    google: "",
  },
  openGraph: {
    title: "Ceezar",
    description: "Ceezar - The best way to earn from digital assets",
    url: "https://ceezar.vercel.app",
    siteName: "Ceezar",
    images: [
      {
        url: "https://res.cloudinary.com/derbreilm/image/upload/v1711585591/Ceezar_New_Cover_image_yxf4o9.png",
      },
    ],
    type: "website",
  },
};

const ClerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={ClerkPubKey}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#7148FC",
          borderRadius: "0.375rem",
          colorBackground: "#0b0b0b",
        },
      }}
    >
      <Provider>
        <html lang="en">
          <body className={inter.className}>
            <Header />
            {children}
            <Toaster richColors />
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}

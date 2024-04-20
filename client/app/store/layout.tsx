import type { Metadata } from "next";
import { lazy } from "react";
const Header = lazy(() => import("@/components/layout/main/header"));

export const metadata: Metadata = {
  title: "Store / Ceezar",
  description: "Digital Store",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}

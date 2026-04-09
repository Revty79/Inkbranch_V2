import type { Metadata } from "next";
import type { ReactNode } from "react";

import { APP_TITLE } from "@/lib/constants";

import "./globals.css";

export const metadata: Metadata = {
  title: APP_TITLE,
  description:
    "Planner-first, book-first, world-first interactive fiction platform rebuild."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

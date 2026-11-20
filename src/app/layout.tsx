import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TaskBoard | Task Management Dashboard",
    template: "%s | TaskBoard",
  },
  description: "Manage, track and organise your tasks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
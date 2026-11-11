import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Pepper — Create exam papers", description: "A focused exam paper builder for teachers." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

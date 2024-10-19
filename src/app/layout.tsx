import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { Roboto, Fredoka } from "next/font/google"

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const fredoka = Fredoka({
  weight: ["400", "500", "700",],
  subsets: ["latin"],
  variable: "--font-fredoka",
});

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Glorious Life Church Members Portal",
  description: "Members registration portal for Glorious Life Church",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${fredoka.variable} antialiased bg-[#f6f9ff]`}
      >
      <main>{children}</main>
      <Toaster />
      </body>
    </html>
  );
}

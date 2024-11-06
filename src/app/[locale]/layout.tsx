import {NextIntlClientProvider, useMessages} from 'next-intl';
import { Roboto, Fredoka } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from '@/components/Footer';
import "../globals.css";

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

export default function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = useMessages();
 
  return (
    <html>
      <body className={`${roboto.variable} ${fredoka.variable} antialiased bg-[#f6f9ff]`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Toaster />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
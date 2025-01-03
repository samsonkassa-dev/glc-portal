import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Define locales that your application supports
export const locales = ['en', 'am'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./lang/${locale}.json`)).default
  };
}); 
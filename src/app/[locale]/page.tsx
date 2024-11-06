'use client';

import { FormProvider } from '@/utils/FormContext';


import { MoveRight } from 'lucide-react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';


export default function Home() {
  const t = useTranslations('Home');
  const router = useRouter();

  const handleShowForm = () => {
    router.push('/form');
  };


  return (
    <FormProvider>

        <div className="bg-[#f6f9ff] text-black min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4">
            <main className="text-center"> 
              <div className="md:text-[70px] text-[50px] font-black m-0">
                <h1 className="font-fred font-bold">
                  {t('welcome')} {" "}
                  <span className="text-[#271282]">{t('glorious')}</span> <br />{" "}
                  <span className="text-[#e33901]">{t('church')}</span> {t('portal')}
                </h1>
              </div>
              <div className="text-[20px] font-bold text-[#251212] leading-tight mt-4">
                <p>{t('contact')}</p>
              </div>

              <div className="mt-14">
                <button
                  className="bg-[#175daa] w-48 py-3.5 text-white rounded-[4px] shadow-md flex justify-center items-center space-x-2 group mx-auto"
                  onClick={handleShowForm}
                >
                  <p className="text-lg">{t('register')}</p>
                  <MoveRight className="text-xl transition duration-200 ease-out group-hover:translate-x-1" />
                </button>
              </div>
            </main>
          </div>
        </div>



    </FormProvider>
  );
}
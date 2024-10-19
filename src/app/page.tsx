'use client';

import { FormProvider } from '@/utils/FormContext';
import MultiStepForm from '@/components/Form';
import { useState } from 'react';
import { MoveRight } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <FormProvider>
      {!showForm ? (
        <div className="bg-[#f6f9ff] text-black min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4">
            <main className="text-center"> 
              <div className="md:text-[70px] text-[50px] font-black m-0">
                <h1 className="font-fred font-bold">
                  Welcome to{" "}
                  <span className="text-[#271282]">Glorious Life</span> <br />{" "}
                  <span className="text-[#e33901]">Church</span> Portal!
                </h1>
              </div>
              <div className="text-[20px] font-bold text-[#251212] leading-tight mt-4">
                <p>
                  Contact the Office for any inquiries
                </p>
              </div>

              <div className="mt-14">
                <button
                  className="bg-[#175daa] w-48 py-3.5 text-white rounded-[4px] shadow-md flex justify-center items-center space-x-2 group mx-auto"
                  onClick={() => setShowForm(true)}
                >
                  <p className="text-lg">Register Here</p>
                  <MoveRight className="text-xl transition duration-200 ease-out group-hover:translate-x-1" />
                </button>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <div className="px-5 py-20">
          <MultiStepForm />
        </div>
      )}
      <Footer />
    </FormProvider>
  );
}
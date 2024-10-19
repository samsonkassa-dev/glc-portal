"use client"

import { useFormContext } from '@/utils/FormContext';
import { useRef, useState } from 'react';
import BasicInformationForm from './basicInformation';
import ChurchInformation1 from './churchInformation1';
import ChurchInformation2 from './churchInformation2';
import { Button } from './ui/button';
import { Progress } from "./ui/progress"
import Spinner from './Spinner';

const steps = [
  { id: 1, name: 'Basic Information' },
  { id: 2, name: 'Church Related Information One' },
  { id: 3, name: 'Church Related Information Two' },
  { id: 4, name: '' },
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { formData } = useFormContext();
  const formRefs = useRef<{ [key: number]: { validateAndSave: () => Promise<boolean> } }>({});
  const [isLoading, setIsLoading] = useState(false);

  const registerForm = (step: number, methods: { validateAndSave: () => Promise<boolean> } | null) => {
    if (methods) {
      formRefs.current[step] = methods;
    }
  };

  const nextStep = async () => {
    if (formRefs.current[currentStep]) {
      const isValid = await formRefs.current[currentStep].validateAndSave();
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async () => {
    if (await formRefs.current[3].validateAndSave()) {
      setIsLoading(true);
      console.log(formData);
      // Simulate an API call or processing time
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        setCurrentStep(steps.length);
      }, 2000); // 2 seconds delay, adjust as needed
    }
  };

  const getProgress = () => {
    switch (currentStep) {
      case 1: return 0;
      case 2: return 25;
      case 3: return 75;
      case 4: return 100;
      default: return 0;
    }
  };

  const progress = getProgress();

  return (
    <div className="w-full font-robo max-w-4xl mx-auto p-6 space-y-10 bg-white rounded-lg shadow-md">
      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <div className="text-sm text-gray-500 text-center">{steps[currentStep - 1].name}</div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <Spinner />
          <p className="mt-4 text-gray-600">Processing your registration...</p>
        </div>
      ) : isSubmitted ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Registered Successfully!</h2>
          <p className="text-gray-600">Thank you for completing the form. Your registration has been received.</p>
        </div>
      ) : (
        <>
          {currentStep === 1 && <BasicInformationForm ref={(methods) => registerForm(1, methods)} />}
          {currentStep === 2 && <ChurchInformation1 ref={(methods) => registerForm(2, methods)} />}
          {currentStep === 3 && <ChurchInformation2 ref={(methods) => registerForm(3, methods)} />}
        </>
      )}

      <div className="flex justify-between mt-8">
        {currentStep > 1 && currentStep < steps.length && (
          <Button type="button" onClick={prevStep} variant="outline" className="hover:bg-[#FF9D3D] text-black">
            Back
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="button" onClick={nextStep} className="ml-auto bg-[#FF9D3D] hover:bg-[#f77f07] text-black">
            Next
          </Button>
        )}
        {currentStep === steps.length - 1 && !isSubmitted && (
          <Button type="button" onClick={onSubmit} className="ml-auto bg-[#FF9D3D] hover:bg-[#f77f07] text-black">
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}

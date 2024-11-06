"use client"

import { useFormContext } from '@/utils/FormContext';
import { useRef, useState } from 'react';
import BasicInformationForm from './basicInformation';
import ChurchInformation1 from './churchInformation1';
import ChurchInformation2 from './churchInformation2';
import { Button } from './ui/button';
import { Progress } from "./ui/progress"
import Spinner from './Spinner';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Globe } from 'lucide-react'; // Import Globe icon from lucide-react
import toast from "react-hot-toast";
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { FormStepData, StepNumber } from '@/types/form';


const steps = [
  { id: 1, name: 'Basic Information' },
  { id: 2, name: 'Church Related Information One' },
  { id: 3, name: 'Church Related Information Two' },
  { id: 4, name: 'Form Finished' },
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { formData } = useFormContext();
  const formRefs = useRef<{ [K in StepNumber]?: { validateAndSave: () => Promise<boolean> } }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { submitForm } = useFormSubmission();
  
  // Add translations and locale handling
  const t = useTranslations('Form');
  const locale = useLocale();
  const router = useRouter();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'am' : 'en';
    router.push('/form', {locale: newLocale});
  };

  const registerForm = (step: StepNumber, methods: { validateAndSave: () => Promise<boolean> } | null) => {
    if (methods) {
      formRefs.current[step] = methods;
    }
  };

  const validateFormData = (data: Partial<FormStepData>): data is FormStepData => {
    return Boolean(data[1] && data[2] && data[3]);
  };

  const onSubmit = async () => {
    const finalStepRef = formRefs.current[3];
    if (!finalStepRef?.validateAndSave) {
      return;
    }

    try {
      const isValid = await finalStepRef.validateAndSave();
      if (!isValid) {
        throw new Error('Form validation failed');
      }

      if (!validateFormData(formData)) {
        // console.log(formData);
        throw new Error(t('errorMessages.validation'));
      }

      setIsLoading(true);

      const submissionData = {
        personalInfo: {
          ...formData[1],
          phoneNumber: formData[1].phoneNumber?.trim() || "",
          city: formData[1].city || "",
          subCity: formData[1].subCity || "",
          educationStatus: formData[1].educationStatus || "",
          workStatus: formData[1].workStatus || "",
          jobField: formData[1].jobField || "",
          companyName: formData[1].companyName || "",
          placeOfWork: formData[1].placeOfWork || "",
          placeOfSchool: formData[1].placeOfSchool || "",
          fieldOfStudy: formData[1].fieldOfStudy || "",
        },
        spiritualInfo: {
          ...formData[2],
          ...formData[3],
          inviterFullName: formData[2].inviterFullName?.trim() || undefined,
          inviterPhoneNumber: formData[2].inviterPhoneNumber?.trim() || undefined,
          ministryExperience: formData[3].ministryExperience?.trim() || undefined,
          comments: formData[3].comments?.trim() || undefined,
        },
      };

      await submitForm(submissionData);
      setIsSubmitted(true);
      setCurrentStep(steps.length as StepNumber);
      toast.success(t('success.title'));
      localStorage.removeItem('formData');
    } catch (error) {
      // Check if error is a network error
      if (error instanceof Error && !window.navigator.onLine) {
        toast.error(t('errorMessages.netError'));
      } else {
        toast.error(t('errorMessages.submissionError'));
      }
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const currentStepRef = formRefs.current[currentStep];
    if (!currentStepRef?.validateAndSave) {
      return;
    }

    try {
      const isValid = await currentStepRef.validateAndSave();
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length) as StepNumber);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('errorMessages.validation'));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as StepNumber);
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
    <div className="w-full font-robo max-w-4xl mx-auto p-6 space-y-10 bg-white rounded-lg shadow-md relative">

      <button
        onClick={toggleLocale}
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {locale === 'en' ? 'አማርኛ' : 'English'}
        </span>
      </button>

      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <div className="text-sm text-gray-500 text-center">
          {t(`steps.${currentStep}`)}
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <Spinner />
          <p className="mt-4 text-gray-600">{t('processing')}</p>
        </div>
      ) : isSubmitted ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-green-600 mb-4">{t('success.title')}</h2>
          <p className="text-gray-600">{t('success.message')}</p>
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
            {t('buttons.back')}
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="button" onClick={nextStep} className="ml-auto bg-[#FF9D3D] hover:bg-[#f77f07] text-black">
            {t('buttons.next')}
          </Button>
        )}
        {currentStep === steps.length - 1 && !isSubmitted && (
          <Button type="button" onClick={onSubmit} className="ml-auto bg-[#FF9D3D] hover:bg-[#f77f07] text-black">
            {t('buttons.submit')}
          </Button>
        )}
      </div>
    </div>
  );
}

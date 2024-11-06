/* eslint-disable @typescript-eslint/no-explicit-any */


"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormStepData } from '@/types/form';

type FormContextType = {
  formData: Partial<FormStepData>;
  updateFormData: (step: keyof FormStepData, data: FormStepData[keyof FormStepData]) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Partial<FormStepData>>({});

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const updateFormData = (step: keyof FormStepData, data: FormStepData[keyof FormStepData]) => {
    setFormData((prevData) => {
      const newData = { ...prevData, [step]: data };
      localStorage.setItem('formData', JSON.stringify(newData));
      return newData;
    });
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
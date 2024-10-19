/* eslint-disable @typescript-eslint/no-explicit-any */


"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

type FormContextType = {
  formData: any;
  updateFormData: (step: number, data: any) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Load data from localStorage on initial render
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const updateFormData = (step: number, data: any) => {
    setFormData((prevData: any) => {
      const newData = { ...prevData, [step]: data };
      // Save to localStorage
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
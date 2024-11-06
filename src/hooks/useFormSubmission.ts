import { FormSubmissionData } from '@/types/form';
import { useState } from 'react';

interface SubmissionState {
  isLoading: boolean;
  error: string | null;
}

export function useFormSubmission() {
  const [state, setState] = useState<SubmissionState>({
    isLoading: false,
    error: null,
  });

  const submitForm = async (data: FormSubmissionData) => {
    setState({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      setState({ isLoading: false, error: errorMessage });
      throw error;
    } finally {
      setState({ isLoading: false, error: null });
    }
  };

  return {
    submitForm,
    isLoading: state.isLoading,
    error: state.error,
  };
} 
import MultiStepForm from "@/components/Form";
import { FormProvider } from "@/utils/FormContext";

export default function FormPage() {
  return (
    <FormProvider>
      <div className="px-5 py-20">
        <MultiStepForm />
      </div>
    </FormProvider>
  );
} 
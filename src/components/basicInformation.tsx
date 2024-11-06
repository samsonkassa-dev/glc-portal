/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { forwardRef, useImperativeHandle } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFormContext } from '@/utils/FormContext';
import { useEffect } from "react"
import { useTranslations } from 'next-intl';
import { PersonalInfo } from "@/types/form";




const BasicInformationForm = forwardRef<{ validateAndSave: () => Promise<boolean> }, object>((props, ref) => {
  const { formData, updateFormData } = useFormContext();
  const t = useTranslations('basicInformation');
  const FormSchema = z.object({
    fullName: z.string().min(1, { message:  t('errorMessages.fullName') }),
    phoneNumber: z.string().min(10, { message:  t('errorMessages.phoneNumber') }),
    city: z.string().min(1, { message:  t('errorMessages.city') }),
    subCity: z.string().optional(),
    educationStatus: z.string().optional(),
    workStatus: z.string().optional(),
    jobField: z.string().optional(),
    companyName: z.string().optional(),
    placeOfWork: z.string().optional(),
    placeOfSchool: z.string().optional(),
    fieldOfStudy: z.string().optional(),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData[1] || {
      fullName: "",
      phoneNumber: "",
      city: "",
      subCity: "",
      educationStatus: "",
      workStatus: "",
      jobField: "",
      companyName: "",
      placeOfWork: "",
      placeOfSchool: "",
      fieldOfStudy: "",
    },
  })

  useImperativeHandle(ref, () => ({
    validateAndSave: async () => {
      const isValid = await form.trigger();
      if (isValid) {
        updateFormData(1, form.getValues() as PersonalInfo);
      }
      return isValid;
    },
  }));

  // Load saved data if it exists
  useEffect(() => {
    const step1Data = formData[1];
    if (step1Data) {
      Object.keys(step1Data).forEach(key => {
        const fieldKey = key as keyof PersonalInfo;
        form.setValue(fieldKey, step1Data[fieldKey]);
      });
    }
  }, [formData, form]);

  

  const workStatus = form.watch("workStatus");

  return (
    <Form {...form}>
      <form
        className="w-full max-w-4xl mx-auto p-6 space-y-6 "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                  {t('labels.fullName')} <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('placeholders.fullName')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                  {t('labels.phoneNumber')} <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('placeholders.phoneNumber')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                  {t('labels.city')} <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('placeholders.city')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                  {t('labels.subCity')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('placeholders.subCity')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="educationStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                  {t('labels.educationStatus')}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md">
                      <SelectValue placeholder={t('placeholders.educationStatus')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Other"> {t('options.educationStatus.other')}</SelectItem>
                    <SelectItem value="High School"> {t('options.educationStatus.highSchool')}</SelectItem>
                    <SelectItem value="Bachelor's"> {t('options.educationStatus.bachelors')}</SelectItem>
                    <SelectItem value="Master's"> {t('options.educationStatus.masters')}</SelectItem>
                    <SelectItem value="PhD"> {t('options.educationStatus.phd')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                  {t('labels.workStatus')}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md">
                      <SelectValue placeholder={t('placeholders.workStatus')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Employee">{t('options.workStatus.employee')}</SelectItem>
                    <SelectItem value="Self-Employed">{t('options.workStatus.selfEmployed')}</SelectItem>
                    <SelectItem value="Unemployed">{t('options.workStatus.unemployed')}</SelectItem>
                    <SelectItem value="Student">{t('options.workStatus.student')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {workStatus === "Student" ? (
            <>
              <FormField
                control={form.control}
                name="placeOfSchool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                      {t('labels.placeOfSchool')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholders.placeOfSchool')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                      {t('labels.fieldOfStudy')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholders.fieldOfStudy')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="jobField"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                      {t('labels.jobField')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholders.jobField')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                      {t('labels.placeOfWork')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholders.placeOfWork')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        {workStatus !== "Student" && (
          <FormField
            control={form.control}
            name="placeOfWork"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold sm:text-lg text-sm">
                  {t('labels.placeOfWork')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder= {t('placeholders.city')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md lg:w-[48%]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {/* <Button
          type="submit"
          className="lg:w-[25%] w-[40%] flex justify-center mx-auto bg-[#EB8317] text-white font-semibold py-2 px-4 rounded-md"
        >
          Next
        </Button> */}
      </form>
    </Form>
  );
});

BasicInformationForm.displayName = 'BasicInformationForm';

export default BasicInformationForm;

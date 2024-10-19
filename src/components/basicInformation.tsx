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

const FormSchema = z.object({
  fullName: z.string().min(1, { message: "Full Name is required." }),
  phoneNumber: z.string().min(10, { message: "Phone Number must be at least 10 digits." }),
  city: z.string().min(1, { message: "City is required." }),
  subCity: z.string().optional(),
  educationStatus: z.string().optional(),
  workStatus: z.string().optional(),
  jobField: z.string().optional(),
  companyName: z.string().optional(),
  placeOfWork: z.string().optional(),
  placeOfSchool: z.string().optional(),
  fieldOfStudy: z.string().optional(),
})


const BasicInformationForm = forwardRef<{ validateAndSave: () => Promise<boolean> }, object>((props, ref) => {
  const { formData, updateFormData } = useFormContext();
  
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
        updateFormData(1, form.getValues());
      }
      return isValid;
    },
  }));

  useEffect(() => {
    // Load saved data if it exists
    if (formData[1]) {
      Object.keys(formData[1]).forEach(key => {
        form.setValue(key as any, formData[1][key]);
      });
    }
  }, [formData, form.setValue, form]); 

  

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
                  Full Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Dawit Abraham Noah"
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
                  Phone Number <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="0911223344"
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
                  City <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Addis Ababa"
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
                  Sub City
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Akaki Kailty"
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
                  Education Status 
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md">
                      <SelectValue placeholder="Select Education Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Bachelor's">Bachelor</SelectItem>
                    <SelectItem value="Master's">Masters</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
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
                  Work Status
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md">
                      <SelectValue placeholder="Select Work Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                    <SelectItem value="Unemployed">Unemployed</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
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
                      Where do you learn?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Addis ABaba University"
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
                      What are you studying?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Field of Study"
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
                      What do you work?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Civil Servant"
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
                      Where do you work?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Municipal Office"
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
                  Place of Work?
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Addis Ababa"
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

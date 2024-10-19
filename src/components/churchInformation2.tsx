/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { forwardRef, useImperativeHandle } from 'react';
import { useFormContext } from '@/utils/FormContext';
import { useEffect } from "react"

const maritalStatusOptions = [
  { id: 'married', label: 'Married' },
  { id: 'single', label: 'Single' },
  { id: 'divorced', label: 'Divorced' },
  { id: 'widow', label: 'Widow' },
] as const;

const FormSchema = z.object({
  maritalStatus: z.enum(['married', 'single', 'divorced', 'widow']),
  ministryExperience: z.string().optional(),
  comments: z.string().optional(),
  childrenAttendChurch: z.boolean(),
  numberOfChildren: z.number().min(0).optional(),
  children: z.array(z.object({
    fullName: z.string().min(1, "Full name is required"),
    age: z.number().min(0, "Age must be a positive number"),
    image: z.string().optional(),
  })).optional(),
  userImage: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const churchInformation2 = forwardRef<{ validateAndSave: () => Promise<boolean> }, object>((props, ref) => {
   const { formData, updateFormData } = useFormContext();
  const [previewImages, setPreviewImages] = useState<{ [key: string]: string }>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      maritalStatus: 'single',
      childrenAttendChurch: false,
      numberOfChildren: 0,
      children: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  });

  const watchChildrenAttend = form.watch("childrenAttendChurch");
  const watchNumberOfChildren = form.watch("numberOfChildren") || 0;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        if (index !== undefined) {
          form.setValue(`children.${index}.image`, imageDataUrl);
          setPreviewImages(prev => ({ ...prev, [`child-${index}`]: imageDataUrl }));
        } else {
          form.setValue('userImage', imageDataUrl);
          setPreviewImages(prev => ({ ...prev, user: imageDataUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };


  useImperativeHandle(ref, () => ({
    validateAndSave: async () => {
      const isValid = await form.trigger();
      if (isValid) {
        updateFormData(2, form.getValues());
      }
      return isValid;
    },
  }));

  useEffect(() => {
    if (formData[2]) {
      Object.keys(formData[2]).forEach(key => {
        form.setValue(key as any, formData[2][key]);
      });
    }
  }, [formData, form.setValue, form]);

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-6 space-y-6 "
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold text-lg">
                  Marital Status
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {maritalStatusOptions.map((option) => (
                      <FormItem
                        key={option.id}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.id} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ministryExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold text-lg">
                  Your Experience on Ministry before?
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold text-lg">
                Comments
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="childrenAttendChurch"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold text-lg">
                Does your child come to church?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value ? "true" : "false"}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <div className='flex items-center justify-center w-5 h-5 pt-2'>
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                    </div>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <div className='flex items-center justify-center w-5 h-5 pt-2'>
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                    </div>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchChildrenAttend && (
          <FormField
            control={form.control}
            name="numberOfChildren"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold text-lg">
                  Number of Children
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      field.onChange(value);
                      const currentChildren = form.getValues("children") || [];
                      if (value > currentChildren.length) {
                        for (let i = currentChildren.length; i < value; i++) {
                          append({ fullName: "", age: 0 });
                        }
                      } else if (value < currentChildren.length) {
                        for (
                          let i = currentChildren.length - 1;
                          i >= value;
                          i--
                        ) {
                          remove(i);
                        }
                      }
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md w-24"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchChildrenAttend &&
          watchNumberOfChildren > 0 &&
          fields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name={`children.${index}.fullName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-md ">{`Child ${
                        index + 1
                      } Full Name`}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white border border-gray-300 text-gray-900 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`children.${index}.age`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold text-md">{`Child ${
                        index + 1
                      } Age`}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          className="bg-white border border-gray-300 text-gray-900 rounded-md w-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold text-md">{`Child ${
                  index + 1
                } Image`}</FormLabel>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                      id={`child-image-${index}`}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById(`child-image-${index}`)?.click()
                    }
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    {previewImages[`child-${index}`]
                      ? "Change Image"
                      : "Upload Image"}
                  </Button>
                  {previewImages[`child-${index}`] && (
                    <div className="w-24 h-24 relative">
                      <Image
                        src={previewImages[`child-${index}`]}
                        alt={`Child ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  )}
                </div>
              </FormItem>
            </div>
          ))}

        <FormItem>
          <FormLabel className="text-gray-700 font-semibold text-lg">
            Upload your Image
          </FormLabel>
          <div className="flex flex-col p-4  sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                className="hidden"
                id="user-image"
              />
            </FormControl>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("user-image")?.click()}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              {previewImages.user ? "Change Image" : "Upload Image"}
            </Button>
            {previewImages.user && (
              <div className="w-24 h-24 relative">
                <Image
                  src={previewImages.user}
                  alt="User"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            )}
          </div>
        </FormItem>

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


churchInformation2.displayName = 'ChurchInformation2';

export default churchInformation2;

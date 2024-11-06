"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { forwardRef, useImperativeHandle } from "react";
import { useFormContext } from "@/utils/FormContext";
import { useEffect } from "react";
import { ChurchInfo2 } from "@/types/form";
import { useTranslations } from 'next-intl';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

const ChurchInformation2 = forwardRef<
  { validateAndSave: () => Promise<boolean> },
  object
>((props, ref) => {
  const t = useTranslations('churchInformation2');
  const maritalStatusOptions = [
    { id: "married", label: t('options.maritalStatus.married') },
    { id: "single", label: t('options.maritalStatus.single') },
    { id: "divorced", label: t('options.maritalStatus.divorced') },
    { id: "widow", label: t('options.maritalStatus.widow') },
  ] as const;

  const FormSchema = z
    .object({
      maritalStatus: z.enum(["married", "single", "divorced", "widow"], {
        required_error: t('errorMessages.maritalStatus'),
      }),
      ministryExperience: z.string().optional(),
      userImage: z.string({
        required_error: t('errorMessages.userImage'),
      }).min(1, { message: t('errorMessages.userImage') }),
      comments: z.string().optional(),
      childrenAttendChurch: z.boolean(),
      numberOfChildren: z.number().min(0).optional(),
      children: z
        .array(
          z.object({
            fullName: z.string().min(1, t('errorMessages.nameOfChild')),
            age: z.number().min(0, t('errorMessages.ageOfChild')),
            image: z.string().min(1, t('errorMessages.childImage')),
          })
        )
        .optional(),
    })
    .refine(
      (data) => {
        if (data.childrenAttendChurch) {
          return (
            data.numberOfChildren !== undefined && data.numberOfChildren >= 1
          );
        }
        return true;
      },
      {
        message: t('errorMessages.numberOfChildren'),
        path: ["numberOfChildren"],
      }
    );
  type FormValues = z.infer<typeof FormSchema>;

  const { formData, updateFormData } = useFormContext();
  const [previewImages, setPreviewImages] = useState<{ [key: string]: string }>(
    {}
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      maritalStatus: "single",
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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      form.setError(
        index !== undefined ? `children.${index}.image` : "userImage",
        {
          type: "manual",
          message: "Image size must be less than 3MB",
        }
      );
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      form.setError(
        index !== undefined ? `children.${index}.image` : "userImage",
        {
          type: "manual",
          message: "Please upload an image file",
        }
      );
      return;
    }

    try {
      // Create an image element and draw it on a canvas to resize
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500; // Limit the width (adjust as needed)
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert canvas to base64
        const base64String = canvas.toDataURL(file.type);

        // Update form and preview
        if (index !== undefined) {
          form.setValue(`children.${index}.image`, base64String);
          form.clearErrors(`children.${index}.image`);
          setPreviewImages((prev) => ({
            ...prev,
            [`child-${index}`]: base64String,
          }));
        } else {
          form.setValue("userImage", base64String);
          form.clearErrors("userImage");
          setPreviewImages((prev) => ({ ...prev, user: base64String }));
        }
      };
    } catch (error) {
      console.error("Error processing image:", error);
      form.setError(
        index !== undefined ? `children.${index}.image` : "userImage",
        {
          type: "manual",
          message: "Error processing image. Please try again.",
        }
      );
    }
  };

  useImperativeHandle(ref, () => ({
    validateAndSave: async () => {
      const isValid = await form.trigger();
      if (isValid) {
        updateFormData(3, form.getValues() as ChurchInfo2);
      }
      return isValid;
    },
  }));

  useEffect(() => {
    const step3Data = formData[3];
    if (step3Data) {
      // Set form values
      Object.keys(step3Data).forEach((key) => {
        const fieldKey = key as keyof FormValues;
        form.setValue(fieldKey, step3Data[fieldKey]);
      });

      // Set preview images
      const newPreviewImages: { [key: string]: string } = {};
      
      // Set user image preview if it exists
      if (step3Data.userImage) {
        newPreviewImages.user = step3Data.userImage;
      }

      // Set children images preview if they exist
      if (step3Data.children) {
        step3Data.children.forEach((child, index) => {
          if (child.image) {
            newPreviewImages[`child-${index}`] = child.image;
          }
        });
      }

      setPreviewImages(newPreviewImages);
    }
  }, [formData, form]);

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
                <FormLabel className="text-gray-700 font-semibold sm:text-lg text-md">
                  {t('labels.maritalStatus')}
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
                <FormLabel className="text-gray-700 font-semibold sm:text-lg text-md">
                  {t('labels.ministryExperience')}
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
              <FormLabel className="text-gray-700 font-semibold sm:text-lg text-md">
                {t('labels.comments')}
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
              <FormLabel className="text-gray-700 font-semibold sm:text-lg text-md">
                {t('labels.childrenAttendChurch')} <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value ? "true" : "false"}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-5 h-5 pt-2">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                    </div>
                    <FormLabel className="font-normal">{t('options.yesNo.yes')}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-5 h-5 pt-2">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                    </div>
                    <FormLabel className="font-normal">{t('options.yesNo.no')}</FormLabel>
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
                <FormLabel className="text-gray-700 font-semibold sm:text-lg text-md">
                  {t('labels.numberOfChildren')} <span className="text-red-500">*</span>
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
                          append({ fullName: "", age: 0, image: "" });
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
                      <FormLabel className="text-gray-700 font-semibold text-md ">{`${t('labels.child')} ${
                        index + 1
                      } ${t('labels.fullName')}`} <span className="text-red-500">*</span></FormLabel>
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
                      <FormLabel className="text-gray-700 font-semibold text-md">{`${t('labels.child')} ${
                        index + 1
                      } ${t('labels.age')}`} <span className="text-red-500">*</span></FormLabel>
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
                <FormLabel className="text-gray-700 font-semibold text-md">{`${t('labels.child')} ${
                  index + 1
                } ${t('labels.image')}`} <span className="text-red-500">*</span></FormLabel>
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
                      ? t('labels.change')
                      : t('labels.upload')}
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
                <FormMessage>
                  {form.formState.errors.children?.[index]?.image?.message}
                </FormMessage>
              </FormItem>
            </div>
          ))}

        <FormField
          control={form.control}
          name="userImage"
          render={() => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold sm:text-lg text-md">
                {t('labels.userImage')} <span className="text-red-500">*</span>
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
                  {previewImages.user ? t('labels.change') : t('labels.upload')}
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
              <FormMessage />
            </FormItem>
          )}
        />

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

ChurchInformation2.displayName = "ChurchInformation2";

export default ChurchInformation2;

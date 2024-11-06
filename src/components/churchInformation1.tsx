/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { forwardRef, useImperativeHandle } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useFormContext } from '@/utils/FormContext';
import { useEffect } from "react"
import { useTranslations } from 'next-intl';
import { ChurchInfo1 } from "@/types/form"



const ChurchInformation1 = forwardRef<{ validateAndSave: () => Promise<boolean> }, object>((props, ref) => {
  const t = useTranslations('churchInformation1');
  const { formData, updateFormData } = useFormContext();

  const FormSchema = z.object({
    savedDate: z.string().min(1, { message: t('errorMessages.savedDate') }),
    savedChurch: z.string().min(1, { message: t('errorMessages.savedChurch') }),
    inviterFullName: z.string().optional(),
    inviterPhoneNumber: z.string().min(10, { message: t('errorMessages.inviterPhoneNumber') }).optional().or(z.literal('')),
    invitationSource: z.enum(["Social Media", "Gospel TV"]).optional(),
    doesServe: z.boolean({
      required_error: t('errorMessages.doesServe'),
    }),
    department: z.array(z.string()).optional(),
    trainings: z.array(z.string()).optional(),
  }).refine((data) => {
    if (data.doesServe && (!data.department || data.department.length === 0)) {
      return false;
    }
    return true;
  }, {
    message: t('errorMessages.chooseDepartment'),
    path: ["department"],
  });


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      savedDate: "",
      savedChurch: "",
      inviterFullName: "",
      inviterPhoneNumber: "",
      invitationSource: undefined, // Set a default value
      doesServe: undefined, // Set a default value
      department: [],
      trainings: [],
    },
  })


  useImperativeHandle(ref, () => ({
    validateAndSave: async () => {
      const isValid = await form.trigger();
      if (isValid) {
        updateFormData(2, form.getValues() as ChurchInfo1);
      }
      return isValid;
    },
  }));

  // Load saved data if it exists
  useEffect(() => {
    const step2Data = formData[2];
    if (step2Data) {
      Object.keys(step2Data).forEach(key => {
        const fieldKey = key as keyof ChurchInfo1;
        form.setValue(fieldKey, step2Data[fieldKey]);
      });
    }
  }, [formData, form]);

  const departments = [
    { label: t('departments.it'), value: "it" },
    { label: t('departments.anakazo'), value: "anakazo" },
    { label: t('departments.followUp'), value: "follow_up" },
    { label: t('departments.foundationTeachers'), value: "foundation_teachers" },
    { label: t('departments.art'), value: "art" },
    { label: t('departments.media'), value: "media" },
    { label: t('departments.children'), value: "childeren_ministry" },
    { label: t('departments.army'), value: "army" },
    { label: t('departments.usher'), value: "usher" },
    { label: t('departments.zoeOne'), value: "zoe_one" },
    { label: t('departments.zoeTwo'), value: "zoe_two" },
    { label: t('departments.zoeThree'), value: "zoe_three" },
    { label: t('departments.zoeFour'), value: "zoe_four" },
    { label: t('departments.zoeFive'), value: "zoe_five" },
    { label: t('departments.music'), value: "musicians" },
    { label: t('departments.prayer'), value: "prayer" },
    { label: t('departments.coordinators'), value: "coordinators" },
    { label: t('departments.agape'), value: "agape_cdministry" },
    { label: t('departments.compassion'), value: "compassion" },
    { label: t('departments.cleaning'), value: "cleaning_team" },
  ];

  const trainings = [
    { id: "restoration", label: t('trainings.restoration') },
    { id: "foundation_one", label: t('trainings.foundationOne') },
    { id: "foundation_two", label: t('trainings.foundationTwo') },
    { id: "ministers_training", label: t('trainings.ministersTraining') },
  ];

  return (
    <Form {...form}>
      <form
        className="w-full max-w-4xl mx-auto p-6 space-y-6 flex flex-col justify-between"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-10 md:gap-7 gap-5 pb-4">
            <FormField
              control={form.control}
              name="savedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold md:text-lg text-md">
                    {t('labels.savedDate')} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('placeholders.savedDate')}
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
              name="savedChurch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold md:text-lg text-md">
                    {t('labels.savedChurch')} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('placeholders.savedChurch')}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <h2 className="md:text-lg text-sm pt-4 font-semibold text-gray-700">
            {t('labels.inviterSection')}
          </h2>{" "}
          <div className="pl-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-10 md:gap-7 gap-5 pb-4">
              <FormField
                control={form.control}
                name="inviterFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold md:text-md text-sm">
                      {t('labels.inviterFullName')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholders.inviterFullName')}
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
                name="inviterPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold md:text-md text-sm">
                      {t('labels.inviterPhoneNumber')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholders.inviterPhoneNumber')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="invitationSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold md:text-md text-sm">
                    {t('labels.invitationSource')}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4 "
                    >
                      <FormItem className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-5 h-5 pt-2">
                          <FormControl>
                            <RadioGroupItem
                              value="Social Media"
                              className="transform-none"
                            />
                          </FormControl>
                        </div>
                        <FormLabel className="font-normal">
                          {t('options.source.socialMedia')}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-5 h-5 pt-2">
                          <FormControl>
                            <RadioGroupItem
                              value="Gospel TV"
                              className="transform-none"
                            />
                          </FormControl>
                        </div>
                        <FormLabel className="font-normal"> {t('options.source.gospelTV')}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:gap-10 md:gap-7 gap-5 pb-4">
  
                <FormField
                  control={form.control}
                  name="doesServe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold md:text-lg text-md">
                        {t('labels.doesServe')} <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="pl-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value === "true");
                            if (value === "false") {
                              form.setValue("department", []);
                            }
                          }}
                          value={
                            field.value === undefined
                              ? undefined
                              : field.value.toString()
                          }
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-5 h-5 pt-2 ">
                              <FormControl>
                                <RadioGroupItem value="true" />
                              </FormControl>
                            </div>
                            <FormLabel className="font-normal">{t('options.yesNo.yes')}</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-5 h-5 pt-2 ">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                            </div>
                            <FormLabel className="font-normal">{t('options.yesNo.no')}</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
              <FormField
                control={form.control}
                name="trainings"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold md:text-lg text-md">
                      {t('labels.trainings')} 
                    </FormLabel>
                    <div className="space-y-2 pl-4">
                      {trainings.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="trainings"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value ?? []),
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.watch("doesServe") && (
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700 font-semibold md:text-lg text-md">
                      {t('labels.departments')} <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "md:w-[50%] w-full justify-between",
                              !field.value || field.value.length === 0
                                ? "text-muted-foreground"
                                : ""
                            )}
                          >
                            {field.value && field.value.length > 0
                              ? `${field.value.length} ${t('departmentLabel.department')}${
                                  field.value.length > 1 ? t('departmentLabel.s') : ""
                                } ${t('departmentLabel.selected')}`
                              : t('placeholders.chooseDepartment')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder={t('departmentLabel.search')} />
                          <CommandList>
                            <CommandEmpty>{t('departmentLabel.noDepartment')}</CommandEmpty>
                            <CommandGroup>
                              {departments.map((department) => (
                                <CommandItem
                                  key={department.value}
                                  onSelect={() => {
                                    const currentValue = field.value || [];
                                    const newValue = currentValue.includes(
                                      department.value
                                    )
                                      ? currentValue.filter(
                                          (item) => item !== department.value
                                        )
                                      : [...currentValue, department.value];
                                    form.setValue("department", newValue, {
                                      shouldValidate: true,
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value &&
                                        field.value.includes(department.value)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {department.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                    {t('descriptions.departments')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

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


ChurchInformation1.displayName = 'ChurchInformation1';

export default ChurchInformation1;

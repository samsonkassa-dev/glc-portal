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

const FormSchema = z.object({
  savedDate: z.string().min(1, { message: "Please enter when you got saved." }),
  savedChurch: z.string().min(1, { message: "Please enter the church where you got saved." }),
  inviterFullName: z.string().optional(),
  inviterPhoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional().or(z.literal('')),
  invitationSource: z.enum(["Social Media", "Gospel TV"]).optional(),
  doesServe: z.boolean({
    required_error: "Please select whether you serve in any departments.",
  }),
  department: z.array(z.string()).optional(),
  trainings: z.array(z.string()).min(1, { message: "Please select at least one training." }),
}).refine((data) => {
  if (data.doesServe && (!data.department || data.department.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Please select at least one department if you serve.",
  path: ["department"],
});

const departments = [
  { label: "IT Team", value: "it" },
  { label: "Anakazo", value: "anakazo" },
  { label: "Follow up", value: "follow_up" },
  { label: "Foundation teachers", value: "foundation_teachers" },
  { label: "Art Ministry", value: "art" },
  { label: "Media and Sound", value: "media" },
  { label: "Children Ministry", value: "childeren" },
  { label: "A.R.M.Y", value: "army" },
  { label: "Ushers", value: "usher" },
  { label: "Zoe Choir One", value: "zoe_one" },
  { label: "Zoe Choir Two", value: "zoe_two" },
  { label: "Zoe Choir Three", value: "zoe_three" },
  { label: "Zoe Choir Four", value: "zoe_four" },
  { label: "Zoe Choir Five", value: "zoe_five" },
  // ... add more departments here
]

const trainings = [
  { id: "restoration", label: "Restoration" },
  { id: "foundation_one", label: "Foundation One" },
  { id: "foundation_two", label: "Foundation Two" },
  { id: "ministers_training", label: "Ministers Training" },
  // ... add more trainings here
]

const ChurchInformation1 = forwardRef<{ validateAndSave: () => Promise<boolean> }, object>((props, ref) => {
  const { formData, updateFormData } = useFormContext();
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
        className="w-full max-w-4xl mx-auto p-6 space-y-6 flex flex-col justify-between"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-10 md:gap-7 gap-5 pb-4">
            <FormField
              control={form.control}
              name="savedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold text-lg">
                    When did you get saved?{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Meskerem 10, 2005"
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
                  <FormLabel className="text-gray-700 font-semibold text-lg">
                    Which Church did you get saved?{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Glorious Life Church"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <h2 className="text-lg pt-4 font-semibold text-gray-700">
            Who invited you to GLC?
          </h2>{" "}
          <div className="pl-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-10 md:gap-7 gap-5 pb-4">
              <FormField
                control={form.control}
                name="inviterFullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold text-md">
                      Full Name 
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Dawit Abraham"
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
                    <FormLabel className="text-gray-700 font-semibold text-md">
                      Phone Number 
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
            </div>
            <FormField
              control={form.control}
              name="invitationSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold text-md ">
                    Invitation Source
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
                          Social Media
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
                        <FormLabel className="font-normal">Gospel TV</FormLabel>
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
                      <FormLabel className="text-gray-700 font-semibold text-lg">
                        Do you serve in any departments?{" "}
                        <span className="text-red-500">*</span>
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
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-5 h-5 pt-2 ">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                            </div>
                            <FormLabel className="font-normal">No</FormLabel>
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
                    <FormLabel className="text-gray-700 font-semibold text-lg">
                      Which trainings have you attended?{" "}
                      <span className="text-red-500">*</span>
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
                                            ...field.value,
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
                    <FormLabel className="text-gray-700 font-semibold text-lg">
                      Which departments do you serve?{" "}
                      <span className="text-red-500">*</span>
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
                              ? `${field.value.length} department${
                                  field.value.length > 1 ? "s" : ""
                                } selected`
                              : "Select departments"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search department..." />
                          <CommandList>
                            <CommandEmpty>No department found.</CommandEmpty>
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
                      You can select multiple departments.
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

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useBrandSettings } from "@/lib/stores/useBrandSettings";
import { Checkbox } from "@/components/ui/checkbox";


// Define the form schema with validation
const bookingSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  companySize: z.string({
    required_error: "Please select your company size.",
  }),
  preferredDate: z.date({
    required_error: "Please select a preferred date for the meeting.",
  }),
  message: z.string().optional(),
  timeZone: z.string({
    required_error: "Please select your time zone.",
  }),
  preferredTime: z.string({
    required_error: "Please select your preferred time.",
  }),
  services: z.array(z.string()).optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const { settings } = useBrandSettings();
  
  // Available services
  const services = [
    {
      id: "virtual-try-on",
      label: "3D Virtual Try-On Integration"
    },
    {
      id: "custom-mannequin",
      label: "Custom Mannequin Development"
    },
    {
      id: "ecommerce-integration",
      label: "E-commerce Platform Integration"
    },
    {
      id: "white-label-solution",
      label: "White-Label Solution"
    },
    {
      id: "analytics-dashboard",
      label: "Custom Analytics Dashboard"
    },
    {
      id: "api-access",
      label: "API Access & Development"
    },
  ];

  // Default form values
  const defaultValues: Partial<BookingFormValues> = {
    companyName: "",
    contactName: "",
    email: "",
    phoneNumber: "",
    companySize: "",
    message: "",
    timeZone: "UTC",
    preferredTime: "10:00",
    services: [],
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: BookingFormValues) {
    console.log("Booking request submitted:", data);
    
    setIsSubmitting(true);
    
    try {
      // Send data to our API endpoint
      const response = await fetch('/api/booking', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Booking response:', result);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting booking:', error);
      // You could set an error state and display it to the user
    } finally {
      setIsSubmitting(false);
    }
  }

  // Generate time slots for the select dropdown
  const timeSlots: string[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    const hourStr = hour.toString().padStart(2, "0");
    timeSlots.push(`${hourStr}:00`);
    timeSlots.push(`${hourStr}:30`);
  }

  if (submitted) {
    return (
      <div className="container max-w-4xl py-12 px-4 md:px-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Booking Request Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in our personalized pricing. We've received your meeting request and will contact you shortly to confirm the details.
          </p>
          <Button onClick={() => setSubmitted(false)}>Book Another Meeting</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ color: settings.primaryColor }}>
          Schedule a Personalized Pricing Consultation
        </h1>
        <p className="text-gray-600">
          Let's discuss how our 3D virtual try-on platform can best suit your brand's needs
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Zone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (PT)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (MT)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (CT)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (ET)</SelectItem>
                        <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                        <SelectItem value="UTC+1">Central European Time (CET)</SelectItem>
                        <SelectItem value="UTC+8">China Standard Time (CST)</SelectItem>
                        <SelectItem value="UTC+9">Japan Standard Time (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-base font-medium mb-3 block">Services You're Interested In</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <FormField
                  control={form.control}
                  name="services"
                  render={() => (
                    <FormItem>
                      {services.map((service, index) => (
                        <FormField
                          key={service.id}
                          control={form.control}
                          name="services"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={service.id}
                                className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(service.label)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], service.label])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== service.label
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-sm mt-0.5">
                                  {index + 1}. {service.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Preferred Date</FormLabel>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        // Disable weekends and past dates
                        const day = date.getDay();
                        const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                        return day === 0 || day === 6 || isPastDate;
                      }}
                      className="rounded-md border"
                    />
                    <FormDescription>
                      Business days only. We'll confirm the exact time via email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="preferredTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>All times shown in your selected time zone.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your specific needs or questions..."
                          className="resize-none h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                style={{ backgroundColor: settings.primaryColor }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Request Meeting"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
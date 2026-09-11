"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { bookingSchema, type BookingInput } from "@/lib/validators";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const TIMEZONES = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Phoenix",
  "Pacific/Honolulu",
];

interface BookingFormProps {
  services: { title: string }[];
}

export function BookingForm({ services }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      timezone: "America/Los_Angeles",
      consent: undefined,
    },
  });

  const onSubmit = async (data: BookingInput) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Booking failed");
      toast.success("Booking request submitted! We'll confirm availability soon.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Full Name" {...register("name")} error={errors.name?.message} required />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} required />
        <Input label="Phone" type="tel" {...register("phone")} error={errors.phone?.message} required />
        <Select
          label="Service"
          options={services.map((s) => ({ value: s.title, label: s.title }))}
          placeholder="Select a service"
          {...register("service")}
          error={errors.service?.message}
          required
        />
        <Input label="Preferred Date" type="date" {...register("preferredDate")} error={errors.preferredDate?.message} required />
        <Input label="Preferred Time" type="time" {...register("preferredTime")} error={errors.preferredTime?.message} required />
        <Select
          label="Timezone"
          options={TIMEZONES.map((tz) => ({ value: tz, label: tz.replace(/_/g, " ") }))}
          {...register("timezone")}
          error={errors.timezone?.message}
          required
        />
      </div>

      <Textarea label="Wellness Goals" {...register("wellnessGoals")} hint="Optional — share what you'd like to focus on" />
      <Textarea label="Additional Message" {...register("message")} hint="Optional" />

      <label className="flex items-start gap-3 text-sm text-botanical">
        <input type="checkbox" {...register("consent")} className="mt-1 accent-electric" />
        <span>
          I consent to {`Fungtional Wellness`} contacting me about my booking request. I understand
          availability is not guaranteed until confirmed by the team.
        </span>
      </label>
      {errors.consent && <p className="text-xs text-burnt-orange">{errors.consent.message}</p>}

      <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full sm:w-auto">
        Submit Booking Request
      </Button>
    </form>
  );
}

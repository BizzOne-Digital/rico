"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@/lib/validators";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to send message");
      toast.success("Message sent successfully!");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Name" {...register("name")} error={errors.name?.message} required />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} required />
        <Input label="Phone" type="tel" {...register("phone")} error={errors.phone?.message} />
        <Input label="Subject" {...register("subject")} error={errors.subject?.message} required />
      </div>

      <Textarea label="Message" rows={6} {...register("message")} error={errors.message?.message} required />

      <label className="flex items-start gap-3 text-sm text-botanical">
        <input type="checkbox" {...register("consent")} className="mt-1 accent-electric" />
        <span>I consent to Fungtional Wellness contacting me regarding my inquiry.</span>
      </label>
      {errors.consent && <p className="text-xs text-burnt-orange">{errors.consent.message}</p>}

      <Button type="submit" isLoading={isSubmitting} size="lg">
        Send Message
      </Button>
    </form>
  );
}

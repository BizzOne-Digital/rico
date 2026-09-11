"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { Plus, Trash } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Testimonial {
  name: string;
  role?: string;
  content: string;
  rating: number;
  active: boolean;
}

interface Settings {
  contactEmail: string;
  salesEmail: string;
  phone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  announcement: string;
  medicalDisclaimer: string;
  testimonials: Testimonial[];
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setSettings(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const updateSocial = (key: string, value: string) => {
    setSettings((prev) =>
      prev ? { ...prev, socialLinks: { ...prev.socialLinks, [key]: value } } : prev
    );
  };

  const addTestimonial = () => {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            testimonials: [
              ...prev.testimonials,
              { name: "", content: "", rating: 5, active: true },
            ],
          }
        : prev
    );
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number | boolean) => {
    setSettings((prev) => {
      if (!prev) return prev;
      const testimonials = [...prev.testimonials];
      testimonials[index] = { ...testimonials[index], [field]: value };
      return { ...prev, testimonials };
    });
  };

  const removeTestimonial = (index: number) => {
    setSettings((prev) =>
      prev
        ? { ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }
        : prev
    );
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-sm text-[#2D6A4F]">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="py-12 text-center text-sm text-[#F05A28]">Failed to load settings</div>;
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage site configuration" />

      <div className="space-y-6">
        <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
            Contact Information
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Contact Email"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
            />
            <Input
              label="Sales Email"
              type="email"
              value={settings.salesEmail}
              onChange={(e) => update("salesEmail", e.target.value)}
            />
            <Input
              label="Phone"
              value={settings.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
            <Input
              label="Address"
              value={settings.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
            Social Links
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(["facebook", "instagram", "twitter", "linkedin", "youtube", "tiktok"] as const).map(
              (platform) => (
                <Input
                  key={platform}
                  label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  value={settings.socialLinks[platform] || ""}
                  onChange={(e) => updateSocial(platform, e.target.value)}
                  placeholder={`https://${platform}.com/...`}
                />
              )
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
            Announcement & Disclaimer
          </h2>
          <Textarea
            label="Announcement Bar"
            value={settings.announcement}
            onChange={(e) => update("announcement", e.target.value)}
            rows={2}
          />
          <Textarea
            label="Medical Disclaimer"
            value={settings.medicalDisclaimer}
            onChange={(e) => update("medicalDisclaimer", e.target.value)}
            rows={4}
          />
        </section>

        <section className="rounded-2xl border border-[#EDE9DE] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#2D6A4F]">
              Testimonials
            </h2>
            <Button variant="outline" size="sm" onClick={addTestimonial}>
              <Plus size={16} />
              Add
            </Button>
          </div>
          {settings.testimonials.map((t, i) => (
            <div key={i} className="rounded-xl border border-[#EDE9DE] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#143D2D]">Testimonial {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeTestimonial(i)}>
                  <Trash size={16} className="text-[#F05A28]" />
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  label="Name"
                  value={t.name}
                  onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                />
                <Input
                  label="Role"
                  value={t.role || ""}
                  onChange={(e) => updateTestimonial(i, "role", e.target.value)}
                />
              </div>
              <Textarea
                label="Content"
                value={t.content}
                onChange={(e) => updateTestimonial(i, "content", e.target.value)}
                rows={3}
              />
              <div className="flex items-center gap-4">
                <Input
                  label="Rating"
                  type="number"
                  min="1"
                  max="5"
                  value={t.rating}
                  onChange={(e) => updateTestimonial(i, "rating", parseInt(e.target.value) || 5)}
                  className="w-24"
                />
                <label className="flex items-center gap-2 text-sm text-[#143D2D]">
                  <input
                    type="checkbox"
                    checked={t.active}
                    onChange={(e) => updateTestimonial(i, "active", e.target.checked)}
                    className="rounded border-[#C8C9C7] text-[#55C878] focus:ring-[#55C878]"
                  />
                  Active
                </label>
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-end">
          <Button onClick={handleSave} isLoading={saving}>Save Settings</Button>
        </div>
      </div>
    </>
  );
}

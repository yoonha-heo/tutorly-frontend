"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, CheckCircle2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useTeacherOptions } from "@/features/teachers/hooks/useTeacherOptions";
import { useUpdateTeacherProfile } from "@/features/teachers/hooks/useUpdateTeacherProfile";
import {
  teacherRegisterSchema,
  type TeacherRegisterInput,
  type TeacherRegisterValues,
} from "@/features/teachers/schemas/teacher-register.schema";
import type { Teacher } from "@/features/teachers/types/teachers";
import { uploadImage } from "@/features/uploads/api/uploads.api";

const fieldLabel = "block text-base font-semibold text-foreground";
const inputClassName =
  "h-14 w-full rounded-2xl border border-border bg-background px-5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

function Toast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 shadow-lg"
    >
      <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-primary">
        <CheckCircle2 className="size-4" />
      </span>
      <span className="text-sm font-semibold text-foreground">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="ml-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function getTeacherDefaultValues(teacher: Teacher): TeacherRegisterInput {
  return {
    headline: teacher.headline,
    bio: teacher.bio,
    hourlyRate: teacher.hourlyRate,
    profileImageUrl: teacher.profileImageUrl ?? "",
    languages:
      teacher.teacherLanguages?.map((item) => item.language.code) ?? [],
    specialties:
      teacher.teacherSpecialties?.map((item) => item.specialty.code) ?? [],
  };
}

interface DashboardProfileEditorProps {
  teacher: Teacher;
}

export function DashboardProfileEditor({ teacher }: DashboardProfileEditorProps) {
  const updateMutation = useUpdateTeacherProfile(teacher.id);
  const { data: options } = useTeacherOptions();
  const { languages, specialties } = options;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<TeacherRegisterInput, unknown, TeacherRegisterValues>({
    resolver: zodResolver(teacherRegisterSchema),
    defaultValues: getTeacherDefaultValues(teacher),
  });

  const selectedLanguages = watch("languages");
  const selectedSpecialties = watch("specialties");
  const profileImage = watch("profileImage");
  const profileImageUrl = watch("profileImageUrl");

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    reset(getTeacherDefaultValues(teacher));
  }, [teacher, reset]);

  useEffect(() => {
    if (!profileImage) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(profileImage);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profileImage]);

  const displayImageUrl =
    imagePreviewUrl ??
    (profileImageUrl ||
      teacher.profileImageUrl ||
      "/images/empty-profile.png");

  const toggleFormArrayValue = (
    fieldName: "languages" | "specialties",
    value: string,
  ) => {
    const currentValues = getValues(fieldName) ?? [];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setValue(fieldName, nextValues, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: TeacherRegisterValues) => {
    try {
      let nextProfileImageUrl = data.profileImageUrl;

      if (data.profileImage) {
        const uploaded = await uploadImage(data.profileImage, "profile-images");
        nextProfileImageUrl = uploaded.url;
      }

      await updateMutation.mutateAsync({
        headline: data.headline,
        bio: data.bio,
        profileImageUrl: nextProfileImageUrl,
        hourlyRate: data.hourlyRate,
        languages: data.languages.map(
          (code) => languages.find((item) => item.code === code)?.name ?? code,
        ),
        specialties: data.specialties.map(
          (code) =>
            specialties.find((item) => item.code === code)?.name ?? code,
        ),
      });

      reset({
        ...data,
        profileImageUrl: nextProfileImageUrl,
        profileImage: undefined,
      });

      setToast("Profile saved successfully.");
      setTimeout(() => setToast(null), 4000);
    } catch (error) {
      console.error(error);
      setToast("Failed to save profile. Please try again.");
      setTimeout(() => setToast(null), 4000);
    }
  };

  const isSaving = isSubmitting || updateMutation.isPending;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <section className="rounded-3xl border border-border bg-background p-5 sm:p-8">
          <div className="space-y-9">
            <div>
              <label className={fieldLabel}>Profile photo</label>

              <div className="mt-3 flex items-center gap-5">
                <div className="flex size-24 items-center justify-center overflow-hidden rounded-3xl border border-border bg-secondary">
                  {displayImageUrl ? (
                    <Image
                      src={displayImageUrl}
                      alt={`${teacher.user.name ?? "Teacher"} profile`}
                      width={96}
                      height={96}
                      className="size-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <Camera className="size-8 text-muted-foreground" />
                  )}
                </div>

                <div>
                  <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                    Upload photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;

                        setValue("profileImage", file, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />
                  </label>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Use a clear photo so learners can recognize you.
                  </p>
                </div>
              </div>

              {errors.profileImageUrl && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.profileImageUrl.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="dashboard-headline" className={fieldLabel}>
                Headline
              </label>
              <input
                id="dashboard-headline"
                {...register("headline")}
                placeholder="e.g. Certified Spanish tutor — speak with confidence"
                className={`${inputClassName} mt-3`}
              />
              {errors.headline && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.headline.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="dashboard-bio" className={fieldLabel}>
                Bio
              </label>
              <textarea
                id="dashboard-bio"
                {...register("bio")}
                placeholder="Tell learners about your teaching style, experience, and what a lesson with you looks like."
                className="mt-3 min-h-48 w-full resize-y rounded-2xl border border-border bg-background px-5 py-4 text-base leading-7 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />
              {errors.bio && (
                <p className="mt-2 text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dashboard-rate" className={fieldLabel}>
                Hourly rate (USD)
              </label>
              <div className="mt-3 flex h-14 max-w-md items-center gap-3 rounded-2xl border border-border px-5 focus-within:border-primary">
                <span className="text-lg text-muted-foreground">$</span>
                <input
                  id="dashboard-rate"
                  {...register("hourlyRate")}
                  type="number"
                  min="1"
                  className="w-full bg-transparent text-base text-foreground outline-none"
                />
              </div>
              {errors.hourlyRate && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.hourlyRate.message}
                </p>
              )}
            </div>

            <div>
              <h2 className={fieldLabel}>Languages you teach</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {languages.map((language) => {
                  const isSelected = selectedLanguages.includes(language.code);

                  return (
                    <button
                      key={language.id}
                      type="button"
                      onClick={() =>
                        toggleFormArrayValue("languages", language.code)
                      }
                      className={[
                        "rounded-full border px-5 py-2 text-base font-semibold transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:bg-secondary",
                      ].join(" ")}
                    >
                      {language.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className={fieldLabel}>Specialties</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Add tags to help students find you.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {specialties.map((specialty) => {
                  const isSelected = selectedSpecialties.includes(
                    specialty.code,
                  );

                  return (
                    <button
                      key={specialty.id}
                      type="button"
                      onClick={() =>
                        toggleFormArrayValue("specialties", specialty.code)
                      }
                      className={[
                        "rounded-full border px-5 py-2 text-base font-semibold transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:bg-secondary",
                      ].join(" ")}
                    >
                      {specialty.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="sticky bottom-0 z-10 mt-0 flex items-center justify-between gap-4 rounded-b-3xl border-x border-b border-border bg-background/95 px-5 py-4 backdrop-blur-sm sm:px-8">
          <div>
            <p className="text-sm text-muted-foreground">
              {isDirty ? "You have unsaved changes." : "All changes are saved."}
            </p>
            {updateMutation.isError && (
              <p className="mt-1 text-sm text-red-600">
                Failed to save profile. Please try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-2xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </>
  );
}

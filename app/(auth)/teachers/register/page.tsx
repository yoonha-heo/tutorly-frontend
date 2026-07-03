"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useSubmitTeacherProfile } from "@/features/teachers/hooks/useSubmitTeacherProfile";
import {
  teacherRegisterSchema,
  type TeacherRegisterInput,
  type TeacherRegisterValues,
} from "@/features/teachers/schemas/teacher-register.schema";
import { useTeacherOptions } from "@/features/teachers/hooks/useTeacherOptions";
import { uploadImage } from "@/features/uploads/api/uploads.api";

export default function TeacherRegisterPage() {
  const router = useRouter();
  const mutation = useSubmitTeacherProfile();

  const {
    register,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeacherRegisterInput, unknown, TeacherRegisterValues>({
    resolver: zodResolver(teacherRegisterSchema),
    defaultValues: {
      headline: "",
      bio: "",
      hourlyRate: 20,
      profileImageUrl: "",
      languages: [],
      specialties: [],
    },
  });

  const selectedLanguages = watch("languages");
  const selectedSpecialties = watch("specialties");
  const profileImage = watch("profileImage");

  const { data: options, isLoading, isError } = useTeacherOptions();

  const languages = options?.languages ?? [];
  const specialties = options?.specialties ?? [];

  const imagePreviewUrl = useMemo(() => {
    if (!profileImage) return null;

    return URL.createObjectURL(profileImage);
  }, [profileImage]);

  const toggleFormArrayValue = (
    fieldName: "languages" | "specialties",
    value: string,
  ) => {
    const currentValues = watch(fieldName) ?? [];

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
      let profileImageUrl = data.profileImageUrl;

      if (profileImage) {
        const uploaded = await uploadImage(profileImage, "profile-images");
        profileImageUrl = uploaded.url;
      }

      await mutation.mutateAsync({
        ...data,
        profileImageUrl,
      });

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Become a Tutorly teacher
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-10 text-muted-foreground">
          Share your teaching style and expertise. Once approved, learners
          around the world can book lessons with you.
        </p>
      </section>

      <form
        onSubmit={handleFormSubmit(onSubmit)}
        className="mt-12 rounded-[32px] border border-border bg-background p-8"
      >
        <div className="space-y-9">
          <div>
            <label className="mb-3 block text-lg font-semibold text-foreground">
              Profile image
            </label>

            <div className="flex items-center gap-5">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-3xl border border-border bg-secondary">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Profile preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <Camera className="size-8 text-muted-foreground" />
                )}
              </div>

              <div>
                <label className="inline-flex h-12 cursor-pointer items-center justify-center rounded-2xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
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
            <label className="mb-3 block text-lg font-semibold text-foreground">
              Headline
            </label>

            <input
              {...register("headline")}
              placeholder="e.g. Certified Spanish tutor — speak with confidence"
              className="h-14 w-full rounded-2xl border border-border bg-background px-5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />

            {errors.headline && (
              <p className="mt-2 text-sm text-red-500">
                {errors.headline.message}
              </p>
            )}

            <p className="mt-3 text-sm text-muted-foreground">
              A short tagline learners will see first.
            </p>
          </div>

          <div>
            <label className="mb-3 block text-lg font-semibold text-foreground">
              Bio
            </label>

            <textarea
              {...register("bio")}
              placeholder="Tell learners about your teaching style, experience, and what a lesson with you looks like."
              className="min-h-64 w-full resize-y rounded-2xl border border-border bg-background px-5 py-4 text-base leading-7 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />

            {errors.bio && (
              <p className="mt-2 text-sm text-red-500">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className="mb-3 block text-lg font-semibold text-foreground">
              Hourly rate (USD)
            </label>

            <div className="flex h-14 max-w-md items-center gap-3 rounded-2xl border border-border px-5 focus-within:border-primary">
              <span className="text-lg text-muted-foreground">$</span>

              <input
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
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Languages you teach
            </h2>

            <div className="flex flex-wrap gap-3">
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
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Specialties
            </h2>

            <div className="flex flex-wrap gap-3">
              {specialties.map((specialty) => {
                const isSelected = selectedSpecialties.includes(specialty.code);

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

        {mutation.isError && (
          <p className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            Failed to submit profile. Please try again.
          </p>
        )}

        <div className="mt-10 border-t border-border pt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base text-muted-foreground">
              We'll review your application within a few days.
            </p>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="h-14 rounded-2xl bg-primary px-10 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending ? "Submitting..." : "Submit for review"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

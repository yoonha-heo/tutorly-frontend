import type { AdminTeacherProfile } from "../types/admin";

type TeacherReviewFieldsProps = {
  teacher: AdminTeacherProfile;
};

export function TeacherReviewFields({ teacher }: TeacherReviewFieldsProps) {
  const languages = teacher.teacherLanguages.map((item) => item.language.name);
  const specialties = teacher.teacherSpecialties.map(
    (item) => item.specialty.name,
  );

  return (
    <dl className="mt-6">
      <Field label="Headline" value={teacher.headline} />
      <Field label="Bio" value={teacher.bio} />
      <Field
        label="Hourly rate"
        value={
          teacher.hourlyRate === null ? null : `$${teacher.hourlyRate} / hour`
        }
      />
      <Field label="Timezone" value={teacher.timezone} />
      <Field label="Languages" value={formatList(languages)} />
      <Field label="Specialties" value={formatList(specialties)} />
      <Field label="Previous rejection" value={teacher.rejectionReason} />
    </dl>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid gap-1 border-b border-border py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="whitespace-pre-wrap text-sm text-foreground">
        {value?.trim() ? value : "—"}
      </dd>
    </div>
  );
}

function formatList(values: string[]) {
  return values.length > 0 ? values.join(", ") : null;
}

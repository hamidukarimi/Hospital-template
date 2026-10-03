import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  PencilLine,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminButton } from "../../components/AdminButton";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";
import { SearchInput } from "../../components/SearchInput";
import { StatusBadge } from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";
import adminApi from "../../services/adminApi";
import {
  adminFormActionsClass,
  adminFormClass,
  adminFormGridClass,
  adminFormPageWrap,
  getImageUrl,
} from "../../utils/adminHelpers";

interface DoctorSpecialtyItem {
  label: string;
  icon?: string;
  className?: string;
}

interface DoctorNamedItem {
  name: string;
  description?: string;
}

interface DoctorEducationItem {
  year: string;
  title: string;
  institution: string;
}

interface DoctorCertificationItem {
  name: string;
  issuer?: string;
  year?: string;
}

interface DoctorLanguageItem {
  name: string;
}

interface DoctorMembershipItem {
  name: string;
  role?: string;
}

interface DoctorAchievementItem {
  label: string;
  icon?: string;
}

interface DoctorPublicationItem {
  title: string;
  year?: string;
  venue?: string;
  url?: string;
}

interface DoctorTeachingItem {
  title: string;
  institution?: string;
  year?: string;
}

interface DoctorItem {
  id: string;
  name: string;
  slug?: string | null;
  specialty: string;
  credentials?: string | null;
  professionalTitle?: string | null;
  description?: string | null;
  carePhilosophy?: string | null;
  image?: string | null;
  profileUrl?: string | null;
  category?: string | null;
  yearsExperience?: string | null;
  patientsTreated?: string | null;
  rating?: string | null;
  overviewTitle?: string | null;
  specialties?: DoctorSpecialtyItem[] | null;
  clinicalInterests?: DoctorNamedItem[] | null;
  conditionsTreated?: DoctorNamedItem[] | null;
  procedures?: DoctorNamedItem[] | null;
  education?: DoctorEducationItem[] | null;
  certifications?: DoctorCertificationItem[] | null;
  languages?: DoctorLanguageItem[] | null;
  memberships?: DoctorMembershipItem[] | null;
  affiliations?: DoctorMembershipItem[] | null;
  achievements?: DoctorAchievementItem[] | null;
  researchInterests?: DoctorNamedItem[] | null;
  publications?: DoctorPublicationItem[] | null;
  teachingExperience?: DoctorTeachingItem[] | null;
  consultationType?: string | null;
  consultationLocation?: string | null;
  acceptingNewPatients?: boolean | null;
  isActive?: boolean;
  sortOrder?: number;
}

type DoctorFormState = {
  name: string;
  slug: string;
  specialty: string;
  credentials: string;
  professionalTitle: string;
  description: string;
  carePhilosophy: string;
  image: string;
  profileUrl: string;
  category: string;
  yearsExperience: string;
  patientsTreated: string;
  rating: string;
  overviewTitle: string;
  specialties: DoctorSpecialtyItem[];
  clinicalInterests: DoctorNamedItem[];
  conditionsTreated: DoctorNamedItem[];
  procedures: DoctorNamedItem[];
  education: DoctorEducationItem[];
  certifications: DoctorCertificationItem[];
  languages: DoctorLanguageItem[];
  memberships: DoctorMembershipItem[];
  affiliations: DoctorMembershipItem[];
  achievements: DoctorAchievementItem[];
  researchInterests: DoctorNamedItem[];
  publications: DoctorPublicationItem[];
  teachingExperience: DoctorTeachingItem[];
  consultationType: string;
  consultationLocation: string;
  acceptingNewPatients: boolean;
  isActive: boolean;
  sortOrder: number;
};

const emptyForm: DoctorFormState = {
  name: "",
  slug: "",
  specialty: "",
  credentials: "",
  professionalTitle: "",
  description: "",
  carePhilosophy: "",
  image: "",
  profileUrl: "",
  category: "",
  yearsExperience: "",
  patientsTreated: "",
  rating: "",
  overviewTitle: "",
  specialties: [],
  clinicalInterests: [],
  conditionsTreated: [],
  procedures: [],
  education: [],
  certifications: [],
  languages: [],
  memberships: [],
  affiliations: [],
  achievements: [],
  researchInterests: [],
  publications: [],
  teachingExperience: [],
  consultationType: "",
  consultationLocation: "",
  acceptingNewPatients: true,
  isActive: true,
  sortOrder: 0,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm";

const SectionTitle = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="md:col-span-2 border-b border-slate-100 pb-3">
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    <p className="mt-1 text-sm text-slate-500">{description}</p>
  </div>
);

const Field = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <label className={`space-y-2 ${className}`}>
    <span className="text-sm font-medium text-slate-700">{label}</span>
    {children}
  </label>
);

const asArray = <T,>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : [];

const moveItem = <T,>(items: T[], index: number, direction: -1 | 1): T[] => {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
};

const RepeatableControls = ({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) => (
  <div className="flex flex-wrap items-center gap-2 md:col-span-2">
    <AdminButton
      type="button"
      variant="ghost"
      disabled={index === 0}
      onClick={onMoveUp}
      aria-label="Move up"
    >
      <ChevronUp className="h-4 w-4" />
      Up
    </AdminButton>
    <AdminButton
      type="button"
      variant="ghost"
      disabled={index >= total - 1}
      onClick={onMoveDown}
      aria-label="Move down"
    >
      <ChevronDown className="h-4 w-4" />
      Down
    </AdminButton>
    <AdminButton type="button" variant="ghost" onClick={onRemove}>
      <Trash2 className="h-4 w-4" />
      Remove
    </AdminButton>
  </div>
);

const DoctorsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<DoctorItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState<DoctorFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/doctors\/.+\/edit$/.test(location.pathname);

  const updateField = <K extends keyof DoctorFormState>(
    key: K,
    value: DoctorFormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await adminApi.get<DoctorItem[]>("/admin/doctors");
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load doctors.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) void load();
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/doctors\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<DoctorItem>(`/admin/doctors/${id}`);
        setEditingId(id);
        setForm({
          name: item.name ?? "",
          slug: item.slug ?? "",
          specialty: item.specialty ?? "",
          credentials: item.credentials ?? "",
          professionalTitle: item.professionalTitle ?? "",
          description: item.description ?? "",
          carePhilosophy: item.carePhilosophy ?? "",
          image: item.image ?? "",
          profileUrl: item.profileUrl ?? "",
          category: item.category ?? "",
          yearsExperience: item.yearsExperience ?? "",
          patientsTreated: item.patientsTreated ?? "",
          rating: item.rating ?? "",
          overviewTitle: item.overviewTitle ?? "",
          specialties: asArray(item.specialties).map((entry) => ({
            label: entry.label ?? "",
            icon: entry.icon ?? "",
            className: entry.className ?? "",
          })),
          clinicalInterests: asArray(item.clinicalInterests).map((entry) => ({
            name: entry.name ?? "",
            description: entry.description ?? "",
          })),
          conditionsTreated: asArray(item.conditionsTreated).map((entry) => ({
            name: entry.name ?? "",
            description: entry.description ?? "",
          })),
          procedures: asArray(item.procedures).map((entry) => ({
            name: entry.name ?? "",
            description: entry.description ?? "",
          })),
          education: asArray(item.education).map((entry) => ({
            year: entry.year ?? "",
            title: entry.title ?? "",
            institution: entry.institution ?? "",
          })),
          certifications: asArray(item.certifications).map((entry) => ({
            name: entry.name ?? "",
            issuer: entry.issuer ?? "",
            year: entry.year ?? "",
          })),
          languages: asArray(item.languages).map((entry) => ({
            name: entry.name ?? "",
          })),
          memberships: asArray(item.memberships).map((entry) => ({
            name: entry.name ?? "",
            role: entry.role ?? "",
          })),
          affiliations: asArray(item.affiliations).map((entry) => ({
            name: entry.name ?? "",
            role: entry.role ?? "",
          })),
          achievements: asArray(item.achievements).map((entry) => ({
            label: entry.label ?? "",
            icon: entry.icon ?? "",
          })),
          researchInterests: asArray(item.researchInterests).map((entry) => ({
            name: entry.name ?? "",
            description: entry.description ?? "",
          })),
          publications: asArray(item.publications).map((entry) => ({
            title: entry.title ?? "",
            year: entry.year ?? "",
            venue: entry.venue ?? "",
            url: entry.url ?? "",
          })),
          teachingExperience: asArray(item.teachingExperience).map((entry) => ({
            title: entry.title ?? "",
            institution: entry.institution ?? "",
            year: entry.year ?? "",
          })),
          consultationType: item.consultationType ?? "",
          consultationLocation: item.consultationLocation ?? "",
          acceptingNewPatients: item.acceptingNewPatients ?? true,
          isActive: item.isActive ?? true,
          sortOrder: item.sortOrder ?? 0,
        });
      } catch {
        setError("Unable to load doctor.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) =>
      [item.name, item.specialty, item.category, item.slug].some((field) =>
        (field ?? "").toLowerCase().includes(value),
      ),
    );
  }, [items, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        specialty: form.specialty.trim(),
        credentials: form.credentials.trim() || null,
        professionalTitle: form.professionalTitle.trim() || null,
        description: form.description.trim() || null,
        carePhilosophy: form.carePhilosophy.trim() || null,
        image: form.image.trim() || null,
        profileUrl: form.profileUrl.trim() || null,
        category: form.category.trim() || null,
        yearsExperience: form.yearsExperience.trim() || null,
        patientsTreated: form.patientsTreated.trim() || null,
        rating: form.rating.trim() || null,
        overviewTitle: form.overviewTitle.trim() || null,
        specialties: form.specialties
          .map((item) => ({
            label: item.label.trim(),
            icon: item.icon?.trim() || null,
            className: item.className?.trim() || null,
          }))
          .filter((item) => item.label),
        clinicalInterests: form.clinicalInterests
          .map((item) => ({
            name: item.name.trim(),
            description: item.description?.trim() || null,
          }))
          .filter((item) => item.name),
        conditionsTreated: form.conditionsTreated
          .map((item) => ({
            name: item.name.trim(),
            description: item.description?.trim() || null,
          }))
          .filter((item) => item.name),
        procedures: form.procedures
          .map((item) => ({
            name: item.name.trim(),
            description: item.description?.trim() || null,
          }))
          .filter((item) => item.name),
        education: form.education
          .map((item) => ({
            year: item.year.trim(),
            title: item.title.trim(),
            institution: item.institution.trim(),
          }))
          .filter((item) => item.title && item.institution),
        certifications: form.certifications
          .map((item) => ({
            name: item.name.trim(),
            issuer: item.issuer?.trim() || null,
            year: item.year?.trim() || null,
          }))
          .filter((item) => item.name),
        languages: form.languages
          .map((item) => ({ name: item.name.trim() }))
          .filter((item) => item.name),
        memberships: form.memberships
          .map((item) => ({
            name: item.name.trim(),
            role: item.role?.trim() || null,
          }))
          .filter((item) => item.name),
        affiliations: form.affiliations
          .map((item) => ({
            name: item.name.trim(),
            role: item.role?.trim() || null,
          }))
          .filter((item) => item.name),
        achievements: form.achievements
          .map((item) => ({
            label: item.label.trim(),
            icon: item.icon?.trim() || null,
          }))
          .filter((item) => item.label),
        researchInterests: form.researchInterests
          .map((item) => ({
            name: item.name.trim(),
            description: item.description?.trim() || null,
          }))
          .filter((item) => item.name),
        publications: form.publications
          .map((item) => ({
            title: item.title.trim(),
            year: item.year?.trim() || null,
            venue: item.venue?.trim() || null,
            url: item.url?.trim() || null,
          }))
          .filter((item) => item.title),
        teachingExperience: form.teachingExperience
          .map((item) => ({
            title: item.title.trim(),
            institution: item.institution?.trim() || null,
            year: item.year?.trim() || null,
          }))
          .filter((item) => item.title),
        consultationType: form.consultationType.trim() || null,
        consultationLocation: form.consultationLocation.trim() || null,
        acceptingNewPatients: form.acceptingNewPatients,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder) || 0,
      };

      if (!payload.name || !payload.specialty) {
        pushToast({
          type: "error",
          title: "Missing required fields",
          description: "Name and specialty are required.",
        });
        return;
      }

      if (editingId) {
        await adminApi.patch(`/admin/doctors/${editingId}`, payload);
        pushToast({ type: "success", title: "Doctor updated successfully." });
      } else {
        await adminApi.post("/admin/doctors", payload);
        pushToast({ type: "success", title: "Doctor created successfully." });
      }

      navigate("/admin/doctors");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save doctor",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await adminApi.delete(`/admin/doctors/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({ type: "success", title: "Doctor deleted successfully." });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete doctor",
        description:
          deleteError instanceof Error
            ? deleteError.message
            : "Please try again.",
      });
    } finally {
      setDeleteTargetId(null);
    }
  };

  if (isFormView) {
    return (
      <div className={adminFormPageWrap.lg}>
        <PageHeader
          title={editingId ? "Edit doctor" : "Create doctor"}
          backLink="/admin/doctors"
          description={
            editingId
              ? "Update the doctor profile."
              : "Add a physician to the hospital directory."
          }
        />

        <form onSubmit={handleSubmit} className={`${adminFormClass} space-y-8`}>
          <div className={adminFormGridClass}>
            <SectionTitle
              title="Basic information"
              description="Core identity fields used across the directory and profile page."
            />
            <Field label="Name">
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClass}
                required
              />
            </Field>
            <Field label="Slug">
              <input
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                className={inputClass}
                placeholder="ahmad-rahimi"
              />
            </Field>
            <Field label="Specialty">
              <input
                value={form.specialty}
                onChange={(event) =>
                  updateField("specialty", event.target.value)
                }
                className={inputClass}
                required
              />
            </Field>
            <Field label="Credentials">
              <input
                value={form.credentials}
                onChange={(event) =>
                  updateField("credentials", event.target.value)
                }
                className={inputClass}
                placeholder="MD, FACP"
              />
            </Field>
            <Field label="Professional title" className="md:col-span-2">
              <input
                value={form.professionalTitle}
                onChange={(event) =>
                  updateField("professionalTitle", event.target.value)
                }
                className={inputClass}
                placeholder="Consultant Cardiologist"
              />
            </Field>
            <Field label="Category">
              <input
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) =>
                  updateField("sortOrder", Number(event.target.value))
                }
                className={inputClass}
              />
            </Field>
            <Field label="Image URL" className="md:col-span-2">
              <input
                value={form.image}
                onChange={(event) => updateField("image", event.target.value)}
                className={inputClass}
                placeholder="/uploads/doctors/doctor.jpg"
              />
            </Field>
            <Field label="Profile URL" className="md:col-span-2">
              <input
                value={form.profileUrl}
                onChange={(event) =>
                  updateField("profileUrl", event.target.value)
                }
                className={inputClass}
                placeholder="/doctors/ahmad-rahimi"
              />
            </Field>
            <Field label="Years experience">
              <input
                value={form.yearsExperience}
                onChange={(event) =>
                  updateField("yearsExperience", event.target.value)
                }
                className={inputClass}
                placeholder="15+"
              />
            </Field>
            <Field label="Patients treated">
              <input
                value={form.patientsTreated}
                onChange={(event) =>
                  updateField("patientsTreated", event.target.value)
                }
                className={inputClass}
                placeholder="10K+"
              />
            </Field>
            <Field label="Rating">
              <input
                value={form.rating}
                onChange={(event) => updateField("rating", event.target.value)}
                className={inputClass}
                placeholder="4.9/5"
              />
            </Field>
            <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <span>Active</span>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  updateField("isActive", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
            </label>
          </div>

          <div className={adminFormGridClass}>
            <SectionTitle
              title="Biography"
              description="Patient-facing overview content. Description is the main biography."
            />
            <Field label="Overview title" className="md:col-span-2">
              <input
                value={form.overviewTitle}
                onChange={(event) =>
                  updateField("overviewTitle", event.target.value)
                }
                className={inputClass}
                placeholder="About Dr. Ahmad Rahimi"
              />
            </Field>
            <Field label="Biography / description" className="md:col-span-2">
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={5}
                className={inputClass}
              />
            </Field>
            <Field label="Care philosophy" className="md:col-span-2">
              <textarea
                value={form.carePhilosophy}
                onChange={(event) =>
                  updateField("carePhilosophy", event.target.value)
                }
                rows={3}
                className={inputClass}
                placeholder="How this doctor approaches patient care"
              />
            </Field>
          </div>

          <div className="space-y-4">
            <div className={adminFormGridClass}>
              <SectionTitle
                title="Clinical expertise"
                description="Specialties, interests, conditions, and procedures shown on the public profile."
              />
            </div>

            {form.specialties.map((item, index) => (
              <div
                key={`specialty-${index}`}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
              >
                <Field label="Specialty label">
                  <input
                    value={item.label}
                    onChange={(event) => {
                      const next = [...form.specialties];
                      next[index] = { ...next[index], label: event.target.value };
                      updateField("specialties", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Icon key">
                  <input
                    value={item.icon ?? ""}
                    onChange={(event) => {
                      const next = [...form.specialties];
                      next[index] = { ...next[index], icon: event.target.value };
                      updateField("specialties", next);
                    }}
                    className={inputClass}
                    placeholder="Heart"
                  />
                </Field>
                <Field label="CSS class names" className="md:col-span-2">
                  <input
                    value={item.className ?? ""}
                    onChange={(event) => {
                      const next = [...form.specialties];
                      next[index] = {
                        ...next[index],
                        className: event.target.value,
                      };
                      updateField("specialties", next);
                    }}
                    className={inputClass}
                    placeholder="bg-pink-50 text-pink-700 border-pink-200"
                  />
                </Field>
                <RepeatableControls
                  index={index}
                  total={form.specialties.length}
                  onMoveUp={() =>
                    updateField(
                      "specialties",
                      moveItem(form.specialties, index, -1),
                    )
                  }
                  onMoveDown={() =>
                    updateField(
                      "specialties",
                      moveItem(form.specialties, index, 1),
                    )
                  }
                  onRemove={() =>
                    updateField(
                      "specialties",
                      form.specialties.filter((_, i) => i !== index),
                    )
                  }
                />
              </div>
            ))}
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() =>
                updateField("specialties", [
                  ...form.specialties,
                  { label: "", icon: "", className: "" },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add specialty
            </AdminButton>

            {(["clinicalInterests", "conditionsTreated", "procedures"] as const).map(
              (fieldKey) => {
                const labels = {
                  clinicalInterests: "Clinical interest",
                  conditionsTreated: "Condition treated",
                  procedures: "Procedure / treatment",
                } as const;
                const list = form[fieldKey];
                return (
                  <div key={fieldKey} className="space-y-3 pt-2">
                    <h4 className="text-sm font-semibold text-slate-800">
                      {labels[fieldKey]}s
                    </h4>
                    {list.map((item, index) => (
                      <div
                        key={`${fieldKey}-${index}`}
                        className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
                      >
                        <Field label="Name">
                          <input
                            value={item.name}
                            onChange={(event) => {
                              const next = [...list];
                              next[index] = {
                                ...next[index],
                                name: event.target.value,
                              };
                              updateField(fieldKey, next);
                            }}
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Short description">
                          <input
                            value={item.description ?? ""}
                            onChange={(event) => {
                              const next = [...list];
                              next[index] = {
                                ...next[index],
                                description: event.target.value,
                              };
                              updateField(fieldKey, next);
                            }}
                            className={inputClass}
                          />
                        </Field>
                        <RepeatableControls
                          index={index}
                          total={list.length}
                          onMoveUp={() =>
                            updateField(fieldKey, moveItem(list, index, -1))
                          }
                          onMoveDown={() =>
                            updateField(fieldKey, moveItem(list, index, 1))
                          }
                          onRemove={() =>
                            updateField(
                              fieldKey,
                              list.filter((_, i) => i !== index),
                            )
                          }
                        />
                      </div>
                    ))}
                    <AdminButton
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        updateField(fieldKey, [
                          ...list,
                          { name: "", description: "" },
                        ])
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add {labels[fieldKey].toLowerCase()}
                    </AdminButton>
                  </div>
                );
              },
            )}
          </div>

          <div className="space-y-4">
            <div className={adminFormGridClass}>
              <SectionTitle
                title="Education and certifications"
                description="Training timeline and professional certifications or licenses."
              />
            </div>
            {form.education.map((item, index) => (
              <div
                key={`education-${index}`}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
              >
                <Field label="Year">
                  <input
                    value={item.year}
                    onChange={(event) => {
                      const next = [...form.education];
                      next[index] = { ...next[index], year: event.target.value };
                      updateField("education", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Title">
                  <input
                    value={item.title}
                    onChange={(event) => {
                      const next = [...form.education];
                      next[index] = { ...next[index], title: event.target.value };
                      updateField("education", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Institution" className="md:col-span-2">
                  <input
                    value={item.institution}
                    onChange={(event) => {
                      const next = [...form.education];
                      next[index] = {
                        ...next[index],
                        institution: event.target.value,
                      };
                      updateField("education", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <RepeatableControls
                  index={index}
                  total={form.education.length}
                  onMoveUp={() =>
                    updateField("education", moveItem(form.education, index, -1))
                  }
                  onMoveDown={() =>
                    updateField("education", moveItem(form.education, index, 1))
                  }
                  onRemove={() =>
                    updateField(
                      "education",
                      form.education.filter((_, i) => i !== index),
                    )
                  }
                />
              </div>
            ))}
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() =>
                updateField("education", [
                  ...form.education,
                  { year: "", title: "", institution: "" },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add education entry
            </AdminButton>

            {form.certifications.map((item, index) => (
              <div
                key={`certification-${index}`}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
              >
                <Field label="Certification / license">
                  <input
                    value={item.name}
                    onChange={(event) => {
                      const next = [...form.certifications];
                      next[index] = { ...next[index], name: event.target.value };
                      updateField("certifications", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Issuer">
                  <input
                    value={item.issuer ?? ""}
                    onChange={(event) => {
                      const next = [...form.certifications];
                      next[index] = {
                        ...next[index],
                        issuer: event.target.value,
                      };
                      updateField("certifications", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Year">
                  <input
                    value={item.year ?? ""}
                    onChange={(event) => {
                      const next = [...form.certifications];
                      next[index] = { ...next[index], year: event.target.value };
                      updateField("certifications", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <RepeatableControls
                  index={index}
                  total={form.certifications.length}
                  onMoveUp={() =>
                    updateField(
                      "certifications",
                      moveItem(form.certifications, index, -1),
                    )
                  }
                  onMoveDown={() =>
                    updateField(
                      "certifications",
                      moveItem(form.certifications, index, 1),
                    )
                  }
                  onRemove={() =>
                    updateField(
                      "certifications",
                      form.certifications.filter((_, i) => i !== index),
                    )
                  }
                />
              </div>
            ))}
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() =>
                updateField("certifications", [
                  ...form.certifications,
                  { name: "", issuer: "", year: "" },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add certification
            </AdminButton>
          </div>

          <div className="space-y-4">
            <div className={adminFormGridClass}>
              <SectionTitle
                title="Languages"
                description="Languages the doctor can use with patients."
              />
            </div>
            {form.languages.map((item, index) => (
              <div
                key={`language-${index}`}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
              >
                <Field label="Language">
                  <input
                    value={item.name}
                    onChange={(event) => {
                      const next = [...form.languages];
                      next[index] = { name: event.target.value };
                      updateField("languages", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <RepeatableControls
                  index={index}
                  total={form.languages.length}
                  onMoveUp={() =>
                    updateField("languages", moveItem(form.languages, index, -1))
                  }
                  onMoveDown={() =>
                    updateField("languages", moveItem(form.languages, index, 1))
                  }
                  onRemove={() =>
                    updateField(
                      "languages",
                      form.languages.filter((_, i) => i !== index),
                    )
                  }
                />
              </div>
            ))}
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() =>
                updateField("languages", [...form.languages, { name: "" }])
              }
            >
              <Plus className="h-4 w-4" />
              Add language
            </AdminButton>
          </div>

          <div className="space-y-4">
            <div className={adminFormGridClass}>
              <SectionTitle
                title="Awards and memberships"
                description="Recognition, professional memberships, and affiliations."
              />
            </div>
            {form.achievements.map((item, index) => (
              <div
                key={`achievement-${index}`}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
              >
                <Field label="Award / recognition">
                  <input
                    value={item.label}
                    onChange={(event) => {
                      const next = [...form.achievements];
                      next[index] = { ...next[index], label: event.target.value };
                      updateField("achievements", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Icon key">
                  <input
                    value={item.icon ?? ""}
                    onChange={(event) => {
                      const next = [...form.achievements];
                      next[index] = { ...next[index], icon: event.target.value };
                      updateField("achievements", next);
                    }}
                    className={inputClass}
                    placeholder="Award"
                  />
                </Field>
                <RepeatableControls
                  index={index}
                  total={form.achievements.length}
                  onMoveUp={() =>
                    updateField(
                      "achievements",
                      moveItem(form.achievements, index, -1),
                    )
                  }
                  onMoveDown={() =>
                    updateField(
                      "achievements",
                      moveItem(form.achievements, index, 1),
                    )
                  }
                  onRemove={() =>
                    updateField(
                      "achievements",
                      form.achievements.filter((_, i) => i !== index),
                    )
                  }
                />
              </div>
            ))}
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() =>
                updateField("achievements", [
                  ...form.achievements,
                  { label: "", icon: "" },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add award / recognition
            </AdminButton>

            {(["memberships", "affiliations"] as const).map((fieldKey) => {
              const list = form[fieldKey];
              const singular =
                fieldKey === "memberships" ? "membership" : "affiliation";
              return (
                <div key={fieldKey} className="space-y-3 pt-2">
                  <h4 className="text-sm font-semibold text-slate-800">
                    {fieldKey === "memberships"
                      ? "Professional memberships"
                      : "Hospital / institutional affiliations"}
                  </h4>
                  {list.map((item, index) => (
                    <div
                      key={`${fieldKey}-${index}`}
                      className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
                    >
                      <Field label="Name">
                        <input
                          value={item.name}
                          onChange={(event) => {
                            const next = [...list];
                            next[index] = {
                              ...next[index],
                              name: event.target.value,
                            };
                            updateField(fieldKey, next);
                          }}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Role">
                        <input
                          value={item.role ?? ""}
                          onChange={(event) => {
                            const next = [...list];
                            next[index] = {
                              ...next[index],
                              role: event.target.value,
                            };
                            updateField(fieldKey, next);
                          }}
                          className={inputClass}
                        />
                      </Field>
                      <RepeatableControls
                        index={index}
                        total={list.length}
                        onMoveUp={() =>
                          updateField(fieldKey, moveItem(list, index, -1))
                        }
                        onMoveDown={() =>
                          updateField(fieldKey, moveItem(list, index, 1))
                        }
                        onRemove={() =>
                          updateField(
                            fieldKey,
                            list.filter((_, i) => i !== index),
                          )
                        }
                      />
                    </div>
                  ))}
                  <AdminButton
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      updateField(fieldKey, [...list, { name: "", role: "" }])
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add {singular}
                  </AdminButton>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className={adminFormGridClass}>
              <SectionTitle
                title="Research and publications"
                description="Optional academic details for doctors who publish or teach."
              />
            </div>
            {form.researchInterests.map((item, index) => (
              <div
                key={`research-${index}`}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
              >
                <Field label="Research interest">
                  <input
                    value={item.name}
                    onChange={(event) => {
                      const next = [...form.researchInterests];
                      next[index] = { ...next[index], name: event.target.value };
                      updateField("researchInterests", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Short description">
                  <input
                    value={item.description ?? ""}
                    onChange={(event) => {
                      const next = [...form.researchInterests];
                      next[index] = {
                        ...next[index],
                        description: event.target.value,
                      };
                      updateField("researchInterests", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <RepeatableControls
                  index={index}
                  total={form.researchInterests.length}
                  onMoveUp={() =>
                    updateField(
                      "researchInterests",
                      moveItem(form.researchInterests, index, -1),
                    )
                  }
                  onMoveDown={() =>
                    updateField(
                      "researchInterests",
                      moveItem(form.researchInterests, index, 1),
                    )
                  }
                  onRemove={() =>
                    updateField(
                      "researchInterests",
                      form.researchInterests.filter((_, i) => i !== index),
                    )
                  }
                />
              </div>
            ))}
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() =>
                updateField("researchInterests", [
                  ...form.researchInterests,
                  { name: "", description: "" },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add research interest
            </AdminButton>

            {form.publications.map((item, index) => (
              <div
                key={`publication-${index}`}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
              >
                <Field label="Title" className="md:col-span-2">
                  <input
                    value={item.title}
                    onChange={(event) => {
                      const next = [...form.publications];
                      next[index] = { ...next[index], title: event.target.value };
                      updateField("publications", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Year">
                  <input
                    value={item.year ?? ""}
                    onChange={(event) => {
                      const next = [...form.publications];
                      next[index] = { ...next[index], year: event.target.value };
                      updateField("publications", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Venue">
                  <input
                    value={item.venue ?? ""}
                    onChange={(event) => {
                      const next = [...form.publications];
                      next[index] = { ...next[index], venue: event.target.value };
                      updateField("publications", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="URL" className="md:col-span-2">
                  <input
                    value={item.url ?? ""}
                    onChange={(event) => {
                      const next = [...form.publications];
                      next[index] = { ...next[index], url: event.target.value };
                      updateField("publications", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <RepeatableControls
                  index={index}
                  total={form.publications.length}
                  onMoveUp={() =>
                    updateField(
                      "publications",
                      moveItem(form.publications, index, -1),
                    )
                  }
                  onMoveDown={() =>
                    updateField(
                      "publications",
                      moveItem(form.publications, index, 1),
                    )
                  }
                  onRemove={() =>
                    updateField(
                      "publications",
                      form.publications.filter((_, i) => i !== index),
                    )
                  }
                />
              </div>
            ))}
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() =>
                updateField("publications", [
                  ...form.publications,
                  { title: "", year: "", venue: "", url: "" },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add publication
            </AdminButton>

            {form.teachingExperience.map((item, index) => (
              <div
                key={`teaching-${index}`}
                className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
              >
                <Field label="Title">
                  <input
                    value={item.title}
                    onChange={(event) => {
                      const next = [...form.teachingExperience];
                      next[index] = { ...next[index], title: event.target.value };
                      updateField("teachingExperience", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Year">
                  <input
                    value={item.year ?? ""}
                    onChange={(event) => {
                      const next = [...form.teachingExperience];
                      next[index] = { ...next[index], year: event.target.value };
                      updateField("teachingExperience", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <Field label="Institution" className="md:col-span-2">
                  <input
                    value={item.institution ?? ""}
                    onChange={(event) => {
                      const next = [...form.teachingExperience];
                      next[index] = {
                        ...next[index],
                        institution: event.target.value,
                      };
                      updateField("teachingExperience", next);
                    }}
                    className={inputClass}
                  />
                </Field>
                <RepeatableControls
                  index={index}
                  total={form.teachingExperience.length}
                  onMoveUp={() =>
                    updateField(
                      "teachingExperience",
                      moveItem(form.teachingExperience, index, -1),
                    )
                  }
                  onMoveDown={() =>
                    updateField(
                      "teachingExperience",
                      moveItem(form.teachingExperience, index, 1),
                    )
                  }
                  onRemove={() =>
                    updateField(
                      "teachingExperience",
                      form.teachingExperience.filter((_, i) => i !== index),
                    )
                  }
                />
              </div>
            ))}
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() =>
                updateField("teachingExperience", [
                  ...form.teachingExperience,
                  { title: "", institution: "", year: "" },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Add teaching experience
            </AdminButton>
          </div>

          <div className={adminFormGridClass}>
            <SectionTitle
              title="Practice information"
              description="Optional patient-facing practice details. Do not store private contact information here."
            />
            <Field label="Consultation type">
              <input
                value={form.consultationType}
                onChange={(event) =>
                  updateField("consultationType", event.target.value)
                }
                className={inputClass}
                placeholder="In-person, Telehealth"
              />
            </Field>
            <Field label="Consultation location / department">
              <input
                value={form.consultationLocation}
                onChange={(event) =>
                  updateField("consultationLocation", event.target.value)
                }
                className={inputClass}
                placeholder="Cardiology Department"
              />
            </Field>
            <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Accepting new patients</span>
              <input
                type="checkbox"
                checked={form.acceptingNewPatients}
                onChange={(event) =>
                  updateField("acceptingNewPatients", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300"
              />
            </label>
          </div>

          <div className={adminFormActionsClass}>
            <Link
              to="/admin/doctors"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
            >
              Cancel
            </Link>
            <AdminButton type="submit" variant="secondary" disabled={saving}>
              {saving
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                  ? "Update doctor"
                  : "Create doctor"}
            </AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Doctors"
        description="Manage specialist profiles and physician directory content."
        action={
          <Link to="/admin/doctors/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add doctor
            </AdminButton>
          </Link>
        }
      />

      {error && <ErrorState title="Unable to load doctors" message={error} />}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search doctors..."
        />
      </div>

      {loading ? (
        <LoadingState label="Loading doctors..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="Add a doctor to begin building your care team."
          actionLabel="Create doctor"
          actionHref="/admin/doctors/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Doctor</th>
                  <th className="px-4 py-3 font-semibold">Specialty</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Image</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-t border-slate-200 align-top"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {doctor.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {doctor.slug || doctor.category || "General"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {doctor.specialty}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        value={doctor.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-4 py-4">
                      {doctor.image ? (
                        <img
                          src={getImageUrl(doctor.image)}
                          alt={doctor.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/doctors/${doctor.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(doctor.id)}
                          className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        title="Delete doctor?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default DoctorsPage;

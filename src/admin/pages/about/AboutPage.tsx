import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminButton } from "../../components/AdminButton";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";
import { useToast } from "../../components/Toast";
import adminApi from "../../services/adminApi";
import {
  adminFormActionsClass,
  adminFormClass,
  adminFormGridClass,
  adminFormPageWrap,
} from "../../utils/adminHelpers";
import type { AboutMilestoneItem, AboutStatItem } from "../../../types/api";

interface AboutFormState {
  smallTitle: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonUrl: string;
  informationImage: string;
  informationTitle: string;
  informationSubtitle: string;
  informationLogo: string;
  rating: string;
  badgeText: string;
  badgeValue: string;
  heroBadge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  heroImageCaption: string;
  missionTitle: string;
  missionTagline: string;
  missionDescription: string;
  missionButtonText: string;
  visionTitle: string;
  visionTagline: string;
  visionDescription: string;
  visionButtonText: string;
  statsEyebrow: string;
  statsTitle: string;
  statsDescription: string;
  stats: AboutStatItem[];
  milestonesEyebrow: string;
  milestonesTitle: string;
  milestonesDescription: string;
  milestonesImage: string;
  milestonesImageCaption: string;
  milestones: AboutMilestoneItem[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
}

const emptyForm: AboutFormState = {
  smallTitle: "",
  title: "",
  description: "",
  image: "",
  buttonText: "",
  buttonUrl: "",
  informationImage: "",
  informationTitle: "",
  informationSubtitle: "",
  informationLogo: "",
  rating: "",
  badgeText: "",
  badgeValue: "",
  heroBadge: "",
  heroTitle: "",
  heroTitleHighlight: "",
  heroSubtitle: "",
  heroButtonText: "",
  heroImage: "",
  heroImageCaption: "",
  missionTitle: "",
  missionTagline: "",
  missionDescription: "",
  missionButtonText: "",
  visionTitle: "",
  visionTagline: "",
  visionDescription: "",
  visionButtonText: "",
  statsEyebrow: "",
  statsTitle: "",
  statsDescription: "",
  stats: [],
  milestonesEyebrow: "",
  milestonesTitle: "",
  milestonesDescription: "",
  milestonesImage: "",
  milestonesImageCaption: "",
  milestones: [],
  ctaTitle: "",
  ctaSubtitle: "",
  ctaButtonText: "",
  ctaButtonUrl: "",
};

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

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm";

const AboutPage = () => {
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<AboutFormState>(emptyForm);

  useEffect(() => {
    const load = async () => {
      try {
        const item = await adminApi.get<AboutFormState & { rating?: number | string | null }>(
          "/admin/about",
        );

        setForm({
          smallTitle: item?.smallTitle ?? "",
          title: item?.title ?? "",
          description: item?.description ?? "",
          image: item?.image ?? "",
          buttonText: item?.buttonText ?? "",
          buttonUrl: item?.buttonUrl ?? "",
          informationImage: item?.informationImage ?? "",
          informationTitle: item?.informationTitle ?? "",
          informationSubtitle: item?.informationSubtitle ?? "",
          informationLogo: item?.informationLogo ?? "",
          rating:
            item?.rating === null || item?.rating === undefined
              ? ""
              : String(item.rating),
          badgeText: item?.badgeText ?? "",
          badgeValue: item?.badgeValue ?? "",
          heroBadge: item?.heroBadge ?? "",
          heroTitle: item?.heroTitle ?? "",
          heroTitleHighlight: item?.heroTitleHighlight ?? "",
          heroSubtitle: item?.heroSubtitle ?? "",
          heroButtonText: item?.heroButtonText ?? "",
          heroImage: item?.heroImage ?? "",
          heroImageCaption: item?.heroImageCaption ?? "",
          missionTitle: item?.missionTitle ?? "",
          missionTagline: item?.missionTagline ?? "",
          missionDescription: item?.missionDescription ?? "",
          missionButtonText: item?.missionButtonText ?? "",
          visionTitle: item?.visionTitle ?? "",
          visionTagline: item?.visionTagline ?? "",
          visionDescription: item?.visionDescription ?? "",
          visionButtonText: item?.visionButtonText ?? "",
          statsEyebrow: item?.statsEyebrow ?? "",
          statsTitle: item?.statsTitle ?? "",
          statsDescription: item?.statsDescription ?? "",
          stats: Array.isArray(item?.stats) ? item.stats : [],
          milestonesEyebrow: item?.milestonesEyebrow ?? "",
          milestonesTitle: item?.milestonesTitle ?? "",
          milestonesDescription: item?.milestonesDescription ?? "",
          milestonesImage: item?.milestonesImage ?? "",
          milestonesImageCaption: item?.milestonesImageCaption ?? "",
          milestones: Array.isArray(item?.milestones) ? item.milestones : [],
          ctaTitle: item?.ctaTitle ?? "",
          ctaSubtitle: item?.ctaSubtitle ?? "",
          ctaButtonText: item?.ctaButtonText ?? "",
          ctaButtonUrl: item?.ctaButtonUrl ?? "",
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load about information.",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const updateField = <K extends keyof AboutFormState>(
    key: K,
    value: AboutFormState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      await adminApi.patch("/admin/about", {
        smallTitle: form.smallTitle.trim() || null,
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim() || null,
        buttonText: form.buttonText.trim(),
        buttonUrl: form.buttonUrl.trim(),
        informationImage: form.informationImage.trim() || null,
        informationTitle: form.informationTitle.trim() || null,
        informationSubtitle: form.informationSubtitle.trim() || null,
        informationLogo: form.informationLogo.trim() || null,
        rating: form.rating.trim() || null,
        badgeText: form.badgeText.trim() || null,
        badgeValue: form.badgeValue.trim() || null,
        heroBadge: form.heroBadge.trim() || null,
        heroTitle: form.heroTitle.trim() || null,
        heroTitleHighlight: form.heroTitleHighlight.trim() || null,
        heroSubtitle: form.heroSubtitle.trim() || null,
        heroButtonText: form.heroButtonText.trim() || null,
        heroImage: form.heroImage.trim() || null,
        heroImageCaption: form.heroImageCaption.trim() || null,
        missionTitle: form.missionTitle.trim() || null,
        missionTagline: form.missionTagline.trim() || null,
        missionDescription: form.missionDescription.trim() || null,
        missionButtonText: form.missionButtonText.trim() || null,
        visionTitle: form.visionTitle.trim() || null,
        visionTagline: form.visionTagline.trim() || null,
        visionDescription: form.visionDescription.trim() || null,
        visionButtonText: form.visionButtonText.trim() || null,
        statsEyebrow: form.statsEyebrow.trim() || null,
        statsTitle: form.statsTitle.trim() || null,
        statsDescription: form.statsDescription.trim() || null,
        stats: form.stats,
        milestonesEyebrow: form.milestonesEyebrow.trim() || null,
        milestonesTitle: form.milestonesTitle.trim() || null,
        milestonesDescription: form.milestonesDescription.trim() || null,
        milestonesImage: form.milestonesImage.trim() || null,
        milestonesImageCaption: form.milestonesImageCaption.trim() || null,
        milestones: form.milestones,
        ctaTitle: form.ctaTitle.trim() || null,
        ctaSubtitle: form.ctaSubtitle.trim() || null,
        ctaButtonText: form.ctaButtonText.trim() || null,
        ctaButtonUrl: form.ctaButtonUrl.trim() || null,
      });

      pushToast({ type: "success", title: "About information updated." });
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save about information",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Loading about information..." />;
  if (error)
    return (
      <ErrorState title="Unable to load about information" message={error} />
    );

  return (
    <div className={adminFormPageWrap.lg}>
      <PageHeader
        title="About Information"
        description="Edit the hospital's institutional About content. This is a single shared record used by the About page and reusable elsewhere."
      />

      <form onSubmit={handleSubmit} className={`${adminFormClass} space-y-8`}>
        <div className={adminFormGridClass}>
          <SectionTitle
            title="Homepage summary"
            description="Teaser content shown in the homepage About section."
          />

          <Field label="Small title">
            <input
              value={form.smallTitle}
              onChange={(e) => updateField("smallTitle", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Description" className="md:col-span-2">
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Image URL">
            <input
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Button text">
            <input
              value={form.buttonText}
              onChange={(e) => updateField("buttonText", e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Button URL">
            <input
              value={form.buttonUrl}
              onChange={(e) => updateField("buttonUrl", e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Information image URL">
            <input
              value={form.informationImage}
              onChange={(e) => updateField("informationImage", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Information title">
            <input
              value={form.informationTitle}
              onChange={(e) => updateField("informationTitle", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Information subtitle">
            <input
              value={form.informationSubtitle}
              onChange={(e) =>
                updateField("informationSubtitle", e.target.value)
              }
              className={inputClass}
            />
          </Field>
          <Field label="Information logo URL">
            <input
              value={form.informationLogo}
              onChange={(e) => updateField("informationLogo", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Rating">
            <input
              value={form.rating}
              onChange={(e) => updateField("rating", e.target.value)}
              className={inputClass}
              placeholder="4.9"
            />
          </Field>
          <Field label="Badge text">
            <input
              value={form.badgeText}
              onChange={(e) => updateField("badgeText", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Badge value">
            <input
              value={form.badgeValue}
              onChange={(e) => updateField("badgeValue", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className={adminFormGridClass}>
          <SectionTitle
            title="About page hero"
            description="Primary institutional hero content for /about."
          />
          <Field label="Hero badge">
            <input
              value={form.heroBadge}
              onChange={(e) => updateField("heroBadge", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Hero button text">
            <input
              value={form.heroButtonText}
              onChange={(e) => updateField("heroButtonText", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Hero title" className="md:col-span-2">
            <input
              value={form.heroTitle}
              onChange={(e) => updateField("heroTitle", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Hero title highlight" className="md:col-span-2">
            <input
              value={form.heroTitleHighlight}
              onChange={(e) =>
                updateField("heroTitleHighlight", e.target.value)
              }
              className={inputClass}
            />
          </Field>
          <Field label="Hero subtitle" className="md:col-span-2">
            <textarea
              value={form.heroSubtitle}
              onChange={(e) => updateField("heroSubtitle", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </Field>
          <Field label="Hero image URL">
            <input
              value={form.heroImage}
              onChange={(e) => updateField("heroImage", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Hero image caption">
            <input
              value={form.heroImageCaption}
              onChange={(e) => updateField("heroImageCaption", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className={adminFormGridClass}>
          <SectionTitle
            title="Mission & vision"
            description="Reusable institutional mission and vision statements."
          />
          <Field label="Mission title">
            <input
              value={form.missionTitle}
              onChange={(e) => updateField("missionTitle", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Mission tagline">
            <input
              value={form.missionTagline}
              onChange={(e) => updateField("missionTagline", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Mission description" className="md:col-span-2">
            <textarea
              value={form.missionDescription}
              onChange={(e) =>
                updateField("missionDescription", e.target.value)
              }
              rows={3}
              className={inputClass}
            />
          </Field>
          <Field label="Mission button text">
            <input
              value={form.missionButtonText}
              onChange={(e) =>
                updateField("missionButtonText", e.target.value)
              }
              className={inputClass}
            />
          </Field>
          <Field label="Vision title">
            <input
              value={form.visionTitle}
              onChange={(e) => updateField("visionTitle", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Vision tagline">
            <input
              value={form.visionTagline}
              onChange={(e) => updateField("visionTagline", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Vision description" className="md:col-span-2">
            <textarea
              value={form.visionDescription}
              onChange={(e) => updateField("visionDescription", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </Field>
          <Field label="Vision button text">
            <input
              value={form.visionButtonText}
              onChange={(e) => updateField("visionButtonText", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="space-y-4">
          <div className={adminFormGridClass}>
            <SectionTitle
              title="Impact stats"
              description="Institutional impact metrics shown on the About page."
            />
            <Field label="Stats eyebrow">
              <input
                value={form.statsEyebrow}
                onChange={(e) => updateField("statsEyebrow", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Stats title">
              <input
                value={form.statsTitle}
                onChange={(e) => updateField("statsTitle", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Stats description" className="md:col-span-2">
              <textarea
                value={form.statsDescription}
                onChange={(e) =>
                  updateField("statsDescription", e.target.value)
                }
                rows={2}
                className={inputClass}
              />
            </Field>
          </div>

          {form.stats.map((stat, index) => (
            <div
              key={`stat-${index}`}
              className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
            >
              <Field label="Icon (Calendar, Users, HeartHandshake)">
                <input
                  value={stat.icon ?? ""}
                  onChange={(e) => {
                    const next = [...form.stats];
                    next[index] = { ...next[index], icon: e.target.value };
                    updateField("stats", next);
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Value">
                <input
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...form.stats];
                    next[index] = { ...next[index], value: e.target.value };
                    updateField("stats", next);
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Title">
                <input
                  value={stat.title}
                  onChange={(e) => {
                    const next = [...form.stats];
                    next[index] = { ...next[index], title: e.target.value };
                    updateField("stats", next);
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Description">
                <input
                  value={stat.description}
                  onChange={(e) => {
                    const next = [...form.stats];
                    next[index] = {
                      ...next[index],
                      description: e.target.value,
                    };
                    updateField("stats", next);
                  }}
                  className={inputClass}
                />
              </Field>
              <div className="md:col-span-2 flex justify-end">
                <AdminButton
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    updateField(
                      "stats",
                      form.stats.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </AdminButton>
              </div>
            </div>
          ))}

          <AdminButton
            type="button"
            variant="secondary"
            onClick={() =>
              updateField("stats", [
                ...form.stats,
                { icon: "Users", value: "", title: "", description: "" },
              ])
            }
          >
            <Plus className="h-4 w-4" />
            Add stat
          </AdminButton>
        </div>

        <div className="space-y-4">
          <div className={adminFormGridClass}>
            <SectionTitle
              title="Journey & milestones"
              description="Hospital history timeline and facilities imagery."
            />
            <Field label="Milestones eyebrow">
              <input
                value={form.milestonesEyebrow}
                onChange={(e) =>
                  updateField("milestonesEyebrow", e.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field label="Milestones title">
              <input
                value={form.milestonesTitle}
                onChange={(e) =>
                  updateField("milestonesTitle", e.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field label="Milestones description" className="md:col-span-2">
              <textarea
                value={form.milestonesDescription}
                onChange={(e) =>
                  updateField("milestonesDescription", e.target.value)
                }
                rows={2}
                className={inputClass}
              />
            </Field>
            <Field label="Milestones image URL">
              <input
                value={form.milestonesImage}
                onChange={(e) =>
                  updateField("milestonesImage", e.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field label="Milestones image caption">
              <input
                value={form.milestonesImageCaption}
                onChange={(e) =>
                  updateField("milestonesImageCaption", e.target.value)
                }
                className={inputClass}
              />
            </Field>
          </div>

          {form.milestones.map((item, index) => (
            <div
              key={`milestone-${index}`}
              className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:grid-cols-2"
            >
              <Field label="Year">
                <input
                  value={item.year}
                  onChange={(e) => {
                    const next = [...form.milestones];
                    next[index] = { ...next[index], year: e.target.value };
                    updateField("milestones", next);
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Title">
                <input
                  value={item.title}
                  onChange={(e) => {
                    const next = [...form.milestones];
                    next[index] = { ...next[index], title: e.target.value };
                    updateField("milestones", next);
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Description" className="md:col-span-2">
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const next = [...form.milestones];
                    next[index] = {
                      ...next[index],
                      description: e.target.value,
                    };
                    updateField("milestones", next);
                  }}
                  rows={2}
                  className={inputClass}
                />
              </Field>
              <div className="md:col-span-2 flex justify-end">
                <AdminButton
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    updateField(
                      "milestones",
                      form.milestones.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </AdminButton>
              </div>
            </div>
          ))}

          <AdminButton
            type="button"
            variant="secondary"
            onClick={() =>
              updateField("milestones", [
                ...form.milestones,
                { year: "", title: "", description: "" },
              ])
            }
          >
            <Plus className="h-4 w-4" />
            Add milestone
          </AdminButton>
        </div>

        <div className={adminFormGridClass}>
          <SectionTitle
            title="CTA banner"
            description="Closing call-to-action used on the About page."
          />
          <Field label="CTA title">
            <input
              value={form.ctaTitle}
              onChange={(e) => updateField("ctaTitle", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="CTA button text">
            <input
              value={form.ctaButtonText}
              onChange={(e) => updateField("ctaButtonText", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="CTA subtitle" className="md:col-span-2">
            <input
              value={form.ctaSubtitle}
              onChange={(e) => updateField("ctaSubtitle", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="CTA button URL" className="md:col-span-2">
            <input
              value={form.ctaButtonUrl}
              onChange={(e) => updateField("ctaButtonUrl", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className={adminFormActionsClass}>
          <AdminButton type="submit" variant="secondary" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save about information"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

export default AboutPage;

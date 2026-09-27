import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  bookAppointment,
  getBookableDoctors,
  getBookableServices,
  getDoctorAvailableDates,
  getDoctorAvailableSlots,
  getFooter,
  getImageUrl,
  getNavbar,
  getSiteSettings,
} from "../lib/api";
import type {
  AppointmentBookingResult,
  AppointmentTimeSlot,
  BookableDoctor,
  BookableService,
  FooterSettings,
  NavbarColumn,
  SiteSettings,
} from "../types/api";

type Step = 1 | 2 | 3 | 4 | 5;

const steps: { id: Step; label: string }[] = [
  { id: 1, label: "Doctor" },
  { id: 2, label: "Service" },
  { id: 3, label: "Date & Time" },
  { id: 4, label: "Details" },
  { id: 5, label: "Confirm" },
];

const formatDisplayDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const formatTimeLabel = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

export default function BookAppointmentPage() {
  const [searchParams] = useSearchParams();
  const preselectedDoctorSlug = searchParams.get("doctor") || "";

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [footer, setFooter] = useState<FooterSettings | null>(null);
  const [navbarColumns, setNavbarColumns] = useState<NavbarColumn[]>([]);
  const [shellLoading, setShellLoading] = useState(true);

  const [step, setStep] = useState<Step>(1);
  const [doctors, setDoctors] = useState<BookableDoctor[]>([]);
  const [services, setServices] = useState<BookableService[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorError, setDoctorError] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState<BookableDoctor | null>(
    null,
  );
  const [selectedService, setSelectedService] =
    useState<BookableService | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<AppointmentTimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentTimeSlot | null>(
    null,
  );

  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] =
    useState<AppointmentBookingResult | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getSiteSettings(), getFooter(), getNavbar()])
      .then(([settings, footerData, navbarData]) => {
        if (!active) return;
        setSiteSettings(settings);
        setFooter(footerData);
        setNavbarColumns(navbarData ?? []);
      })
      .finally(() => {
        if (active) setShellLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setDoctorsLoading(true);
    setDoctorError("");

    Promise.all([getBookableDoctors(), getBookableServices()])
      .then(([doctorData, serviceData]) => {
        if (!active) return;
        const list = doctorData ?? [];
        setDoctors(list);
        setServices(serviceData ?? []);

        if (preselectedDoctorSlug) {
          const match = list.find((d) => d.slug === preselectedDoctorSlug);
          if (match) {
            setSelectedDoctor(match);
            setStep(2);
          }
        }

        if (list.length === 0) {
          setDoctorError(
            "No doctors are currently available for online booking. Please contact the hospital.",
          );
        }
      })
      .catch(() => {
        if (!active) return;
        setDoctorError("Unable to load doctors. Please try again.");
      })
      .finally(() => {
        if (active) setDoctorsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [preselectedDoctorSlug]);

  useEffect(() => {
    if (!selectedDoctor) return;

    let active = true;
    setDatesLoading(true);
    setAvailableDates([]);
    setSelectedDate("");
    setSlots([]);
    setSelectedSlot(null);

    getDoctorAvailableDates(selectedDoctor.id)
      .then((data) => {
        if (!active) return;
        setAvailableDates(data?.availableDates ?? []);
      })
      .finally(() => {
        if (active) setDatesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedDoctor]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;

    let active = true;
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot(null);

    getDoctorAvailableSlots(selectedDoctor.id, selectedDate)
      .then((data) => {
        if (!active) return;
        setSlots(data?.slots ?? []);
      })
      .finally(() => {
        if (active) setSlotsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedDoctor, selectedDate]);

  const canGoNext = useMemo(() => {
    if (step === 1) return Boolean(selectedDoctor);
    if (step === 2) return true; // service optional
    if (step === 3) return Boolean(selectedDate && selectedSlot);
    if (step === 4) {
      return (
        patientName.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail.trim()) &&
        /^\+?[\d\s()-]{7,20}$/.test(patientPhone.trim())
      );
    }
    return true;
  }, [
    step,
    selectedDoctor,
    selectedDate,
    selectedSlot,
    patientName,
    patientEmail,
    patientPhone,
  ]);

  const goNext = () => {
    setFormError("");
    setSubmitError("");

    if (step === 4 && !canGoNext) {
      setFormError("Please complete all required patient fields correctly.");
      return;
    }

    if (step < 5) setStep((s) => (s + 1) as Step);
  };

  const goBack = () => {
    setFormError("");
    setSubmitError("");
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) return;

    setSubmitting(true);
    setSubmitError("");

    const result = await bookAppointment({
      doctorId: selectedDoctor.id,
      serviceId: selectedService?.id ?? null,
      appointmentDate: selectedDate,
      startTime: selectedSlot.startTime,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      reason: reason.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setSubmitting(false);

    if (!result.ok || !result.data) {
      setSubmitError(
        result.message ||
          "Unable to complete booking. The slot may no longer be available.",
      );
      return;
    }

    setConfirmation(result.data);
  };

  const resetBooking = () => {
    setConfirmation(null);
    setStep(1);
    setSelectedDoctor(null);
    setSelectedService(null);
    setSelectedDate("");
    setSelectedSlot(null);
    setPatientName("");
    setPatientEmail("");
    setPatientPhone("");
    setReason("");
    setNotes("");
    setSubmitError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      <Navbar
        siteSettings={siteSettings}
        columns={navbarColumns}
        isLoading={shellLoading}
      />

      <main className="mx-auto max-w-5xl px-5 pb-16 pt-28 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#147BD5]">
            Aura Hospital
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Book an Appointment
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Choose your doctor, pick an available time, and confirm your visit
            in a few simple steps.
          </p>
        </div>

        {confirmation ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
          >
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Appointment requested
                </h2>
                <p className="mt-1 text-slate-600">
                  Your booking has been received. Please save your reference
                  number.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl bg-slate-50 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Reference
                </p>
                <p className="mt-1 text-xl font-bold text-[#147BD5]">
                  {confirmation.reference}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </p>
                <p className="mt-1 font-semibold text-amber-600">
                  {confirmation.status}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Doctor
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {confirmation.doctor.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Date & time
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDisplayDate(confirmation.appointmentDate)} ·{" "}
                  {formatTimeLabel(confirmation.startTime)}
                </p>
              </div>
              {confirmation.service ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Service
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {confirmation.service.title}
                  </p>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Patient
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {confirmation.patientName}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={resetBooking}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#147BD5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a6cc2]"
              >
                Book another
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
              >
                Back to home
              </Link>
            </div>
          </motion.section>
        ) : (
          <>
            <nav aria-label="Booking progress" className="mb-8">
              <ol className="flex flex-wrap gap-2">
                {steps.map((item) => {
                  const active = step === item.id;
                  const done = step > item.id;
                  return (
                    <li key={item.id}>
                      <div
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                          active
                            ? "bg-[#147BD5] text-white"
                            : done
                              ? "bg-sky-100 text-[#0a6cc2]"
                              : "bg-white text-slate-400 border border-slate-200",
                        ].join(" ")}
                      >
                        <span>{item.id}</span>
                        <span>{item.label}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8"
                >
                  {step === 1 && (
                    <section>
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-[#147BD5]">
                          <Stethoscope className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            Select a doctor
                          </h2>
                          <p className="text-sm text-slate-500">
                            Choose the specialist you would like to see.
                          </p>
                        </div>
                      </div>

                      {doctorsLoading ? (
                        <div className="flex items-center gap-2 py-12 text-slate-500">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Loading doctors…
                        </div>
                      ) : doctorError ? (
                        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                          {doctorError}
                        </p>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {doctors.map((doctor) => {
                            const selected = selectedDoctor?.id === doctor.id;
                            return (
                              <button
                                key={doctor.id}
                                type="button"
                                onClick={() => setSelectedDoctor(doctor)}
                                className={[
                                  "flex items-start gap-4 cursor-pointer rounded-2xl border p-4 text-left transition",
                                  selected
                                    ? "border-[#147BD5] bg-sky-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50",
                                ].join(" ")}
                              >
                                <img
                                  src={
                                    getImageUrl(doctor.image) ||
                                    "/images/doctors/ahmad-kha.jpg"
                                  }
                                  alt=""
                                  className="h-16 w-16 rounded-2xl object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-slate-900">
                                    {doctor.name}
                                  </p>
                                  <p className="text-sm text-[#147BD5]">
                                    {doctor.specialty}
                                  </p>
                                  {doctor.credentials ? (
                                    <p className="mt-1 truncate text-xs text-slate-500">
                                      {doctor.credentials}
                                    </p>
                                  ) : null}
                                </div>
                                {selected ? (
                                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#147BD5]" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  )}

                  {step === 2 && (
                    <section>
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-[#147BD5]">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            Select a service
                          </h2>
                          <p className="text-sm text-slate-500">
                            Optional — pick a service type for this visit.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setSelectedService(null)}
                          className={[
                            "cursor-pointer rounded-2xl border px-4 py-4 text-left transition",
                            !selectedService
                              ? "border-[#147BD5] bg-sky-50"
                              : "border-slate-200 hover:border-sky-200",
                          ].join(" ")}
                        >
                          <p className="font-semibold text-slate-900">
                            General consultation
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            No specific service selected
                          </p>
                        </button>
                        {services.map((service) => {
                          const selected = selectedService?.id === service.id;
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => setSelectedService(service)}
                              className={[
                                "rounded-2xl cursor-pointer border px-4 py-4 text-left transition",
                                selected
                                  ? "border-[#147BD5] bg-sky-50"
                                  : "border-slate-200 hover:border-sky-200",
                              ].join(" ")}
                            >
                              <p className="font-semibold text-slate-900">
                                {service.title}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {step === 3 && (
                    <section>
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-[#147BD5]">
                          <Clock3 className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            Choose date & time
                          </h2>
                          <p className="text-sm text-slate-500">
                            Only available slots for{" "}
                            {selectedDoctor?.name || "this doctor"} are shown.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-8 lg:grid-cols-2">
                        <div>
                          <h3 className="mb-3 text-sm font-semibold text-slate-700">
                            Available dates
                          </h3>
                          {datesLoading ? (
                            <div className="flex items-center gap-2 py-6 text-slate-500">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Checking availability…
                            </div>
                          ) : availableDates.length === 0 ? (
                            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                              No available dates in the next 28 days for this
                              doctor.
                            </p>
                          ) : (
                            <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                              {availableDates.map((date) => (
                                <button
                                  key={date}
                                  type="button"
                                  onClick={() => setSelectedDate(date)}
                                  className={[
                                    "rounded-xl cursor-pointer border px-3 py-3 text-left text-sm transition",
                                    selectedDate === date
                                      ? "border-[#147BD5] bg-sky-50 text-[#0a6cc2]"
                                      : "border-slate-200 hover:border-sky-200",
                                  ].join(" ")}
                                >
                                  {formatDisplayDate(date)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="mb-3 text-sm font-semibold text-slate-700">
                            Available times
                          </h3>
                          {!selectedDate ? (
                            <p className="text-sm text-slate-500">
                              Select a date to see open time slots.
                            </p>
                          ) : slotsLoading ? (
                            <div className="flex items-center gap-2 py-6 text-slate-500">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading slots…
                            </div>
                          ) : slots.length === 0 ? (
                            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                              No open slots on this date.
                            </p>
                          ) : (
                            <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                              {slots.map((slot) => {
                                const selected =
                                  selectedSlot?.startTime === slot.startTime;
                                return (
                                  <button
                                    key={slot.startTime}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={[
                                      "rounded-xl cursor-pointer border px-3 py-3 text-sm font-semibold transition",
                                      selected
                                        ? "border-[#147BD5] bg-[#147BD5] text-white"
                                        : "border-slate-200 text-slate-700 hover:border-sky-200",
                                    ].join(" ")}
                                  >
                                    {formatTimeLabel(slot.startTime)}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {step === 4 && (
                    <section>
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-[#147BD5]">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            Patient information
                          </h2>
                          <p className="text-sm text-slate-500">
                            Tell us how to reach you about this appointment.
                          </p>
                        </div>
                      </div>

                      {formError ? (
                        <p
                          role="alert"
                          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                          {formError}
                        </p>
                      ) : null}

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="patientName"
                            className="mb-1 block text-sm font-medium text-slate-700"
                          >
                            Full name *
                          </label>
                          <input
                            id="patientName"
                            type="text"
                            autoComplete="name"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-[#147BD5] focus:outline-none focus:ring-2 focus:ring-[#147BD5]/20"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="patientEmail"
                            className="mb-1 block text-sm font-medium text-slate-700"
                          >
                            Email *
                          </label>
                          <input
                            id="patientEmail"
                            type="email"
                            autoComplete="email"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-[#147BD5] focus:outline-none focus:ring-2 focus:ring-[#147BD5]/20"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="patientPhone"
                            className="mb-1 block text-sm font-medium text-slate-700"
                          >
                            Phone *
                          </label>
                          <input
                            id="patientPhone"
                            type="tel"
                            autoComplete="tel"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-[#147BD5] focus:outline-none focus:ring-2 focus:ring-[#147BD5]/20"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="reason"
                            className="mb-1 block text-sm font-medium text-slate-700"
                          >
                            Reason for visit
                          </label>
                          <input
                            id="reason"
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-[#147BD5] focus:outline-none focus:ring-2 focus:ring-[#147BD5]/20"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="notes"
                            className="mb-1 block text-sm font-medium text-slate-700"
                          >
                            Additional notes
                          </label>
                          <textarea
                            id="notes"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:border-[#147BD5] focus:outline-none focus:ring-2 focus:ring-[#147BD5]/20"
                          />
                        </div>
                      </div>
                    </section>
                  )}

                  {step === 5 && (
                    <section>
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900">
                          Review & confirm
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Double-check your appointment details before
                          submitting.
                        </p>
                      </div>

                      {submitError ? (
                        <p
                          role="alert"
                          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                          {submitError}
                        </p>
                      ) : null}

                      <dl className="grid gap-4 rounded-2xl bg-slate-50 p-6 sm:grid-cols-2">
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Doctor
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-900">
                            {selectedDoctor?.name}
                          </dd>
                          <dd className="text-sm text-slate-500">
                            {selectedDoctor?.specialty}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Service
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-900">
                            {selectedService?.title || "General consultation"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Date
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-900">
                            {selectedDate
                              ? formatDisplayDate(selectedDate)
                              : "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Time
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-900">
                            {selectedSlot
                              ? `${formatTimeLabel(selectedSlot.startTime)} – ${formatTimeLabel(selectedSlot.endTime)}`
                              : "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Patient
                          </dt>
                          <dd className="mt-1 font-semibold text-slate-900">
                            {patientName}
                          </dd>
                          <dd className="text-sm text-slate-500">
                            {patientEmail} · {patientPhone}
                          </dd>
                        </div>
                        {reason ? (
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Reason
                            </dt>
                            <dd className="mt-1 text-slate-800">{reason}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </section>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1 || submitting}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canGoNext}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#147BD5] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a6cc2] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void handleSubmit()}
                    disabled={submitting}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#147BD5] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a6cc2] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Booking…
                      </>
                    ) : (
                      <>
                        Confirm booking
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer footer={footer} siteSettings={siteSettings} isLoading={shellLoading} />
    </div>
  );
}

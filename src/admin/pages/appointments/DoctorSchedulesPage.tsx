import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminButton } from "../../components/AdminButton";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";
import { useToast } from "../../components/Toast";
import adminApi from "../../services/adminApi";

const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

interface DoctorOption {
  id: string;
  name: string;
  specialty: string;
}

interface ScheduleBreak {
  startTime: string;
  endTime: string;
}

interface ScheduleRow {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isActive: boolean;
  breaks: ScheduleBreak[];
}

interface UnavailabilityRow {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
}

const emptySchedule = (day: string): ScheduleRow => ({
  dayOfWeek: day,
  startTime: "09:00",
  endTime: "17:00",
  slotDurationMinutes: 30,
  isActive: true,
  breaks: [{ startTime: "13:00", endTime: "14:00" }],
});

const DoctorSchedulesPage = () => {
  const { pushToast } = useToast();
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [unavailabilities, setUnavailabilities] = useState<
    UnavailabilityRow[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await adminApi.get<DoctorOption[]>("/admin/doctors");
        setDoctors(data ?? []);
        if (data?.[0]) setDoctorId(data[0].id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load doctors.",
        );
      } finally {
        setLoading(false);
      }
    };
    void loadDoctors();
  }, []);

  useEffect(() => {
    if (!doctorId) return;

    const loadSchedule = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminApi.get<{
          schedules: ScheduleRow[];
          unavailabilities: UnavailabilityRow[];
        }>(`/admin/doctor-schedules/${doctorId}`);

        setSchedules(
          (data.schedules ?? []).map((s) => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            slotDurationMinutes: s.slotDurationMinutes,
            isActive: s.isActive,
            breaks: s.breaks?.length
              ? s.breaks.map((b) => ({
                  startTime: b.startTime,
                  endTime: b.endTime,
                }))
              : [],
          })),
        );
        setUnavailabilities(data.unavailabilities ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load schedule.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadSchedule();
  }, [doctorId]);

  const addDay = (day: string) => {
    if (schedules.some((s) => s.dayOfWeek === day)) return;
    setSchedules((prev) => [...prev, emptySchedule(day)]);
  };

  const updateSchedule = (
    index: number,
    patch: Partial<ScheduleRow>,
  ) => {
    setSchedules((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const removeSchedule = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const saveSchedules = async () => {
    if (!doctorId) return;
    setSaving(true);
    try {
      await adminApi.put(`/admin/doctor-schedules/${doctorId}`, {
        schedules,
      });
      pushToast({ type: "success", title: "Schedule saved." });
    } catch (err) {
      pushToast({
        type: "error",
        title: err instanceof Error ? err.message : "Failed to save schedule.",
      });
    } finally {
      setSaving(false);
    }
  };

  const addLeave = async () => {
    if (!doctorId || !leaveDate) return;
    try {
      await adminApi.post(`/admin/doctor-schedules/${doctorId}/unavailability`, {
        date: leaveDate,
        reason: leaveReason || null,
      });
      setLeaveDate("");
      setLeaveReason("");
      pushToast({ type: "success", title: "Unavailable date added." });
      const data = await adminApi.get<{
        unavailabilities: UnavailabilityRow[];
      }>(`/admin/doctor-schedules/${doctorId}`);
      setUnavailabilities(data.unavailabilities ?? []);
    } catch (err) {
      pushToast({
        type: "error",
        title:
          err instanceof Error ? err.message : "Failed to add unavailability.",
      });
    }
  };

  const removeLeave = async (id: string) => {
    if (!doctorId) return;
    try {
      await adminApi.delete(
        `/admin/doctor-schedules/${doctorId}/unavailability/${id}`,
      );
      setUnavailabilities((prev) => prev.filter((u) => u.id !== id));
      pushToast({ type: "success", title: "Unavailability removed." });
    } catch (err) {
      pushToast({
        type: "error",
        title:
          err instanceof Error
            ? err.message
            : "Failed to remove unavailability.",
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Doctor Schedules"
        description="Manage weekly working hours, breaks, and unavailable dates."
        backLink="/admin/appointments"
      />

      <div className="mb-5 max-w-md">
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Doctor
          </span>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
          >
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} — {doctor.specialty}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <LoadingState label="Loading schedule…" />
      ) : error ? (
        <ErrorState title="Unable to load schedule" message={error} />
      ) : !doctorId ? (
        <EmptyState
          title="No doctors"
          description="Add doctors before configuring schedules."
        />
      ) : (
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Weekly hours
              </h2>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => addDay(day)}
                    disabled={schedules.some((s) => s.dayOfWeek === day)}
                    className="rounded-lg cursor-pointer border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                  >
                    + {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {schedules.length === 0 ? (
              <p className="text-sm text-slate-500">
                No working days configured. Add days above.
              </p>
            ) : (
              <div className="space-y-4">
                {schedules.map((row, index) => (
                  <div
                    key={`${row.dayOfWeek}-${index}`}
                    className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-6"
                  >
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">
                        Day
                      </label>
                      <select
                        value={row.dayOfWeek}
                        onChange={(e) =>
                          updateSchedule(index, { dayOfWeek: e.target.value })
                        }
                        className="w-full cursor-pointer rounded-lg border border-slate-200 px-2 py-2 text-sm"
                      >
                        {WEEK_DAYS.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">
                        Start
                      </label>
                      <input
                        type="time"
                        value={row.startTime}
                        onChange={(e) =>
                          updateSchedule(index, { startTime: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">
                        End
                      </label>
                      <input
                        type="time"
                        value={row.endTime}
                        onChange={(e) =>
                          updateSchedule(index, { endTime: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">
                        Slot (min)
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={240}
                        value={row.slotDurationMinutes}
                        onChange={(e) =>
                          updateSchedule(index, {
                            slotDurationMinutes: Number(e.target.value) || 30,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-500">
                        Break
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="time"
                          value={row.breaks[0]?.startTime || ""}
                          onChange={(e) =>
                            updateSchedule(index, {
                              breaks: [
                                {
                                  startTime: e.target.value,
                                  endTime: row.breaks[0]?.endTime || "14:00",
                                },
                              ],
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 px-1 py-2 text-sm"
                        />
                        <input
                          type="time"
                          value={row.breaks[0]?.endTime || ""}
                          onChange={(e) =>
                            updateSchedule(index, {
                              breaks: [
                                {
                                  startTime: row.breaks[0]?.startTime || "13:00",
                                  endTime: e.target.value,
                                },
                              ],
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 px-1 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        onClick={() => removeSchedule(index)}
                        className="inline-flex cursor-pointer h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-red-600"
                        aria-label="Remove day"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <AdminButton disabled={saving} onClick={() => void saveSchedules()}>
                Save schedule
              </AdminButton>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Unavailable dates
            </h2>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500">
                  Date
                </span>
                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block min-w-0 flex-1 text-sm">
                <span className="mb-1 block text-xs font-semibold text-slate-500">
                  Reason
                </span>
                <input
                  type="text"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Leave, holiday…"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </label>
              <AdminButton onClick={() => void addLeave()}>
                <Plus className="h-4 w-4" />
                Add
              </AdminButton>
            </div>

            {unavailabilities.length === 0 ? (
              <p className="text-sm text-slate-500">No unavailable dates.</p>
            ) : (
              <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                {unavailabilities.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.date}</p>
                      <p className="text-slate-500">
                        {item.reason || "Unavailable"}
                        {item.startTime && item.endTime
                          ? ` · ${item.startTime}–${item.endTime}`
                          : " · Full day"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void removeLeave(item.id)}
                      className="rounded-lg cursor-pointer border border-slate-200 p-2 text-slate-500 hover:text-red-600"
                      aria-label="Remove unavailability"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedulesPage;

import { CalendarClock, Check, Eye, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminButton } from "../../components/AdminButton";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { Modal } from "../../components/Modal";
import { PageHeader } from "../../components/PageHeader";
import { SearchInput } from "../../components/SearchInput";
import { useToast } from "../../components/Toast";
import adminApi from "../../services/adminApi";
import { formatDate } from "../../utils/adminHelpers";

type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

interface AppointmentItem {
  id: string;
  reference: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reason?: string | null;
  notes?: string | null;
  adminNotes?: string | null;
  doctor: {
    id: string;
    name: string;
    specialty: string;
  };
  service?: { id: string; title: string } | null;
  createdAt?: string;
}

interface DoctorOption {
  id: string;
  name: string;
}

interface Stats {
  pending: number;
  confirmed: number;
  todayCount: number;
  cancelled: number;
  completed: number;
}

const statusColors: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-slate-200 text-slate-700",
  COMPLETED: "bg-sky-100 text-sky-800",
  NO_SHOW: "bg-rose-100 text-rose-800",
};

const AppointmentsPage = () => {
  const { pushToast } = useToast();
  const [items, setItems] = useState<AppointmentItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<AppointmentItem | null>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [saving, setSaving] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    if (doctorId) params.set("doctorId", doctorId);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    params.set("page", String(page));
    params.set("limit", "20");
    return params.toString();
  }, [search, status, doctorId, dateFrom, dateTo, page]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [listData, statsData, doctorData] = await Promise.all([
        adminApi.get<{
          items: AppointmentItem[];
          pagination: { totalPages: number };
        }>(`/admin/appointments?${queryString}`),
        adminApi.get<Stats>("/admin/appointments/stats"),
        adminApi.get<DoctorOption[]>("/admin/doctors"),
      ]);

      setItems(listData.items ?? []);
      setTotalPages(listData.pagination?.totalPages ?? 1);
      setStats(statsData);
      setDoctors(
        (doctorData ?? []).map((d) => ({ id: d.id, name: d.name })),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load appointments.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const updateStatus = async (
    id: string,
    nextStatus: AppointmentStatus,
    cancellationReason?: string,
  ) => {
    setSaving(true);
    try {
      await adminApi.patch(`/admin/appointments/${id}/status`, {
        status: nextStatus,
        cancellationReason,
      });
      pushToast({
        type: "success",
        title: `Appointment marked as ${nextStatus.replace("_", " ").toLowerCase()}.`,
      });
      setSelected(null);
      await load();
    } catch (err) {
      pushToast({
        type: "error",
        title:
          err instanceof Error ? err.message : "Failed to update status.",
      });
    } finally {
      setSaving(false);
    }
  };

  const submitReschedule = async () => {
    if (!selected || !rescheduleDate || !rescheduleTime) return;
    setSaving(true);
    try {
      await adminApi.patch(`/admin/appointments/${selected.id}/reschedule`, {
        appointmentDate: rescheduleDate,
        startTime: rescheduleTime,
      });
      pushToast({ type: "success", title: "Appointment rescheduled." });
      setRescheduleOpen(false);
      setSelected(null);
      await load();
    } catch (err) {
      pushToast({
        type: "error",
        title:
          err instanceof Error ? err.message : "Failed to reschedule.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Review, confirm, and manage patient appointment bookings."
        action={
          <Link to="/admin/doctor-schedules">
            <AdminButton variant="secondary">
              <CalendarClock className="h-4 w-4" />
              Doctor schedules
            </AdminButton>
          </Link>
        }
      />

      {stats ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Pending", value: stats.pending },
            { label: "Confirmed", value: stats.confirmed },
            { label: "Today", value: stats.todayCount },
            { label: "Completed", value: stats.completed },
            { label: "Cancelled", value: stats.cancelled },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mb-5 flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end">
        <SearchInput
          value={search}
          onChange={(value) => {
            setPage(1);
            setSearch(value);
          }}
          placeholder="Search reference, name, email, phone…"
        />

        <label className="block text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Status
          </span>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="rounded-xl border cursor-pointer border-slate-200 px-3 py-2.5 text-sm"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
            <option value="NO_SHOW">No show</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Doctor
          </span>
          <select
            value={doctorId}
            onChange={(e) => {
              setPage(1);
              setDoctorId(e.target.value);
            }}
            className="min-w-[180px] cursor-pointer rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          >
            <option value="">All doctors</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            From
          </span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setPage(1);
              setDateFrom(e.target.value);
            }}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            To
          </span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setPage(1);
              setDateTo(e.target.value);
            }}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          />
        </label>
      </div>

      {loading ? (
        <LoadingState label="Loading appointments…" />
      ) : error ? (
        <ErrorState title="Unable to load appointments" message={error} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="Try adjusting your filters or wait for new patient bookings."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Reference</th>
                  <th className="px-4 py-3 font-semibold">Patient</th>
                  <th className="px-4 py-3 font-semibold">Doctor</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-[#147BD5]">
                      {item.reference}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {item.patientName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.patientPhone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {item.doctor.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.doctor.specialty}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(item.appointmentDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.startTime}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[item.status]}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelected(item)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <AdminButton
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </AdminButton>
              <AdminButton
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        title={selected ? `Appointment ${selected.reference}` : "Appointment"}
        onClose={() => setSelected(null)}
        size="lg"
      >
        {selected ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Patient
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selected.patientName}
                </p>
                <p className="text-sm text-slate-600">{selected.patientEmail}</p>
                <p className="text-sm text-slate-600">{selected.patientPhone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Doctor / Service
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selected.doctor.name}
                </p>
                <p className="text-sm text-slate-600">
                  {selected.service?.title || "General consultation"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Schedule
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(selected.appointmentDate)} · {selected.startTime}
                  –{selected.endTime}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[selected.status]}`}
                >
                  {selected.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {selected.reason ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Reason
                </p>
                <p className="mt-1 text-sm text-slate-700">{selected.reason}</p>
              </div>
            ) : null}

            {selected.notes ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Notes
                </p>
                <p className="mt-1 text-sm text-slate-700">{selected.notes}</p>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              {selected.status === "PENDING" ? (
                <AdminButton
                  disabled={saving}
                  onClick={() => void updateStatus(selected.id, "CONFIRMED")}
                >
                  <Check className="h-4 w-4" />
                  Confirm
                </AdminButton>
              ) : null}

              {selected.status === "PENDING" ||
              selected.status === "CONFIRMED" ? (
                <>
                  <AdminButton
                    variant="secondary"
                    disabled={saving}
                    onClick={() => {
                      setRescheduleDate(selected.appointmentDate);
                      setRescheduleTime(selected.startTime);
                      setRescheduleOpen(true);
                    }}
                  >
                    Reschedule
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    disabled={saving}
                    onClick={() =>
                      void updateStatus(selected.id, "COMPLETED")
                    }
                  >
                    Mark completed
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    disabled={saving}
                    onClick={() => void updateStatus(selected.id, "NO_SHOW")}
                  >
                    No show
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    disabled={saving}
                    onClick={() =>
                      void updateStatus(
                        selected.id,
                        "CANCELLED",
                        "Cancelled by admin",
                      )
                    }
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </AdminButton>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={rescheduleOpen}
        title="Reschedule appointment"
        onClose={() => setRescheduleOpen(false)}
        size="sm"
      >
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              New date
            </span>
            <input
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              New start time (HH:mm)
            </span>
            <input
              type="time"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </label>
          <div className="flex justify-end gap-2">
            <AdminButton
              variant="secondary"
              onClick={() => setRescheduleOpen(false)}
            >
              Close
            </AdminButton>
            <AdminButton disabled={saving} onClick={() => void submitReschedule()}>
              Save
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;

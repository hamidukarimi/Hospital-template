import { PencilLine, Plus, Trash2 } from "lucide-react";
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

interface NavbarColumnItem {
  id: string;
  label: string;
  url: string;
  sortOrder?: number;
  isActive?: boolean;
}

const emptyForm = {
  label: "",
  url: "",
  sortOrder: 0,
  isActive: true,
};

const NavbarColumnsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<NavbarColumnItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/navbar-columns\/.+\/edit$/.test(location.pathname);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.get<NavbarColumnItem[]>(
          "/admin/navbar-columns",
        );
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load navbar columns.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) void load();
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/navbar-columns\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<NavbarColumnItem>(
          `/admin/navbar-columns/${id}`,
        );
        setEditingId(id);
        setForm({
          label: item.label ?? "",
          url: item.url ?? "",
          sortOrder: item.sortOrder ?? 0,
          isActive: item.isActive ?? true,
        });
      } catch {
        setError("Unable to load navbar column.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) =>
      [item.label, item.url].some((field) =>
        (field ?? "").toLowerCase().includes(value),
      ),
    );
  }, [items, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        label: form.label.trim(),
        url: form.url.trim(),
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      };

      if (!payload.label || !payload.url) {
        pushToast({
          type: "error",
          title: "Required details missing",
          description: "Label and URL are required for the navbar column.",
        });
        return;
      }

      if (editingId) {
        await adminApi.patch(`/admin/navbar-columns/${editingId}`, payload);
        pushToast({ type: "success", title: "Navbar column updated." });
      } else {
        await adminApi.post("/admin/navbar-columns", payload);
        pushToast({ type: "success", title: "Navbar column created." });
      }

      navigate("/admin/navbar-columns");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save navbar column",
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
      await adminApi.delete(`/admin/navbar-columns/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({ type: "success", title: "Navbar column deleted." });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete navbar column",
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
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title={editingId ? "Edit navbar column" : "Create navbar column"}
          description={
            editingId
              ? "Update the column label and page URL."
              : "Add a navbar grouping section for a page."
          }
          backLink="/admin/navbar-columns"
        />

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Label</span>
              <input
                value={form.label}
                onChange={(event) =>
                  setForm({ ...form, label: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">URL</span>
              <input
                value={form.url}
                onChange={(event) =>
                  setForm({ ...form, url: event.target.value })
                }
                placeholder="/about"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Sort order
              </span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm({ ...form, sortOrder: Number(event.target.value) })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <span>Active</span>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm({ ...form, isActive: event.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Link
              to="/admin/navbar-columns"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              Cancel
            </Link>
            <AdminButton type="submit" variant="secondary" disabled={saving}>
              {saving
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                  ? "Update column"
                  : "Create column"}
            </AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Navbar Columns"
        description="Organize the main navbar menu sections."
        action={
          <Link to="/admin/navbar-columns/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add column
            </AdminButton>
          </Link>
        }
      />

      {error && (
        <ErrorState title="Unable to load navbar columns" message={error} />
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search navbar columns..."
        />
      </div>

      {loading ? (
        <LoadingState label="Loading navbar columns..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No navbar columns found"
          description="Add a navbar section to group important links."
          actionLabel="Create column"
          actionHref="/admin/navbar-columns/new"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Label</th>
                  <th className="px-4 py-3 font-semibold">URL</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((column) => (
                  <tr
                    key={column.id}
                    className="border-t border-slate-200 align-top"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {column.label}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{column.url}</td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        value={column.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/navbar-columns/${column.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(column.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
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
        title="Delete navbar column?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default NavbarColumnsPage;

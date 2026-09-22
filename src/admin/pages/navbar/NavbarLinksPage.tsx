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
import {
  adminFormActionsClass,
  adminFormClass,
  adminFormGridClass,
  adminFormPageWrap,
} from "../../utils/adminHelpers";

interface NavbarColumnOption {
  id: string;
  label: string;
  isActive?: boolean;
}

interface NavbarLinkItem {
  id: string;
  label: string;
  url: string;
  sortOrder?: number;
  isActive?: boolean;
  navigationItemId?: string;
}

const emptyForm = {
  label: "",
  url: "",
  sortOrder: 0,
  isActive: true,
  navigationItemId: "",
};

const NavbarLinksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [items, setItems] = useState<NavbarLinkItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [navbarColumns, setNavbarColumns] = useState<NavbarColumnOption[]>([]);
  const [columnsLoading, setColumnsLoading] = useState(false);

  const isFormView =
    location.pathname.endsWith("/new") ||
    /\/navbar-links\/.+\/edit$/.test(location.pathname);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.get<NavbarLinkItem[]>(
          "/admin/navbar-links",
        );
        setItems(data ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load navbar links.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isFormView) void load();
  }, [isFormView]);

  useEffect(() => {
    const match = location.pathname.match(/\/navbar-links\/(.+)\/edit$/);
    const id = match?.[1];

    if (!id) {
      setForm(emptyForm);
      setEditingId(null);
      return;
    }

    const loadItem = async () => {
      try {
        const item = await adminApi.get<NavbarLinkItem>(
          `/admin/navbar-links/${id}`,
        );
        setEditingId(id);
        setForm({
          label: item.label ?? "",
          url: item.url ?? "",
          sortOrder: item.sortOrder ?? 0,
          isActive: item.isActive ?? true,
          navigationItemId: item.navigationItemId ?? "",
        });
      } catch {
        setError("Unable to load navbar link.");
      }
    };

    void loadItem();
  }, [location.pathname]);

  useEffect(() => {
    if (!isFormView) return;

    const loadColumns = async () => {
      setColumnsLoading(true);
      try {
        const data = await adminApi.get<NavbarColumnOption[]>(
          "/admin/navbar-columns",
        );
        setNavbarColumns(data ?? []);
      } catch {
        pushToast({
          type: "error",
          title: "Unable to load navbar columns",
          description: "Refresh the page and try again.",
        });
      } finally {
        setColumnsLoading(false);
      }
    };

    void loadColumns();
  }, [isFormView, pushToast]);

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
        navigationItemId: form.navigationItemId.trim(),
      };

      if (!payload.label || !payload.url) {
        pushToast({
          type: "error",
          title: "Required details missing",
          description: "Label and URL are required.",
        });
        return;
      }

      if (!payload.navigationItemId) {
        pushToast({
          type: "error",
          title: "Navbar column required",
          description: "Select the navbar column this link belongs to.",
        });
        return;
      }

      if (editingId) {
        await adminApi.patch(`/admin/navbar-links/${editingId}`, payload);
        pushToast({ type: "success", title: "Navbar link updated." });
      } else {
        await adminApi.post("/admin/navbar-links", payload);
        pushToast({ type: "success", title: "Navbar link created." });
      }

      navigate("/admin/navbar-links");
    } catch (submitError) {
      pushToast({
        type: "error",
        title: "Unable to save navbar link",
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
      await adminApi.delete(`/admin/navbar-links/${deleteTargetId}`);
      setItems((current) =>
        current.filter((item) => item.id !== deleteTargetId),
      );
      pushToast({ type: "success", title: "Navbar link deleted." });
    } catch (deleteError) {
      pushToast({
        type: "error",
        title: "Unable to delete navbar link",
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
      <div className={adminFormPageWrap.sm}>
        <PageHeader
          title={editingId ? "Edit navbar link" : "Create navbar link"}
          description={
            editingId
              ? "Update the navbar link."
              : "Add a link under a navbar column."
          }
          backLink="/admin/navbar-links"
        />

        <form onSubmit={handleSubmit} className={adminFormClass}>
          <div className={adminFormGridClass}>
            <label className="min-w-0 space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Navbar column
              </span>
              <select
                value={form.navigationItemId}
                onChange={(event) =>
                  setForm({ ...form, navigationItemId: event.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
                disabled={columnsLoading}
              >
                <option value="">
                  {columnsLoading
                    ? "Loading columns..."
                    : "Select a navbar column"}
                </option>
                {navbarColumns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.label}
                    {column.isActive === false ? " (inactive)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="min-w-0 space-y-2">
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

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">URL</span>
              <input
                value={form.url}
                onChange={(event) =>
                  setForm({ ...form, url: event.target.value })
                }
                placeholder="/about#mission"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                required
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

          <div className={adminFormActionsClass}>
            <Link
              to="/admin/navbar-links"
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
                  ? "Update link"
                  : "Create link"}
            </AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Navbar Links"
        description="Add dropdown links under each navbar column."
        action={
          <Link to="/admin/navbar-links/new">
            <AdminButton variant="secondary">
              <Plus className="h-4 w-4" />
              Add link
            </AdminButton>
          </Link>
        }
      />

      {error && (
        <ErrorState title="Unable to load navbar links" message={error} />
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search navbar links..."
        />
      </div>

      {loading ? (
        <LoadingState label="Loading navbar links..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No navbar links found"
          description="Add useful links inside your navbar columns."
          actionLabel="Create link"
          actionHref="/admin/navbar-links/new"
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
                {filtered.map((link) => (
                  <tr
                    key={link.id}
                    className="border-t border-slate-200 align-top"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {link.label}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{link.url}</td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        value={link.isActive}
                        trueLabel="Active"
                        falseLabel="Inactive"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/navbar-links/${link.id}/edit`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(link.id)}
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
        title="Delete navbar link?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default NavbarLinksPage;

"use client";

import { useEffect, useMemo, useState } from "react";
import ContactList from "@/components/ContactList";
import ContactDetail from "@/components/ContactDetail";
import ContactForm from "@/components/ContactForm";
import {
  PlusIcon,
  SearchIcon,
  SpinnerIcon,
  UsersIcon,
  CloseIcon,
} from "@/components/icons";
import {
  backendLabel,
  createContact,
  deleteContact,
  listContacts,
  updateContact,
} from "@/lib/contacts";
import {
  emptyDraft,
  fullName,
  type Contact,
  type ContactDraft,
} from "@/lib/types";

type Mode = "view" | "edit" | "create";
type ChannelFilter = "all" | "phone" | "mobile" | "email";

const filters: { key: ChannelFilter; label: string }[] = [
  { key: "all", label: "Alle" },
  { key: "phone", label: "Telefon" },
  { key: "mobile", label: "Handy" },
  { key: "email", label: "E-Mail" },
];

export default function Page() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ChannelFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listContacts()
      .then((data) => {
        setContacts(data);
        setSelectedId((prev) => prev ?? data[0]?.id ?? null);
      })
      .catch((e) => setError(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      if (filter !== "all" && !c.channels.some((ch) => ch.kind === filter)) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        fullName(c),
        c.company,
        c.position,
        c.department,
        c.city,
        ...c.channels.map((ch) => ch.value),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [contacts, query, filter]);

  const selected = useMemo(
    () => contacts.find((c) => c.id === selectedId) ?? null,
    [contacts, selectedId]
  );

  function openCreate() {
    setMode("create");
    setError(null);
  }

  function openEdit() {
    if (!selected) return;
    setMode("edit");
    setError(null);
  }

  async function handleCreate(draft: ContactDraft) {
    setSaving(true);
    setError(null);
    try {
      const created = await createContact(draft);
      setContacts((prev) => [...prev, created]);
      setSelectedId(created.id);
      setMode("view");
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(draft: ContactDraft) {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateContact(selected.id, draft);
      setContacts((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setMode("view");
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    if (
      !window.confirm(
        `Kontakt „${fullName(selected) || "Ohne Namen"}“ wirklich löschen?`
      )
    )
      return;
    const id = selected.id;
    try {
      await deleteContact(id);
      setContacts((prev) => {
        const next = prev.filter((c) => c.id !== id);
        setSelectedId(next[0]?.id ?? null);
        return next;
      });
      setMode("view");
    } catch (e: any) {
      setError(String(e?.message ?? e));
    }
  }

  return (
    <div className="mx-auto flex h-screen max-w-[1400px] flex-col px-4 py-4 sm:px-6 sm:py-6">
      {/* Topbar */}
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-float">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-ink">
              Contactio
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-ink-soft">
              Kontaktverwaltung
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-mint" />
                {backendLabel}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-float transition hover:bg-brand-700"
        >
          <PlusIcon className="h-4 w-4" /> Neuer Kontakt
        </button>
      </header>

      {error && (
        <div className="mb-3 flex items-center justify-between rounded-xl border border-accent-rose/30 bg-accent-rose/5 px-4 py-2.5 text-sm text-accent-rose">
          {error}
          <button onClick={() => setError(null)} aria-label="Schließen">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Two-column workspace */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Left: list */}
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-surface-border bg-white/70 shadow-card backdrop-blur">
          <div className="space-y-3 border-b border-surface-border p-3">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suche nach Name, Firma, Telefon …"
                className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-9 pr-9 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  aria-label="Suche leeren"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={[
                    "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                    filter === f.key
                      ? "bg-brand-600 text-white shadow-card"
                      : "bg-surface-subtle text-ink-soft hover:bg-surface-border/60",
                  ].join(" ")}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex h-full items-center justify-center text-ink-muted">
                <SpinnerIcon className="h-6 w-6" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-1 px-6 text-center">
                <p className="text-sm font-medium text-ink">Keine Treffer</p>
                <p className="text-xs text-ink-muted">
                  Andere Suche oder Filter probieren.
                </p>
              </div>
            ) : (
              <ContactList
                contacts={filtered}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setMode("view");
                }}
              />
            )}
          </div>

          <div className="border-t border-surface-border px-4 py-2.5 text-xs text-ink-muted">
            {filtered.length} von {contacts.length} Kontakten
          </div>
        </aside>

        {/* Right: detail / form */}
        <main className="min-h-0 overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
          {mode === "create" ? (
            <FormShell
              title="Neuen Kontakt anlegen"
              onClose={() => setMode("view")}
            >
              <ContactForm
                initial={emptyDraft()}
                submitLabel="Kontakt anlegen"
                saving={saving}
                onSubmit={handleCreate}
                onCancel={() => setMode("view")}
              />
            </FormShell>
          ) : mode === "edit" && selected ? (
            <FormShell
              title="Kontakt bearbeiten"
              onClose={() => setMode("view")}
            >
              <ContactForm
                initial={draftFromContact(selected)}
                submitLabel="Änderungen speichern"
                saving={saving}
                onSubmit={handleUpdate}
                onCancel={() => setMode("view")}
              />
            </FormShell>
          ) : selected ? (
            <ContactDetail
              contact={selected}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ) : (
            <EmptyState onCreate={openCreate} loading={loading} />
          )}
        </main>
      </div>
    </div>
  );
}

function FormShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-surface-border px-6 py-5 sm:px-8">
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
        <button
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition hover:bg-surface-subtle hover:text-ink"
          aria-label="Schließen"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">{children}</div>
    </div>
  );
}

function EmptyState({
  onCreate,
  loading,
}: {
  onCreate: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-500">
        <UsersIcon className="h-8 w-8" />
      </div>
      <div>
        <p className="text-base font-semibold text-ink">
          {loading ? "Lädt …" : "Kein Kontakt ausgewählt"}
        </p>
        <p className="mt-1 max-w-xs text-sm text-ink-soft">
          Wähle links einen Kontakt aus oder lege einen neuen an.
        </p>
      </div>
      {!loading && (
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-float transition hover:bg-brand-700"
        >
          <PlusIcon className="h-4 w-4" /> Neuer Kontakt
        </button>
      )}
    </div>
  );
}

function draftFromContact(c: Contact): ContactDraft {
  const { id, createdAt, updatedAt, ...rest } = c;
  return { ...rest, channels: rest.channels.map((ch) => ({ ...ch })) };
}

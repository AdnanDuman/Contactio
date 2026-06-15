"use client";

import { useState } from "react";
import {
  cryptoId,
  EMAIL_LABELS,
  PHONE_LABELS,
  SALUTATIONS,
  type ChannelKind,
  type ContactChannel,
  type ContactDraft,
} from "@/lib/types";
import {
  CheckIcon,
  CloseIcon,
  MailIcon,
  MobileIcon,
  PhoneIcon,
  TrashIcon,
} from "./icons";

const channelMeta: Record<
  ChannelKind,
  { label: string; icon: typeof PhoneIcon; placeholder: string; labels: readonly string[] }
> = {
  phone: { label: "Telefon", icon: PhoneIcon, placeholder: "+49 …", labels: PHONE_LABELS },
  mobile: { label: "Handy", icon: MobileIcon, placeholder: "+49 …", labels: PHONE_LABELS },
  email: { label: "E-Mail", icon: MailIcon, placeholder: "name@firma.de", labels: EMAIL_LABELS },
};

const inputCls =
  "w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100";
const labelCls = "mb-1 block text-xs font-medium text-ink-soft";

export default function ContactForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  saving,
}: {
  initial: ContactDraft;
  submitLabel: string;
  onSubmit: (draft: ContactDraft) => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  const [draft, setDraft] = useState<ContactDraft>(initial);

  function set<K extends keyof ContactDraft>(key: K, value: ContactDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function addChannel(kind: ChannelKind) {
    const defaultLabel = channelMeta[kind].labels[0];
    set("channels", [
      ...draft.channels,
      { id: cryptoId(), kind, label: defaultLabel, value: "" },
    ]);
  }

  function updateChannel(id: string, patch: Partial<ContactChannel>) {
    set(
      "channels",
      draft.channels.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  function removeChannel(id: string) {
    set("channels", draft.channels.filter((c) => c.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned: ContactDraft = {
      ...draft,
      channels: draft.channels.filter((c) => c.value.trim() !== ""),
    };
    onSubmit(cleaned);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Person */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink">Person</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label className={labelCls}>Anrede</label>
            <select
              className={inputCls}
              value={draft.salutation}
              onChange={(e) => set("salutation", e.target.value)}
            >
              {SALUTATIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Titel</label>
            <input
              className={inputCls}
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Dr., Prof. …"
            />
          </div>
          <div>
            <label className={labelCls}>Vorname</label>
            <input
              className={inputCls}
              value={draft.firstName}
              onChange={(e) => set("firstName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Nachname *</label>
            <input
              required
              className={inputCls}
              value={draft.lastName}
              onChange={(e) => set("lastName", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Organisation */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink">Organisation</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label className={labelCls}>Firma</label>
            <input
              className={inputCls}
              value={draft.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Funktion</label>
            <input
              className={inputCls}
              value={draft.position}
              onChange={(e) => set("position", e.target.value)}
              placeholder="z. B. CFO"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Abteilung</label>
            <input
              className={inputCls}
              value={draft.department}
              onChange={(e) => set("department", e.target.value)}
              placeholder="z. B. Finance"
            />
          </div>
        </div>
      </section>

      {/* Adresse */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink">Adresse</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label className={labelCls}>Straße &amp; Nr.</label>
            <input
              className={inputCls}
              value={draft.street}
              onChange={(e) => set("street", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>PLZ</label>
            <input
              className={inputCls}
              value={draft.postalCode}
              onChange={(e) => set("postalCode", e.target.value)}
            />
          </div>
          <div className="sm:col-span-4">
            <label className={labelCls}>Ort</label>
            <input
              className={inputCls}
              value={draft.city}
              onChange={(e) => set("city", e.target.value)}
            />
          </div>
          <div className="sm:col-span-6">
            <label className={labelCls}>Land</label>
            <input
              className={inputCls}
              value={draft.country}
              onChange={(e) => set("country", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Kontaktmöglichkeiten */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">Kontaktmöglichkeiten</h3>
          <div className="flex gap-1.5">
            {(["phone", "mobile", "email"] as ChannelKind[]).map((kind) => {
              const Icon = channelMeta[kind].icon;
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => addChannel(kind)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-2.5 py-1.5 text-xs font-medium text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {channelMeta[kind].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          {draft.channels.length === 0 && (
            <p className="rounded-lg border border-dashed border-surface-border px-3 py-4 text-center text-xs text-ink-muted">
              Noch keine Kontaktmöglichkeit. Oben hinzufügen.
            </p>
          )}
          {draft.channels.map((ch) => {
            const meta = channelMeta[ch.kind];
            const Icon = meta.icon;
            return (
              <div
                key={ch.id}
                className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-subtle/60 p-2"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white text-brand-600 shadow-card">
                  <Icon className="h-4 w-4" />
                </span>
                <select
                  className="w-28 shrink-0 rounded-md border border-surface-border bg-white px-2 py-1.5 text-xs text-ink-soft outline-none focus:border-brand-400"
                  value={ch.label}
                  onChange={(e) => updateChannel(ch.id, { label: e.target.value })}
                >
                  {meta.labels.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <input
                  className="flex-1 rounded-md border border-surface-border bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  type={ch.kind === "email" ? "email" : "tel"}
                  placeholder={meta.placeholder}
                  value={ch.value}
                  onChange={(e) => updateChannel(ch.id, { value: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeChannel(ch.id)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-muted transition hover:bg-accent-rose/10 hover:text-accent-rose"
                  aria-label="Entfernen"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Notizen */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-ink">Notizen / interne Bemerkungen</h3>
        <textarea
          className={inputCls + " min-h-[88px] resize-y"}
          value={draft.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Nur intern sichtbar …"
        />
      </section>

      {/* Aktionen */}
      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-2 border-t border-surface-border bg-white/90 px-6 py-3 backdrop-blur">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:bg-surface-subtle"
        >
          <CloseIcon className="h-4 w-4" /> Abbrechen
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700 disabled:opacity-60"
        >
          <CheckIcon className="h-4 w-4" /> {submitLabel}
        </button>
      </div>
    </form>
  );
}

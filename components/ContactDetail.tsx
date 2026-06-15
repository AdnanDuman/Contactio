"use client";

import { useMemo } from "react";
import {
  fullName,
  initials,
  type ChannelKind,
  type Contact,
} from "@/lib/types";
import {
  BuildingIcon,
  EditIcon,
  MailIcon,
  MapPinIcon,
  MobileIcon,
  PhoneIcon,
  TrashIcon,
  UsersIcon,
} from "./icons";

function channelHref(kind: ChannelKind, value: string) {
  if (kind === "email") return `mailto:${value}`;
  return `tel:${value.replace(/\s+/g, "")}`;
}

const kindIcon = { phone: PhoneIcon, mobile: MobileIcon, email: MailIcon };
const kindName = { phone: "Telefon", mobile: "Handy", email: "E-Mail" };

const avatarPalette = [
  "from-brand-500 to-brand-700",
  "from-accent-mint to-brand-600",
  "from-brand-400 to-accent-mint",
  "from-amber-400 to-brand-600",
];

export default function ContactDetail({
  contact,
  onEdit,
  onDelete,
}: {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const grouped = useMemo(() => {
    const order: ChannelKind[] = ["phone", "mobile", "email"];
    return order
      .map((kind) => ({
        kind,
        items: contact.channels.filter((c) => c.kind === kind),
      }))
      .filter((g) => g.items.length > 0);
  }, [contact.channels]);

  const palette =
    avatarPalette[
      Math.abs(
        contact.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
      ) % avatarPalette.length
    ];

  const hasAddress =
    contact.street || contact.postalCode || contact.city || contact.country;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-surface-border px-6 py-5 sm:px-8">
        <div className="flex items-center gap-4">
          <div
            className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${palette} text-xl font-semibold text-white shadow-float`}
          >
            {initials(contact)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {contact.salutation}
            </p>
            <h2 className="truncate text-2xl font-semibold text-ink">
              {fullName(contact) || "Ohne Namen"}
            </h2>
            <p className="mt-0.5 truncate text-sm text-ink-soft">
              {[contact.position, contact.company].filter(Boolean).join(" · ") ||
                "—"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-2 text-sm font-medium text-ink-soft shadow-card transition hover:border-brand-300 hover:text-brand-600"
          >
            <EditIcon className="h-4 w-4" /> Bearbeiten
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 py-2 text-sm font-medium text-ink-soft shadow-card transition hover:border-accent-rose/40 hover:text-accent-rose"
          >
            <TrashIcon className="h-4 w-4" /> Löschen
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Kontaktmöglichkeiten */}
          <div className="lg:col-span-2">
            <SectionTitle>Kontaktmöglichkeiten</SectionTitle>
            {grouped.length === 0 ? (
              <Empty>Keine Kontaktmöglichkeiten hinterlegt.</Empty>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {grouped.flatMap((g) =>
                  g.items.map((ch) => {
                    const Icon = kindIcon[ch.kind];
                    return (
                      <a
                        key={ch.id}
                        href={channelHref(ch.kind, ch.value)}
                        className="group flex items-center gap-3 rounded-xl border border-surface-border bg-white p-3 shadow-card transition hover:border-brand-300 hover:shadow-float"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-100">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                            {kindName[ch.kind]}
                            <span className="rounded-full bg-surface-subtle px-1.5 py-0.5 text-[10px] normal-case text-ink-soft">
                              {ch.label}
                            </span>
                          </p>
                          <p className="truncate text-sm font-medium text-ink">
                            {ch.value}
                          </p>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Organisation */}
          <div>
            <SectionTitle>Organisation</SectionTitle>
            <dl className="space-y-3 rounded-xl border border-surface-border bg-white p-4 shadow-card">
              <Row icon={<BuildingIcon className="h-4 w-4" />} label="Firma">
                {contact.company || "—"}
              </Row>
              <Row icon={<UsersIcon className="h-4 w-4" />} label="Funktion">
                {contact.position || "—"}
              </Row>
              <Row icon={<UsersIcon className="h-4 w-4" />} label="Abteilung">
                {contact.department || "—"}
              </Row>
            </dl>
          </div>

          {/* Adresse */}
          <div>
            <SectionTitle>Adresse</SectionTitle>
            <div className="rounded-xl border border-surface-border bg-white p-4 shadow-card">
              {hasAddress ? (
                <div className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <MapPinIcon className="h-5 w-5" />
                  </span>
                  <address className="not-italic text-sm leading-relaxed text-ink">
                    {contact.street && <div>{contact.street}</div>}
                    <div>
                      {[contact.postalCode, contact.city]
                        .filter(Boolean)
                        .join(" ")}
                    </div>
                    {contact.country && (
                      <div className="text-ink-soft">{contact.country}</div>
                    )}
                  </address>
                </div>
              ) : (
                <Empty>Keine Adresse hinterlegt.</Empty>
              )}
            </div>
          </div>

          {/* Notizen */}
          <div className="lg:col-span-2">
            <SectionTitle>Notizen / interne Bemerkungen</SectionTitle>
            <div className="rounded-xl border border-surface-border bg-amber-50/40 p-4 text-sm leading-relaxed text-ink shadow-card">
              {contact.notes ? (
                <p className="whitespace-pre-wrap">{contact.notes}</p>
              ) : (
                <Empty>Keine Notizen.</Empty>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-ink-muted">
          Aktualisiert am{" "}
          {new Date(contact.updatedAt).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
      {children}
    </h3>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-subtle text-ink-soft">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
          {label}
        </dt>
        <dd className="truncate text-sm font-medium text-ink">{children}</dd>
      </div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-ink-muted">{children}</p>;
}

"use client";

import { fullName, initials, type ChannelKind, type Contact } from "@/lib/types";
import { MailIcon, MobileIcon, PhoneIcon } from "./icons";

const kindIcon = { phone: PhoneIcon, mobile: MobileIcon, email: MailIcon };

const avatarPalette = [
  "from-brand-500 to-brand-700",
  "from-accent-mint to-brand-600",
  "from-brand-400 to-accent-mint",
  "from-amber-400 to-brand-600",
];

function paletteFor(id: string) {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return avatarPalette[Math.abs(sum) % avatarPalette.length];
}

export default function ContactList({
  contacts,
  selectedId,
  onSelect,
}: {
  contacts: Contact[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="space-y-1.5 p-3">
      {contacts.map((c) => {
        const active = c.id === selectedId;
        const kinds = Array.from(
          new Set(c.channels.map((ch) => ch.kind))
        ) as ChannelKind[];
        return (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={[
                "group flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition",
                active
                  ? "border-brand-300 bg-brand-50/70 shadow-card"
                  : "border-transparent hover:border-surface-border hover:bg-white",
              ].join(" ")}
            >
              <div
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${paletteFor(
                  c.id
                )} text-sm font-semibold text-white shadow-card`}
              >
                {initials(c)}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={[
                    "truncate text-sm font-semibold",
                    active ? "text-brand-700" : "text-ink",
                  ].join(" ")}
                >
                  {fullName(c) || "Ohne Namen"}
                </p>
                <p className="truncate text-xs text-ink-soft">
                  {[c.position, c.company].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-ink-muted">
                {kinds.map((k) => {
                  const Icon = kindIcon[k];
                  return <Icon key={k} className="h-3.5 w-3.5" />;
                })}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

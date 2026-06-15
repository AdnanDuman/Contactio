export type ChannelKind = "phone" | "mobile" | "email";

export type PhoneLabel = "Geschäftlich" | "Privat" | "Zentrale" | "Fax" | "Sonstige";
export type EmailLabel = "Geschäftlich" | "Privat" | "Rechnung" | "Sonstige";

export interface ContactChannel {
  id: string;
  kind: ChannelKind;
  label: string;
  value: string;
}

export interface Contact {
  id: string;
  salutation: string; // Anrede
  title: string; // Titel
  firstName: string;
  lastName: string;
  position: string; // Funktion
  department: string; // Abteilung
  company: string;
  // Adresse
  street: string;
  postalCode: string;
  city: string;
  country: string;
  // Kontaktmöglichkeiten
  channels: ContactChannel[];
  // Notizen / interne Bemerkungen
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactDraft = Omit<Contact, "id" | "createdAt" | "updatedAt">;

export const SALUTATIONS = ["Herr", "Frau", "Divers", "Firma"] as const;

export const PHONE_LABELS: PhoneLabel[] = [
  "Geschäftlich",
  "Privat",
  "Zentrale",
  "Fax",
  "Sonstige",
];

export const EMAIL_LABELS: EmailLabel[] = [
  "Geschäftlich",
  "Privat",
  "Rechnung",
  "Sonstige",
];

export function emptyDraft(): ContactDraft {
  return {
    salutation: "Herr",
    title: "",
    firstName: "",
    lastName: "",
    position: "",
    department: "",
    company: "",
    street: "",
    postalCode: "",
    city: "",
    country: "Deutschland",
    channels: [
      { id: cryptoId(), kind: "phone", label: "Geschäftlich", value: "" },
      { id: cryptoId(), kind: "email", label: "Geschäftlich", value: "" },
    ],
    notes: "",
  };
}

export function cryptoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function fullName(c: Pick<Contact, "title" | "firstName" | "lastName">): string {
  return [c.title, c.firstName, c.lastName].filter(Boolean).join(" ").trim();
}

export function initials(c: Pick<Contact, "firstName" | "lastName">): string {
  const a = c.firstName?.[0] ?? "";
  const b = c.lastName?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

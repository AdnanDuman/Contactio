import { getSupabase, isSupabaseConfigured } from "./supabase";
import { SEED_CONTACTS } from "./seed";
import { cryptoId, type Contact, type ContactDraft } from "./types";

const STORAGE_KEY = "contactio.contacts.v1";

/* ------------------------------------------------------------------ */
/*  Local (Demo) storage backend                                       */
/* ------------------------------------------------------------------ */

function loadLocal(): Contact[] {
  if (typeof window === "undefined") return SEED_CONTACTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CONTACTS));
      return SEED_CONTACTS;
    }
    return JSON.parse(raw) as Contact[];
  } catch {
    return SEED_CONTACTS;
  }
}

function saveLocal(contacts: Contact[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

/* ------------------------------------------------------------------ */
/*  Supabase row mapping                                               */
/* ------------------------------------------------------------------ */

function rowToContact(row: any): Contact {
  return {
    id: row.id,
    salutation: row.salutation ?? "",
    title: row.title ?? "",
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    position: row.position ?? "",
    department: row.department ?? "",
    company: row.company ?? "",
    street: row.street ?? "",
    postalCode: row.postal_code ?? "",
    city: row.city ?? "",
    country: row.country ?? "",
    channels: Array.isArray(row.channels) ? row.channels : [],
    notes: row.notes ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function draftToRow(draft: ContactDraft) {
  return {
    salutation: draft.salutation,
    title: draft.title,
    first_name: draft.firstName,
    last_name: draft.lastName,
    position: draft.position,
    department: draft.department,
    company: draft.company,
    street: draft.street,
    postal_code: draft.postalCode,
    city: draft.city,
    country: draft.country,
    channels: draft.channels,
    notes: draft.notes,
    updated_at: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/*  Public repository API                                              */
/* ------------------------------------------------------------------ */

export const backendLabel = isSupabaseConfigured ? "Supabase" : "Demo-Modus";

export async function listContacts(): Promise<Contact[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("contacts")
      .select("*")
      .order("last_name", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToContact);
  }
  return loadLocal().sort((a, b) => a.lastName.localeCompare(b.lastName, "de"));
}

export async function createContact(draft: ContactDraft): Promise<Contact> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("contacts")
      .insert(draftToRow(draft))
      .select("*")
      .single();
    if (error) throw error;
    return rowToContact(data);
  }
  const now = new Date().toISOString();
  const contact: Contact = {
    ...draft,
    id: cryptoId(),
    createdAt: now,
    updatedAt: now,
  };
  const all = loadLocal();
  all.push(contact);
  saveLocal(all);
  return contact;
}

export async function updateContact(
  id: string,
  draft: ContactDraft
): Promise<Contact> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("contacts")
      .update(draftToRow(draft))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return rowToContact(data);
  }
  const all = loadLocal();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Kontakt nicht gefunden");
  const updated: Contact = {
    ...all[idx],
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  saveLocal(all);
  return updated;
}

export async function deleteContact(id: string): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("contacts").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  const all = loadLocal().filter((c) => c.id !== id);
  saveLocal(all);
}

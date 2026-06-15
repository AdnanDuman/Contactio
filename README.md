# Contactio — Kontaktverwaltung

Eine moderne Kontaktverwaltung im **Fintech-Design** (hell, klar, ruhige Akzente).
Zwei-Spalten-Layout: Liste links, Detail/Formular rechts.

## Tech-Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS**
- **Supabase** als Backend (optional — siehe unten)

## Features

- 📇 Zwei-Spalten-Layout: Liste links, Detail rechts
- 🔎 **Live-Suche** über Name, Firma, Funktion, Abteilung, Ort und alle Kontaktdaten
- 🏷️ **Filter** nach Kontaktart (Telefon / Handy / E-Mail)
- ➕ Neuen Kontakt anlegen (Formular)
- ✏️ Kontakt bearbeiten (Inline, rechts in der Detailspalte)
- 🗑️ Kontakt löschen (mit Bestätigung)
- ☎️ **Mehrere** Telefon-/Handy-/E-Mail-Einträge je mit **Typ-Label** — hinzufügen/entfernen
- 🧾 Felder: Anrede, Titel, Vorname/Nachname, Funktion, Abteilung, Firma, Adresse
- 📝 Notizen / interne Bemerkungen

## Schnellstart

```bash
npm install
npm run dev
```

→ http://localhost:3000

Ohne Supabase-Konfiguration startet die App im **Demo-Modus**: Beispielkontakte
werden geladen und Änderungen im `localStorage` des Browsers gespeichert.

## Mit Supabase verbinden

1. Projekt auf [supabase.com](https://supabase.com) anlegen.
2. `supabase/schema.sql` im **SQL Editor** ausführen (Tabelle + Policy + Beispieldaten).
3. `.env.example` nach `.env.local` kopieren und ausfüllen:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   ```

4. `npm run dev` neu starten. Im Header zeigt das Badge nun **„Supabase"**.

> Hinweis: Die mitgelieferte RLS-Policy erlaubt vollen Zugriff (Entwicklung).
> Für Produktion durch auth-basierte Policies ersetzen.

## Projektstruktur

```
app/
  layout.tsx        Root-Layout
  page.tsx          Haupt-Workspace (State, Suche, Filter, CRUD)
  globals.css       Tailwind + Design-Tokens
components/
  ContactList.tsx   Linke Spalte (Liste)
  ContactDetail.tsx Rechte Spalte (Detailansicht)
  ContactForm.tsx   Anlegen/Bearbeiten-Formular
  icons.tsx         Inline-SVG-Icons
lib/
  types.ts          Datentypen & Helfer
  contacts.ts       Datenzugriff (Supabase ODER localStorage)
  supabase.ts       Supabase-Client (optional)
  seed.ts           Demo-Daten
supabase/
  schema.sql        DB-Schema
```

'use client';

import { FormEvent, useState } from 'react';

type Resource = 'links' | 'experiences' | 'projects' | 'educations' | 'certifications';
type Field = { name: string; label: string; placeholder?: string; multiline?: boolean };

const fields: Record<Resource, Field[]> = {
  links: [{ name: 'label', label: 'Label' }, { name: 'url', label: 'URL', placeholder: 'https://...' }],
  experiences: [
    { name: 'company', label: 'Company' }, { name: 'role', label: 'Role' }, { name: 'location', label: 'Location' },
    { name: 'startDate', label: 'Start date' }, { name: 'endDate', label: 'End date' }, { name: 'bullets', label: 'Highlights (one per line)', multiline: true },
  ],
  projects: [
    { name: 'name', label: 'Project name' }, { name: 'url', label: 'URL', placeholder: 'https://...' },
    { name: 'description', label: 'Description', multiline: true }, { name: 'bullets', label: 'Highlights (one per line)', multiline: true },
  ],
  educations: [
    { name: 'institution', label: 'Institution' }, { name: 'degree', label: 'Degree' }, { name: 'location', label: 'Location' },
    { name: 'startDate', label: 'Start date' }, { name: 'endDate', label: 'End date' }, { name: 'details', label: 'Details', multiline: true },
  ],
  certifications: [{ name: 'title', label: 'Certification' }, { name: 'issuer', label: 'Issuer' }, { name: 'url', label: 'Verification URL', placeholder: 'https://...' }],
};

function payload(form: HTMLFormElement, resource: Resource) {
  const data: Record<string, string | string[]> = Object.fromEntries(new FormData(form)) as Record<string, string>;
  for (const key of ['bullets']) data[key] = String(data[key] || '').split('\n').map((item) => item.trim()).filter(Boolean);
  if (resource === 'projects' && !data.url) delete data.url;
  return data;
}

export function EntryManager({ resource, title, initialItems }: { resource: Resource; title: string; initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState('');
  const resourceFields = fields[resource];

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const response = await fetch(`/api/profile/${resource}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload(event.currentTarget, resource)) });
    const body = await response.json();
    if (!response.ok) { setError(body.error || 'Unable to save entry.'); return; }
    setItems((current) => [...current, body]);
    event.currentTarget.reset();
  }

  async function remove(id: string) {
    setError('');
    const response = await fetch(`/api/profile/${resource}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!response.ok) { setError('Unable to remove entry.'); return; }
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <section className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className="text-sm text-slate-500">{items.length} entries</span>
      </div>
      {error && <p role="alert" className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm" key={item.id}>
            <div><strong>{item.name || item.company || item.institution || item.title || item.label}</strong><p className="text-slate-500">{item.role || item.degree || item.issuer || item.url}</p></div>
            <button type="button" onClick={() => remove(item.id)} className="text-red-600 hover:underline">Remove</button>
          </div>
        ))}
      </div>
      <form onSubmit={add} className="mt-5 grid gap-3 sm:grid-cols-2">
        {resourceFields.map((field) => (
          <label className={field.multiline ? 'sm:col-span-2 text-sm font-medium' : 'text-sm font-medium'} key={field.name}>
            {field.label}
            {field.multiline ? <textarea name={field.name} rows={3} placeholder={field.placeholder} className="mt-1 w-full rounded border p-2" required={field.name !== 'details' && field.name !== 'description'} /> : <input name={field.name} placeholder={field.placeholder} className="mt-1 w-full rounded border p-2" required={field.name !== 'url' && field.name !== 'location' && field.name !== 'endDate'} />}
          </label>
        ))}
        <button className="rounded bg-slate-900 px-4 py-2 font-semibold text-white sm:col-span-2">Add {title.toLowerCase().replace(/s$/, '')}</button>
      </form>
    </section>
  );
}

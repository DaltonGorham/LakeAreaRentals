import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiLogOut, FiImage, FiX } from 'react-icons/fi';
import { signIn, signOut, getSession, onAuthChange } from '../lib/auth';
import { fetchAllItems, createItem, updateItem, deleteItem } from '../lib/inventory';
import { uploadImages, deleteImagesByUrl } from '../lib/storage';
import { getImages } from './specs';

const TYPES = [
  { value: 'car', label: 'Car' },
  { value: 'sxs', label: 'SXS' },
  { value: 'rv', label: 'RV' },
  { value: 'trailer', label: 'Trailer' },
];

const TYPE_LABEL = { car: 'Car', sxs: 'SXS', rv: 'RV', trailer: 'Trailer' };

const DEFAULT_CATEGORY = { car: 'Cars', sxs: 'SXS', rv: 'Motor Home', trailer: 'trailers' };

const TYPE_BADGE = {
  car: 'bg-lake-500/15 text-lake-700 border-lake-500/40',
  sxs: 'bg-ochre-500/15 text-ochre-700 border-ochre-500/40',
  rv: 'bg-forest-500/15 text-forest-700 border-forest-500/40',
  trailer: 'bg-rust-500/15 text-rust-700 border-rust-500/40',
};

// Category-specific fields stored in the `specs` JSONB column.
const SPEC_FIELDS = {
  car: [
    { key: 'fuel_type', label: 'Fuel type', type: 'text' },
    { key: 'seats', label: 'Seats', type: 'number' },
    { key: 'mpg_city', label: 'MPG city', type: 'number' },
    { key: 'mpg_highway', label: 'MPG highway', type: 'number' },
    { key: 'mpg_est', label: 'MPG (estimate)', type: 'number' },
  ],
  sxs: [
    { key: 'fuel_type', label: 'Fuel type', type: 'text' },
    { key: 'seats', label: 'Seats', type: 'number' },
    { key: 'engine', label: 'Engine', type: 'text' },
    { key: 'horse_power', label: 'Horsepower', type: 'text' },
    { key: 'torque', label: 'Torque', type: 'text' },
  ],
  rv: [
    { key: 'fuel_type', label: 'Fuel type', type: 'text' },
    { key: 'sleeps', label: 'Sleeps', type: 'number' },
    { key: 'mpg_city', label: 'MPG city', type: 'number' },
    { key: 'mpg_highway', label: 'MPG highway', type: 'number' },
    { key: 'mpg_est', label: 'MPG (estimate)', type: 'number' },
  ],
  trailer: [
    { key: 'length', label: 'Length (e.g. "18 Feet")', type: 'text' },
    { key: 'loading_ramps', label: 'Loading ramps', type: 'checkbox' },
  ],
};

function buildSpecs(form) {
  const specs = {};
  for (const f of SPEC_FIELDS[form.type]) {
    const v = form.specs[f.key];
    if (f.type === 'checkbox') {
      specs[f.key] = !!v;
    } else if (f.type === 'number') {
      if (v !== '' && v != null) specs[f.key] = Number(v);
    } else if (v != null && String(v).trim() !== '') {
      specs[f.key] = String(v).trim();
    }
  }
  return specs;
}

function initForm(item) {
  const type = item?.type || 'car';
  return {
    type,
    name: item?.name || '',
    category: item?.category || DEFAULT_CATEGORY[type],
    images: item?.images || [],
    newFiles: [],
    featuresText: (item?.features || []).join('\n'),
    specs: { ...(item?.specs || {}) },
  };
}

// Reusable styles
const INPUT_CLASS =
  'w-full bg-paper border-2 border-ink/15 px-3.5 py-2.5 font-body text-ink focus:outline-none focus:border-rust-500 focus:bg-cream rounded-[2px] transition-colors';
const LABEL_CLASS =
  'block font-display text-[0.7rem] uppercase tracking-[0.25em] text-ink-soft mb-1.5';
const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-5 py-3 rounded-[2px] shadow-stamp-sm hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:translate-y-0 disabled:cursor-not-allowed';
const BTN_GHOST =
  'inline-flex items-center justify-center gap-2 bg-cream text-ink font-display uppercase tracking-[0.18em] text-sm px-5 py-3 rounded-[2px] border-2 border-ink/15 hover:border-rust-500 hover:text-rust-700 transition-colors disabled:opacity-60';
const BTN_DANGER =
  'inline-flex items-center justify-center gap-2 bg-rust-500 text-paper font-display uppercase tracking-[0.18em] text-sm px-5 py-3 rounded-[2px] shadow-stamp-sm hover:-translate-y-0.5 transition-transform disabled:opacity-60';

// ---------------------------------------------------------------------------

function AdminShell({ children, subtitle, actions }) {
  return (
    <main className="min-h-screen bg-paper text-ink paper-grain">
      {/* Top stripe — matches site Header marquee */}
      <div className="bg-forest-700 text-paper text-[0.68rem] tracking-[0.35em] uppercase font-medium">
        <div className="max-w-[1400px] mx-auto px-5 py-1.5 flex items-center justify-between gap-4">
          <span>Back of house · Lake Area Rentals</span>
          <Link to="/" className="hover:text-ochre-300 transition-colors">
            ← Back to site
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-8 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="font-hand text-2xl text-rust-700 -rotate-2 inline-block mb-1">
            back office —
          </p>
          <h1 className="font-display text-4xl sm:text-5xl uppercase leading-[0.95]">
            <span className="text-forest-700">Inventory</span>{' '}
            <span className="italic font-editorial text-ink">desk.</span>
          </h1>
          {subtitle && (
            <p className="mt-2 font-editorial italic text-ink-soft">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>

      {/* scalloped divider */}
      <svg
        aria-hidden
        viewBox="0 0 1440 24"
        preserveAspectRatio="none"
        className="block w-full h-3 text-forest-700"
      >
        <path
          d="M0 12 Q 40 0 80 12 T 160 12 T 240 12 T 320 12 T 400 12 T 480 12 T 560 12 T 640 12 T 720 12 T 800 12 T 880 12 T 960 12 T 1040 12 T 1120 12 T 1200 12 T 1280 12 T 1360 12 T 1440 12 L 1440 24 L 0 24 Z"
          fill="currentColor"
        />
      </svg>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">{children}</div>
    </main>
  );
}

// ---------------------------------------------------------------------------

function LoginGate() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(password);
    } catch {
      setError('Incorrect password.');
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink paper-grain grid place-items-center px-5 py-16">
      <form
        onSubmit={submit}
        className="relative w-full max-w-md bg-cream border-2 border-ink/15 p-8 sm:p-10 shadow-stamp -rotate-[0.5deg]"
      >
        {/* stamp corner */}
        <div className="absolute -top-5 -right-4 rotate-12 bg-paper border-4 border-dashed border-rust-500 px-3 py-2 shadow-stamp-sm">
          <p className="font-display text-lg text-rust-700 leading-none">STAFF</p>
          <p className="font-hand text-rust-700 text-sm leading-none mt-0.5">only</p>
        </div>

        <p className="font-hand text-2xl text-rust-700 -rotate-1 inline-block">welcome back —</p>
        <h1 className="mt-1 font-display text-4xl uppercase text-forest-700 leading-[0.95]">
          Admin
          <br />
          <span className="italic font-editorial text-ink">sign-in.</span>
        </h1>
        <p className="mt-3 font-editorial italic text-ink-soft text-sm">
          Punch your code to manage the inventory.
        </p>

        <div className="mt-8">
          <label htmlFor="admin-pw" className={LABEL_CLASS}>
            Password
          </label>
          <input
            id="admin-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            className={INPUT_CLASS}
          />
        </div>

        {error && (
          <p className="mt-4 inline-flex items-center gap-2 text-rust-700 font-editorial italic">
            <span className="inline-block size-2 rounded-full bg-rust-500" />
            {error}
          </p>
        )}

        <button type="submit" disabled={busy || !password} className={`${BTN_PRIMARY} w-full mt-6`}>
          {busy ? 'Signing in…' : 'Sign in →'}
        </button>

        <Link
          to="/"
          className="mt-5 block text-center font-display text-xs uppercase tracking-[0.25em] text-ink-soft hover:text-rust-700 transition-colors"
        >
          ← Back to site
        </Link>
      </form>
    </main>
  );
}

// ---------------------------------------------------------------------------

function ItemForm({ item, onSaved, onCancel }) {
  const [form, setForm] = useState(() => initForm(item));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const originalImages = item?.images || [];

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setSpec = (key, value) =>
    setForm((f) => ({ ...f, specs: { ...f.specs, [key]: value } }));

  const changeType = (type) =>
    setForm((f) => ({ ...f, type, category: DEFAULT_CATEGORY[type] }));

  const addFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const additions = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setForm((f) => ({ ...f, newFiles: [...f.newFiles, ...additions] }));
    e.target.value = '';
  };

  const removeExisting = (url) =>
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }));

  const removeNew = (idx) =>
    setForm((f) => {
      const next = f.newFiles.filter((_, i) => i !== idx);
      URL.revokeObjectURL(f.newFiles[idx].preview);
      return { ...f, newFiles: next };
    });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const uploaded = await uploadImages(
        form.newFiles.map((n) => n.file),
        form.type
      );
      const payload = {
        type: form.type,
        name: form.name.trim(),
        category: form.category.trim() || null,
        images: [...form.images, ...uploaded],
        features: form.featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
        specs: buildSpecs(form),
      };
      if (item) await updateItem(item.id, payload);
      else await createItem(payload);

      const removed = originalImages.filter((u) => !form.images.includes(u));
      if (removed.length) await deleteImagesByUrl(removed).catch(() => {});

      onSaved();
    } catch (err) {
      setError(err.message || 'Save failed.');
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-cream border-2 border-ink/15 shadow-stamp p-6 sm:p-10 max-w-4xl mx-auto"
    >
      <div className="flex items-baseline justify-between gap-4 mb-8">
        <div>
          <p className="font-hand text-xl text-rust-700 -rotate-1 inline-block">
            {item ? 'editing —' : 'new entry —'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl uppercase text-forest-700 leading-[0.95]">
            {item ? 'Edit item.' : 'New item.'}
          </h2>
        </div>
        <span className="font-display text-[0.6rem] tracking-[0.3em] uppercase text-ink-soft hidden sm:block">
          Form · v.1
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={LABEL_CLASS}>Type</label>
          <select
            value={form.type}
            onChange={(e) => changeType(e.target.value)}
            className={INPUT_CLASS}
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL_CLASS}>Category label</label>
          <input
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className={LABEL_CLASS}>Name</label>
        <input
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <fieldset className="mt-8 border-2 border-dashed border-ink/20 p-5 sm:p-6 relative">
        <legend className="px-3 font-display text-[0.7rem] uppercase tracking-[0.3em] text-rust-700">
          § Specs
        </legend>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SPEC_FIELDS[form.type].map((f) =>
            f.type === 'checkbox' ? (
              <label
                key={f.key}
                className="flex items-center gap-3 bg-paper border-2 border-ink/15 px-3 py-2.5 rounded-[2px] cursor-pointer hover:border-rust-500/60 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!form.specs[f.key]}
                  onChange={(e) => setSpec(f.key, e.target.checked)}
                  className="size-4 accent-rust-500"
                />
                <span className="font-body text-sm text-ink">{f.label}</span>
              </label>
            ) : (
              <div key={f.key}>
                <label className={LABEL_CLASS}>{f.label}</label>
                <input
                  type={f.type}
                  value={form.specs[f.key] ?? ''}
                  onChange={(e) => setSpec(f.key, e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            )
          )}
        </div>
      </fieldset>

      <div className="mt-8">
        <label className={LABEL_CLASS}>Images</label>
        {(form.images.length > 0 || form.newFiles.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-3">
            {form.images.map((url) => (
              <div
                key={url}
                className="relative group bg-paper p-2 pb-7 shadow-polaroid -rotate-1 hover:rotate-0 transition-transform"
              >
                <div className="aspect-square overflow-hidden bg-paper-shade">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removeExisting(url)}
                  aria-label="Remove image"
                  className="absolute top-1 right-1 grid place-items-center size-6 rounded-full bg-ink text-paper text-sm font-display hover:bg-rust-500 transition-colors shadow-stamp-sm"
                >
                  <FiX />
                </button>
              </div>
            ))}
            {form.newFiles.map((n, i) => (
              <div
                key={n.preview}
                className="relative group bg-paper p-2 pb-7 shadow-polaroid rotate-1 hover:rotate-0 transition-transform"
              >
                <span className="absolute -top-2 left-2 z-10 bg-ochre-500 text-ink font-display text-[0.55rem] uppercase tracking-[0.2em] px-1.5 py-0.5 border border-ink rounded-[2px]">
                  NEW
                </span>
                <div className="aspect-square overflow-hidden bg-paper-shade">
                  <img src={n.preview} alt="" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  aria-label="Remove image"
                  className="absolute top-1 right-1 grid place-items-center size-6 rounded-full bg-ink text-paper text-sm font-display hover:bg-rust-500 transition-colors shadow-stamp-sm"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center justify-center gap-3 bg-paper border-2 border-dashed border-ink/30 p-5 cursor-pointer hover:border-rust-500 hover:bg-cream transition-colors">
          <FiImage className="text-xl text-rust-500" />
          <span className="font-display text-xs uppercase tracking-[0.25em] text-ink-soft">
            Add images —
            <span className="font-hand text-rust-700 normal-case text-lg ml-1 tracking-normal">
              pick a few
            </span>
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={addFiles}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-8">
        <label className={LABEL_CLASS}>Features — one per line</label>
        <textarea
          rows={6}
          value={form.featuresText}
          onChange={(e) => set('featuresText', e.target.value)}
          className={`${INPUT_CLASS} resize-y leading-relaxed`}
        />
      </div>

      {error && (
        <p className="mt-5 inline-flex items-center gap-2 text-rust-700 font-editorial italic">
          <span className="inline-block size-2 rounded-full bg-rust-500" />
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3 justify-end border-t-2 border-dashed border-ink/15 pt-6">
        <button type="button" onClick={onCancel} disabled={busy} className={BTN_GHOST}>
          Cancel
        </button>
        <button type="submit" disabled={busy} className={BTN_PRIMARY}>
          {busy ? 'Saving…' : 'Save →'}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm grid place-items-center p-5"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-cream border-2 border-ink/15 shadow-stamp -rotate-[0.4deg]"
      >
        <div className="flex items-baseline justify-between gap-4 px-6 pt-5 pb-4 border-b-2 border-dashed border-ink/15">
          <h2 className="font-display text-2xl uppercase text-forest-700 leading-none">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid place-items-center size-9 rounded-full bg-paper border-2 border-ink/15 hover:bg-rust-500 hover:text-paper hover:border-rust-500 transition-colors text-ink"
          >
            <FiX />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function DeleteDialog({ item, onCancel, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
    } catch (e) {
      setError(e.message || 'Delete failed.');
      setBusy(false);
    }
  };

  return (
    <Modal title="Delete item" onClose={busy ? () => {} : onCancel}>
      <p className="font-editorial text-ink-soft leading-relaxed">
        Delete <strong className="text-ink font-display uppercase">{item.name}</strong>?
        <br />
        <span className="italic">This cannot be undone.</span>
      </p>
      {error && (
        <p className="mt-3 inline-flex items-center gap-2 text-rust-700 font-editorial italic">
          <span className="inline-block size-2 rounded-full bg-rust-500" />
          {error}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3 justify-end">
        <button type="button" onClick={onCancel} disabled={busy} className={BTN_GHOST}>
          Cancel
        </button>
        <button type="button" onClick={confirm} disabled={busy} className={BTN_DANGER}>
          {busy ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------

function AdminPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // item, 'new', or null
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchAllItems()
      .then(setItems)
      .catch((e) => setError(e.message || 'Failed to load inventory.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (typeFilter !== 'all' && i.type !== typeFilter) return false;
      if (!q) return true;
      return i.name.toLowerCase().includes(q) || TYPE_LABEL[i.type].toLowerCase().includes(q);
    });
  }, [items, query, typeFilter]);

  const typeCounts = useMemo(() => {
    const counts = {};
    for (const i of items) counts[i.type] = (counts[i.type] || 0) + 1;
    return counts;
  }, [items]);

  const onSaved = () => {
    setEditing(null);
    load();
  };

  const confirmDelete = async (item) => {
    await deleteItem(item.id);
    await deleteImagesByUrl(item.images || []).catch(() => {});
    setDeleting(null);
    load();
  };

  if (editing) {
    return (
      <AdminShell
        subtitle="Editing inventory record."
        actions={
          <button onClick={() => setEditing(null)} className={BTN_GHOST}>
            ← Back to list
          </button>
        }
      >
        <ItemForm
          item={editing === 'new' ? null : editing}
          onSaved={onSaved}
          onCancel={() => setEditing(null)}
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      subtitle={`${items.length} ${items.length === 1 ? 'item' : 'items'} on the books.`}
      actions={
        <>
          <button onClick={() => setEditing('new')} className={BTN_PRIMARY}>
            <FiPlus /> New item
          </button>
          <button onClick={signOut} className={BTN_GHOST}>
            <FiLogOut /> Sign out
          </button>
        </>
      }
    >
      {/* toolbar */}
      <div className="bg-cream border-2 border-ink/15 shadow-stamp-sm p-4 sm:p-5 mb-8 flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-rust-500 text-lg pointer-events-none" />
          <input
            type="search"
            placeholder="Search by name or type…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${INPUT_CLASS} pl-10`}
          />
        </div>

        <div role="group" aria-label="Filter by type" className="flex flex-wrap items-center gap-2">
          <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft mr-1 hidden md:inline">
            Filter
          </span>
          <FilterBtn
            label="All"
            count={items.length}
            active={typeFilter === 'all'}
            onClick={() => setTypeFilter('all')}
          />
          {TYPES.map((t) => (
            <FilterBtn
              key={t.value}
              label={t.label}
              count={typeCounts[t.value] || 0}
              active={typeFilter === t.value}
              onClick={() => setTypeFilter(t.value)}
            />
          ))}
        </div>
      </div>

      {/* table / states */}
      {loading ? (
        <StateBox>Loading the ledger…</StateBox>
      ) : error ? (
        <StateBox tone="error">{error}</StateBox>
      ) : (
        <div className="bg-cream border-2 border-ink/15 shadow-stamp overflow-hidden">
          {/* ledger header */}
          <div className="hidden md:grid grid-cols-[64px_2fr_1fr_120px_110px_120px] items-center gap-4 px-5 py-3 bg-forest-700 text-paper">
            <span />
            <Th>Name</Th>
            <Th>Type</Th>
            <Th align="right">Images</Th>
            <Th align="right">Features</Th>
            <span />
          </div>

          <ul className="divide-y-2 divide-dashed divide-ink/10">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-[64px_2fr_1fr_120px_110px_120px] items-center gap-4 px-5 py-4 hover:bg-paper/60 transition-colors"
              >
                {/* thumb */}
                <div className="size-14 rounded-[2px] overflow-hidden bg-paper-shade border-2 border-ink/10 shadow-stamp-sm shrink-0">
                  <img
                    src={getImages(item)[0]}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* name */}
                <div>
                  <span className="md:hidden block font-display text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft mb-0.5">
                    Name
                  </span>
                  <span className="font-display text-lg text-ink leading-tight">
                    {item.name}
                  </span>
                </div>

                {/* type badge */}
                <div>
                  <span className="md:hidden block font-display text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft mb-1">
                    Type
                  </span>
                  <span
                    className={`inline-flex items-center font-display text-[0.65rem] uppercase tracking-[0.2em] px-2.5 py-1 border-2 rounded-[2px] ${
                      TYPE_BADGE[item.type] || 'bg-ink/10 text-ink border-ink/20'
                    }`}
                  >
                    {TYPE_LABEL[item.type]}
                  </span>
                </div>

                {/* image count */}
                <div className="md:text-right">
                  <span className="md:hidden font-display text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft mr-2">
                    Images
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-editorial italic text-ink-soft">
                    <FiImage className="text-rust-500" />
                    {item.images?.length ?? 0}
                  </span>
                </div>

                {/* feature count */}
                <div className="md:text-right">
                  <span className="md:hidden font-display text-[0.6rem] uppercase tracking-[0.3em] text-ink-soft mr-2">
                    Features
                  </span>
                  <span className="font-editorial italic text-ink-soft">
                    {item.features?.length ?? 0}
                  </span>
                </div>

                {/* actions */}
                <div className="flex items-center md:justify-end gap-2">
                  <IconBtn
                    onClick={() => setEditing(item)}
                    label={`Edit ${item.name}`}
                    tone="default"
                  >
                    <FiEdit2 />
                  </IconBtn>
                  <IconBtn
                    onClick={() => setDeleting(item)}
                    label={`Delete ${item.name}`}
                    tone="danger"
                  >
                    <FiTrash2 />
                  </IconBtn>
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-5 py-10 text-center">
                <p className="font-editorial italic text-ink-soft">
                  {items.length === 0
                    ? 'Nothing on the books yet — add your first one.'
                    : 'No matches for that search.'}
                </p>
              </li>
            )}
          </ul>
        </div>
      )}

      {deleting && (
        <DeleteDialog
          item={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={() => confirmDelete(deleting)}
        />
      )}
    </AdminShell>
  );
}

function Th({ children, align }) {
  return (
    <span
      className={`font-display text-[0.65rem] uppercase tracking-[0.25em] text-ochre-300 ${
        align === 'right' ? 'text-right' : ''
      }`}
    >
      {children}
    </span>
  );
}

function FilterBtn({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-2 px-3.5 py-2 font-display text-xs uppercase tracking-[0.18em] rounded-[2px] transition-all',
        active
          ? 'bg-ink text-paper shadow-stamp-sm -rotate-[1deg]'
          : 'bg-paper text-ink border-2 border-ink/15 hover:border-rust-500 hover:text-rust-700',
      ].join(' ')}
    >
      {label}
      <span
        className={[
          'inline-grid place-items-center min-w-5 h-5 px-1.5 rounded-full text-[0.6rem] font-body font-semibold',
          active ? 'bg-ochre-500 text-ink' : 'bg-ink/10 text-ink/80',
        ].join(' ')}
      >
        {count}
      </span>
    </button>
  );
}

function IconBtn({ children, onClick, label, tone }) {
  const base =
    'grid place-items-center size-9 rounded-[2px] border-2 transition-all shadow-stamp-sm hover:-translate-y-0.5';
  const variant =
    tone === 'danger'
      ? 'bg-paper border-rust-500/40 text-rust-700 hover:bg-rust-500 hover:text-paper hover:border-rust-500'
      : 'bg-paper border-ink/15 text-ink hover:bg-ink hover:text-paper hover:border-ink';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`${base} ${variant}`}
    >
      {children}
    </button>
  );
}

function StateBox({ children, tone }) {
  return (
    <div
      className={[
        'bg-cream border-2 border-dashed p-10 text-center max-w-xl mx-auto',
        tone === 'error' ? 'border-rust-500/50' : 'border-ink/20',
      ].join(' ')}
    >
      <p
        className={[
          'font-editorial italic text-lg',
          tone === 'error' ? 'text-rust-700' : 'text-ink-soft',
        ].join(' ')}
      >
        {children}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setReady(true);
    });
    const unsubscribe = onAuthChange(setSession);
    return unsubscribe;
  }, []);

  if (!ready) {
    return (
      <main className="min-h-screen bg-paper text-ink paper-grain grid place-items-center">
        <p className="font-editorial italic text-ink-soft">Loading…</p>
      </main>
    );
  }

  return session ? <AdminPanel /> : <LoginGate />;
}

import { useState, useEffect, useCallback, useMemo } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiLogOut, FiImage, FiX } from 'react-icons/fi';
import { signIn, signOut, getSession, onAuthChange } from '../lib/auth';
import { fetchAllItems, createItem, updateItem, deleteItem } from '../lib/inventory';
import { uploadImages, deleteImagesByUrl } from '../lib/storage';
import { getImages } from './specs';
import './AdminPage.css';

const TYPES = [
  { value: 'car', label: 'Car' },
  { value: 'sxs', label: 'SXS' },
  { value: 'rv', label: 'RV' },
  { value: 'trailer', label: 'Trailer' },
];

const TYPE_LABEL = { car: 'Car', sxs: 'SXS', rv: 'RV', trailer: 'Trailer' };

const DEFAULT_CATEGORY = { car: 'Cars', sxs: 'SXS', rv: 'Motor Home', trailer: 'trailers' };

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
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <h1>Admin sign-in</h1>
        <label htmlFor="admin-pw">Password</label>
        <input
          id="admin-pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" disabled={busy || !password}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
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

      // Clean up bucket images the admin removed during this edit.
      const removed = originalImages.filter((u) => !form.images.includes(u));
      if (removed.length) await deleteImagesByUrl(removed).catch(() => {});

      onSaved();
    } catch (err) {
      setError(err.message || 'Save failed.');
      setBusy(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={submit}>
      <h2>{item ? 'Edit item' : 'New item'}</h2>

      <div className="admin-field-row">
        <label className="admin-field">
          <span>Type</span>
          <select value={form.type} onChange={(e) => changeType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field">
          <span>Category label</span>
          <input value={form.category} onChange={(e) => set('category', e.target.value)} />
        </label>
      </div>

      <label className="admin-field">
        <span>Name</span>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} />
      </label>

      <fieldset className="admin-specs">
        <legend>Specs</legend>
        <div className="admin-field-row">
          {SPEC_FIELDS[form.type].map((f) =>
            f.type === 'checkbox' ? (
              <label key={f.key} className="admin-field admin-field-check">
                <input
                  type="checkbox"
                  checked={!!form.specs[f.key]}
                  onChange={(e) => setSpec(f.key, e.target.checked)}
                />
                <span>{f.label}</span>
              </label>
            ) : (
              <label key={f.key} className="admin-field">
                <span>{f.label}</span>
                <input
                  type={f.type}
                  value={form.specs[f.key] ?? ''}
                  onChange={(e) => setSpec(f.key, e.target.value)}
                />
              </label>
            )
          )}
        </div>
      </fieldset>

      <div className="admin-field">
        <span>Images</span>
        {(form.images.length > 0 || form.newFiles.length > 0) && (
          <div className="admin-images">
            {form.images.map((url) => (
              <div key={url} className="admin-thumb">
                <img src={url} alt="" />
                <button type="button" onClick={() => removeExisting(url)} aria-label="Remove image">
                  ×
                </button>
              </div>
            ))}
            {form.newFiles.map((n, i) => (
              <div key={n.preview} className="admin-thumb admin-thumb-new">
                <img src={n.preview} alt="" />
                <button type="button" onClick={() => removeNew(i)} aria-label="Remove image">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <input type="file" accept="image/*" multiple onChange={addFiles} />
      </div>

      <label className="admin-field">
        <span>Features — one per line</span>
        <textarea
          rows={6}
          value={form.featuresText}
          onChange={(e) => set('featuresText', e.target.value)}
        />
      </label>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-form-actions">
        <button type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="admin-btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
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
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-head">
          <h2>{title}</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>
        {children}
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
      <p className="admin-modal-body">
        Delete <strong>{item.name}</strong>? This cannot be undone.
      </p>
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-form-actions">
        <button type="button" className="admin-btn-danger" onClick={confirm} disabled={busy}>
          {busy ? 'Deleting…' : 'Delete'}
        </button>
        <button type="button" className="admin-btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
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
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' or a type value
  const [deleting, setDeleting] = useState(null); // item pending delete confirmation

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

  // Performs the deletion; throws on failure so the dialog can show the error.
  const confirmDelete = async (item) => {
    await deleteItem(item.id);
    await deleteImagesByUrl(item.images || []).catch(() => {});
    setDeleting(null);
    load();
  };

  if (editing) {
    return (
      <main className="admin">
        <ItemForm
          item={editing === 'new' ? null : editing}
          onSaved={onSaved}
          onCancel={() => setEditing(null)}
        />
      </main>
    );
  }

  return (
    <main className="admin">
      <header className="admin-header">
        <div>
          <h1>Inventory</h1>
          <p className="admin-subtitle">
            {items.length} {items.length === 1 ? 'item' : 'items'} in the fleet
          </p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn-primary" onClick={() => setEditing('new')}>
            <FiPlus /> New item
          </button>
          <button className="admin-btn-ghost" onClick={signOut}>
            <FiLogOut /> Sign out
          </button>
        </div>
      </header>

      <div className="admin-toolbar">
        <div className="admin-search">
          <FiSearch />
          <input
            type="search"
            placeholder="Search by name or type…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="admin-filters" role="group" aria-label="Filter by type">
          <button
            type="button"
            className={`admin-filter${typeFilter === 'all' ? ' is-active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            All <span className="admin-filter-count">{items.length}</span>
          </button>
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`admin-filter${typeFilter === t.value ? ' is-active' : ''}`}
              onClick={() => setTypeFilter(t.value)}
            >
              {t.label} <span className="admin-filter-count">{typeCounts[t.value] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="admin-state">Loading…</div>
      ) : error ? (
        <div className="admin-state admin-error">{error}</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-col-thumb"></th>
                <th>Name</th>
                <th>Type</th>
                <th className="admin-col-num">Images</th>
                <th className="admin-col-num">Features</th>
                <th className="admin-col-actions"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="admin-col-thumb">
                    <div className="admin-thumb-cell">
                      <img src={getImages(item)[0]} alt="" loading="lazy" />
                    </div>
                  </td>
                  <td className="admin-cell-name" data-label="Name">
                    {item.name}
                  </td>
                  <td className="admin-cell-type" data-label="Type">
                    <span className={`admin-badge admin-badge-${item.type}`}>
                      {TYPE_LABEL[item.type]}
                    </span>
                  </td>
                  <td className="admin-col-num" data-label="Images">
                    <span className="admin-count">
                      <FiImage /> {item.images?.length ?? 0}
                    </span>
                  </td>
                  <td className="admin-col-num" data-label="Features">
                    {item.features?.length ?? 0}
                  </td>
                  <td className="admin-col-actions">
                    <div className="admin-row-actions">
                      <button
                        className="admin-btn-icon"
                        onClick={() => setEditing(item)}
                        aria-label={`Edit ${item.name}`}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="admin-btn-icon admin-btn-icon-danger"
                        onClick={() => setDeleting(item)}
                        aria-label={`Delete ${item.name}`}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty">
                    {items.length === 0 ? 'No items yet. Add your first one.' : 'No matches.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleting && (
        <DeleteDialog
          item={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={() => confirmDelete(deleting)}
        />
      )}
    </main>
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
      <main className="admin">
        <p>Loading…</p>
      </main>
    );
  }

  return session ? <AdminPanel /> : <LoginGate />;
}

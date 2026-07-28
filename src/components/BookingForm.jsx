import { useEffect, useState, useMemo } from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/style.css';
import { CheckIcon, FileIcon } from './Icons';
import { fetchApprovedWindowsForItem, createBookingRequest } from '../lib/rentals';
import { uploadAgreement } from '../lib/storage';
import { supabase } from '../lib/supabase';
import Turnstile from './Turnstile';

const INPUT_CLASS =
  'w-full bg-paper border-2 border-ink/15 px-3.5 py-2.5 font-body text-ink focus:outline-none focus:border-rust-500 focus:bg-cream rounded-[2px] transition-colors';
const LABEL_CLASS =
  'block font-display text-[0.7rem] uppercase tracking-[0.25em] text-ink-soft mb-1.5';

// Local-time date <-> 'YYYY-MM-DD' string helpers. Avoids the UTC-shift bugs
// that `toISOString()` introduces for anything west of UTC.
function dateToStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function strToDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function dayBefore(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
}

function todayStr() {
  return dateToStr(new Date());
}

// Merge with react-day-picker's own default class names rather than replacing them —
// the base stylesheet's grid/spacing rules are keyed to those classes, so overriding
// wholesale silently loses layout. We only add typography/rounding on top.
const RDP_DEFAULTS = getDefaultClassNames();
const DAY_PICKER_CLASS_NAMES = {
  ...RDP_DEFAULTS,
  root: `${RDP_DEFAULTS.root} font-body text-ink`,
  month_caption: `${RDP_DEFAULTS.month_caption} font-display uppercase tracking-[0.15em] text-forest-700`,
  weekday: `${RDP_DEFAULTS.weekday} font-display text-[0.65rem] uppercase text-ink-soft`,
  day_button: `${RDP_DEFAULTS.day_button} rounded-[2px]`,
  today: `${RDP_DEFAULTS.today} font-bold`,
};

// Themes the calendar to the site's palette via react-day-picker's CSS variables
// (see node_modules/react-day-picker/src/style.css) instead of fighting its layout CSS.
const DAY_PICKER_STYLE = {
  '--rdp-accent-color': '#c14a26',
  '--rdp-accent-background-color': 'rgba(193, 74, 38, 0.15)',
};

// Day cell size is set responsively via Tailwind arbitrary properties on the
// wrapper below — 7 columns at the desktop 3rem size (336px) overflows a phone
// screen, so mobile gets a smaller cell that still fits with room to spare.
const DAY_PICKER_SIZE_CLASS =
  "[--rdp-day-width:2.25rem] [--rdp-day-height:2.25rem] [--rdp-day_button-width:2.1rem] [--rdp-day_button-height:2.1rem] " +
  "sm:[--rdp-day-width:3rem] sm:[--rdp-day-height:3rem] sm:[--rdp-day_button-width:2.75rem] sm:[--rdp-day_button-height:2.75rem]";

export default function BookingForm({ vehicleId, vehicleName }) {
  const [approvedWindows, setApprovedWindows] = useState([]);
  const [range, setRange] = useState(undefined);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [agreementFile, setAgreementFile] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!vehicleId) {
      setApprovedWindows([]);
      return undefined;
    }
    let active = true;
    fetchApprovedWindowsForItem(vehicleId)
      .then((data) => active && setApprovedWindows(data))
      .catch(() => active && setApprovedWindows([]));
    return () => {
      active = false;
    };
  }, [vehicleId]);

  const disabledDays = useMemo(
    () => [
      { before: strToDate(todayStr()) },
      ...approvedWindows.map((w) =>
        // A null end_date is an open-ended booking (e.g. an insurance-claim
        // replacement with no known return date) — block everything from its
        // start date onward until staff record an actual return date.
        w.end_date
          ? { from: strToDate(w.start_date), to: strToDate(w.end_date) }
          : { after: dayBefore(strToDate(w.start_date)) }
      ),
    ],
    [approvedWindows]
  );

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError('Name is required.');
    if (!email.trim() && !phone.trim())
      return setError('Give us an email or phone number so we can reach you.');
    if (!range?.from || !range?.to)
      return setError('Pick your start and end date on the calendar.');
    if (!agreementFile) return setError('Attach your completed rental agreement PDF.');
    if (agreementFile.type !== 'application/pdf')
      return setError('The agreement must be a PDF file.');
    if (!agree) return setError('Please agree to the rental agreement terms.');
    if (!turnstileToken) return setError('Please complete the verification check.');

    setBusy(true);
    try {
      const agreement_path = await uploadAgreement(agreementFile);
      const created = await createBookingRequest({
        inventory_id: vehicleId,
        start_date: dateToStr(range.from),
        end_date: dateToStr(range.to),
        renter_name: name.trim(),
        renter_email: email.trim() || null,
        renter_phone: phone.trim() || null,
        agreement_path,
        turnstile_token: turnstileToken,
      });

      // Best-effort notification email — the request is already saved either way.
      supabase.functions
        .invoke('notify-booking', { body: { rental_id: created.id } })
        .catch(() => {});

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong submitting your request.');
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative bg-cream border-2 border-forest-700/30 rounded-md shadow-card p-8 sm:p-10 text-center">
        <span className="mx-auto grid place-items-center size-16 rounded-full bg-forest-700 text-paper mb-5">
          <CheckIcon className="text-2xl" />
        </span>
        <h2 className="font-display text-2xl sm:text-3xl uppercase text-forest-700 leading-[0.95]">
          Request sent —
        </h2>
        <p className="mt-3 font-editorial italic text-ink-soft">
          We'll review your dates and reach out shortly to confirm.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="relative bg-cream border-2 border-ink/15 rounded-md shadow-card p-5 sm:p-10"
    >
      <h2 className="font-display text-2xl sm:text-3xl uppercase text-forest-700 leading-[0.95]">
        Request your dates online.
      </h2>

      <div className="mt-8 grid lg:grid-cols-2 gap-10">
        {/* LEFT — calendar */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-2">
            <label className={`${LABEL_CLASS} mb-0`}>Dates for {vehicleName}</label>
            <div className="flex items-center gap-3 text-[0.65rem] font-display uppercase tracking-[0.15em] text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-full bg-paper border border-ink/30" />
                open
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-full bg-rust-500" />
                booked
              </span>
            </div>
          </div>
          <div className={`bg-paper border-2 border-ink/15 rounded-[2px] p-2 sm:p-4 flex justify-center overflow-x-auto ${DAY_PICKER_SIZE_CLASS}`}>
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={disabledDays}
              excludeDisabled
              numberOfMonths={1}
              classNames={DAY_PICKER_CLASS_NAMES}
              style={DAY_PICKER_STYLE}
            />
          </div>
          {range?.from && (
            <p className="mt-3 font-editorial italic text-ink-soft">
              {dateToStr(range.from)}
              {range.to ? ` — ${dateToStr(range.to)}` : ''}
            </p>
          )}
        </div>

        {/* RIGHT — contact + agreement */}
        <div className="space-y-5">
          <div>
            <label className={LABEL_CLASS}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={LABEL_CLASS}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Completed rental agreement (PDF)</label>
            <p className="mb-2 font-editorial italic text-sm text-ink-soft">
              Need the blank form?{' '}
              <a
                href="/rental-agreement-form.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rust-700 underline underline-offset-2 not-italic"
              >
                Download it here
              </a>
              , fill it out, then attach it below.
            </p>
            <label className="flex items-center gap-3 bg-paper border-2 border-dashed border-ink/30 p-4 cursor-pointer hover:border-rust-500 hover:bg-cream transition-colors rounded-[2px]">
              <FileIcon className="text-xl text-rust-500 shrink-0" />
              <span className="font-body text-sm text-ink-soft">
                {agreementFile ? agreementFile.name : 'Choose PDF file…'}
              </span>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setAgreementFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 size-4 accent-rust-500 shrink-0"
            />
            <span className="font-body text-sm text-ink-soft leading-snug">
              I confirm the attached PDF is my completed{' '}
              <a
                href="/rental-agreement-form.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rust-700 underline underline-offset-2"
              >
                Lake Area Rentals rental agreement
              </a>
              . This is a booking request, not a confirmed reservation — we'll follow up
              to confirm.
            </span>
          </label>

          <Turnstile
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken(null)}
          />

          {error && (
            <p className="inline-flex items-center gap-2 text-rust-700 font-editorial italic">
              <span className="inline-block size-2 rounded-full bg-rust-500 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-3 bg-ink text-paper font-display uppercase tracking-[0.18em] text-sm px-6 py-4 rounded-[2px] hover:bg-rust-700 transition-colors disabled:opacity-60"
          >
            {busy ? 'Sending…' : 'Send request'}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </form>
  );
}

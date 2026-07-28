import { useEffect, useRef, useState } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
// render=explicit: we call turnstile.render() ourselves rather than letting the
// script auto-scan the DOM for cf-turnstile elements — the documented approach
// for SPAs where the widget's container isn't in the initial HTML.
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let scriptPromise = null;
function loadScript() {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// Cloudflare Turnstile bot-check widget. The widget itself is just UX — the real
// verification happens server-side in the create-booking Edge Function, which
// rejects the request if this token doesn't check out.
export default function Turnstile({ onVerify, onExpire }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) {
      console.error('VITE_TURNSTILE_SITE_KEY is not set.');
      setError(true);
      return undefined;
    }

    let cancelled = false;

    // Deregisters the widget from Cloudflare's side. Must run before the
    // container div is ever removed from the DOM (e.g. by the error branch
    // below) — otherwise Cloudflare's script still thinks the widget exists,
    // later reaches for a DOM node that's gone, and logs "Cannot find Widget".
    const removeWidget = () => {
      const id = widgetIdRef.current;
      if (id != null && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // already gone — nothing to clean up
        }
        widgetIdRef.current = null;
      }
    };

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: onVerify,
          'expired-callback': onExpire,
          'error-callback': (code) => {
            console.error('Turnstile error:', code);
            removeWidget();
            setError(true);
            return true; // tell Turnstile we've handled it — skip its own default retry
          },
        });
      })
      .catch(() => setError(true));

    return () => {
      cancelled = true;
      removeWidget();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The container stays mounted (just hidden) rather than being swapped out for
  // the fallback message — that swap is exactly what orphans the widget above.
  return (
    <div>
      <div ref={containerRef} style={error ? { display: 'none' } : undefined} />
      {error && (
        <p className="font-editorial italic text-sm text-rust-700">
          Verification failed to load. Please refresh the page, or call us to book instead.
        </p>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

let scriptPromise = null;
function loadScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
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
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: onVerify,
          'expired-callback': onExpire,
          'error-callback': () => setError(true),
        });
      })
      .catch(() => setError(true));

    return () => {
      cancelled = true;
      if (widgetIdRef.current != null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <p className="font-editorial italic text-sm text-rust-700">
        Verification failed to load. Please refresh the page, or call us to book instead.
      </p>
    );
  }

  return <div ref={containerRef} />;
}

// Browsers send a preflight OPTIONS request before any cross-origin POST with a
// JSON body — it must succeed with these headers or the browser blocks the real
// request from ever being sent. Every other response also needs these headers so
// the browser is allowed to read the result.
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

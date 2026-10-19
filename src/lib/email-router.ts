// ============================================
// EMAIL ROUTER CLIENT (browser)
// Posts form submissions to the shared NTV email router
// (see email-router/docs/integration-guide.md). The router only forwards:
// this site builds the branded email HTML; the router checks the origin,
// rate-limits, verifies Turnstile, and sends through Resend to the
// recipients configured for our siteId in the router admin.
// ============================================

export interface EmailRouterField {
  name: string;
  label: string;
  type: string;
}

/** Serialized onto each <form data-email-router="..."> by FormSection. */
export interface EmailRouterConfig {
  endpoint: string;
  siteId: string;
  formId: string;
  turnstileSiteKey: string;
  businessName: string;
  primaryColor: string;
  phoneFormatted: string;
  fields: EmailRouterField[];
}

export interface SubmittedField extends EmailRouterField {
  value: string;
}

// Router limits (email-router/src/lib/env.ts and api/contact.ts).
const MAX_TEXT_LENGTH = 4_000;
const MAX_SUBJECT_LENGTH = 200;

// Honeypot input name. Bots fill every field; people never see this one.
export const HONEYPOT_FIELD = "company_website";

// ─── Turnstile ──────────────────────────────────────────────────────────────

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string | undefined;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

// Explicit rendering: the script is loaded once, only on pages with a form,
// and each widget is rendered by hand so view-transition navigations
// (ClientRouter) get a fresh widget in the new DOM.
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let turnstileLoading: Promise<Turnstile> | null = null;

export function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!turnstileLoading) {
    turnstileLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.onload = () =>
        window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile did not initialize"));
      script.onerror = () => {
        turnstileLoading = null;
        script.remove();
        reject(new Error("Turnstile failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return turnstileLoading;
}

// ─── Email body ─────────────────────────────────────────────────────────────

export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

/** Read each configured field from the form, in configured order. */
export function collectFields(form: HTMLFormElement, fields: EmailRouterField[]): SubmittedField[] {
  const data = new FormData(form);
  return fields.map((field) => {
    let value: string;
    if (field.type === "checkbox") {
      value = data.has(field.name) ? "Yes" : "No";
    } else {
      value = data
        .getAll(field.name)
        .map((v) => String(v).trim())
        .filter(Boolean)
        .join(", ");
    }
    return { ...field, value };
  });
}

function formatValueHtml(field: SubmittedField, linkColor: string): string {
  if (!field.value) return '<span style="color:#9a9a9a;">Not provided</span>';
  const safe = escapeHtml(field.value);
  if (field.type === "email") {
    return `<a href="mailto:${safe}" style="color:${linkColor};">${safe}</a>`;
  }
  if (field.type === "tel") {
    const digits = field.value.replace(/[^\d+]/g, "");
    return `<a href="tel:${escapeHtml(digits)}" style="color:${linkColor};">${safe}</a>`;
  }
  return safe.replace(/\r?\n/g, "<br>");
}

interface EmailMeta {
  pageUrl: string;
  submittedAt: string;
  senderName: string;
  hasReplyTo: boolean;
}

/** Self-contained, inline-styled, table-based HTML (email clients strip <style>). */
export function buildEmailHtml(
  config: EmailRouterConfig,
  fields: SubmittedField[],
  meta: EmailMeta
): string {
  const primary = escapeHtml(config.primaryColor);
  const rows = fields
    .map(
      (field) => `<tr>
<td style="padding:12px 16px;border-top:1px solid #ece6f0;width:140px;vertical-align:top;font-size:13px;font-weight:bold;color:${primary};">${escapeHtml(field.label)}</td>
<td style="padding:12px 16px;border-top:1px solid #ece6f0;vertical-align:top;font-size:14px;line-height:1.5;color:#1f1f1f;">${formatValueHtml(field, primary)}</td>
</tr>`
    )
    .join("");

  const replyLine = meta.hasReplyTo
    ? `<br>Reply to this email to respond to ${escapeHtml(meta.senderName)} directly.`
    : "";

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f3f7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3f7;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
<tr><td style="background:${primary};padding:24px;">
<p style="margin:0;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;color:#e9dff0;">${escapeHtml(config.businessName)}</p>
<h1 style="margin:6px 0 0;font-size:20px;line-height:1.3;color:#ffffff;">New contact form submission</h1>
</td></tr>
<tr><td style="padding:8px 8px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
</td></tr>
<tr><td style="padding:16px 24px 24px;font-size:12px;line-height:1.6;color:#6b6b6b;">
Submitted ${escapeHtml(meta.submittedAt)} from <a href="${escapeHtml(meta.pageUrl)}" style="color:${primary};">${escapeHtml(meta.pageUrl)}</a>.${replyLine}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export function buildEmailText(fields: SubmittedField[], meta: EmailMeta): string {
  const body = [
    "New contact form submission",
    "",
    ...fields.map((f) => `${f.label}: ${f.value || "Not provided"}`),
    "",
    `Submitted ${meta.submittedAt} from ${meta.pageUrl}`,
  ].join("\n");
  return body.length > MAX_TEXT_LENGTH ? `${body.slice(0, MAX_TEXT_LENGTH - 1)}…` : body;
}

// ─── Submit ─────────────────────────────────────────────────────────────────

export type SubmitResult = { ok: true } | { ok: false; status: number };

export async function submitToEmailRouter(
  config: EmailRouterConfig,
  form: HTMLFormElement,
  turnstileToken: string,
  submissionId: string
): Promise<SubmitResult> {
  const fields = collectFields(form, config.fields);
  const senderName = fields.find((f) => f.name === "name")?.value || "";
  const replyTo = fields.find((f) => f.type === "email")?.value || "";
  const meta: EmailMeta = {
    pageUrl: `${window.location.origin}${window.location.pathname}`,
    submittedAt: `${new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "medium",
      timeStyle: "short",
    })} ET`,
    senderName: senderName || "the sender",
    hasReplyTo: Boolean(replyTo),
  };

  const subject = `New contact form submission from ${senderName || "a website visitor"}`.slice(
    0,
    MAX_SUBJECT_LENGTH
  );

  const honeypot = new FormData(form).get(HONEYPOT_FIELD);

  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      siteId: config.siteId,
      formId: config.formId,
      submissionId,
      turnstileToken,
      honeypot: typeof honeypot === "string" ? honeypot : "",
      html: buildEmailHtml(config, fields, meta),
      text: buildEmailText(fields, meta),
      subject,
      replyTo: replyTo || undefined,
    }),
  });

  return response.ok ? { ok: true } : { ok: false, status: response.status };
}

import { absoluteUrl } from "./seo";

/**
 * Emails the team when a new enquiry arrives, using Brevo's transactional email API.
 * Each enquiry goes to the inbox that handles its category.
 *
 * Env: BREVO_API_KEY, BREVO_SENDER_EMAIL (a sender verified in Brevo)
 *      ADMIN_NOTIFY_EMAIL: every team address, comma separated. Each enquiry is routed to the matching one:
 *          address containing "couture" -> couture, collaboration, accessories, half-scale and sampling enquiries
 *          address containing "bridal"  -> bridal embroidery enquiries
 *          address containing "sales", "info", "general" or "business" -> everything else
 *        If no address matches the category, the enquiry goes to all of them, so nothing is ever lost.
 *      (optional) NOTIFY_EMAIL_COUTURE / NOTIFY_EMAIL_BRIDAL / NOTIFY_EMAIL_GENERAL to set a route explicitly
 *      (optional) BREVO_SENDER_NAME, BREVO_API_URL
 */

export type EnquiryEmail = {
    id: string;
    reference: string;
    name: string;
    email: string;
    company?: string | null;
    country?: string | null;
    enquiryType?: string | null;
    timeline?: string | null;
    brief: string;
    source: "popup" | "contact";
    files: { filename: string; sizeBytes: number }[];
};

export type EmailRoute = "couture" | "bridal" | "general";
export type SendResult = { ok: boolean; route: EmailRoute; to: string[]; status?: number; messageId?: string; error?: string };

const BREVO_URL = process.env.BREVO_API_URL ?? "https://api.brevo.com/v3/smtp/email";

const parseList = (value: string | undefined) =>
    (value ?? "")
        .split(",")
        .map((address) => address.trim())
        .filter((address) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(address))
        .slice(0, 10);

/** Which inbox an enquiry belongs to, from the "Nature of enquiry" the visitor chose. */
export function routeFor(enquiryType: string | null | undefined): EmailRoute {
    switch (enquiryType) {
        case "Bridal embroidery":
            return "bridal";
        case "Haute couture embroidery":
        case "Couture accessories":
        case "Half-scale exploration":
        case "Sampling and development":
        case "Other collaboration":
            return "couture";
        default:
            return "general";
    }
}

const KEYWORDS: Record<EmailRoute, RegExp> = {
    couture: /couture/,
    bridal: /bridal/,
    general: /sales|info|general|business|enquir/,
};

export function recipientsFor(route: EmailRoute): string[] {
    const explicit = parseList(
        { couture: process.env.NOTIFY_EMAIL_COUTURE, bridal: process.env.NOTIFY_EMAIL_BRIDAL, general: process.env.NOTIFY_EMAIL_GENERAL }[route],
    );
    if (explicit.length > 0) {
        return explicit;
    }
    const all = parseList(process.env.ADMIN_NOTIFY_EMAIL);
    const matched = all.filter((address) => KEYWORDS[route].test(address.split("@")[0].toLowerCase()));
    return matched.length > 0 ? matched : all;
}

export function isEmailConfigured() {
    return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL && parseList(process.env.ADMIN_NOTIFY_EMAIL).length > 0);
}

/** Escapes everything a visitor typed before it goes into the HTML email. */
const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** Header values must be one line, or a visitor could inject extra headers. */
const oneLine = (value: string, max: number) => value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

export async function sendEnquiryNotification(enquiry: EnquiryEmail): Promise<SendResult> {
    const route = routeFor(enquiry.enquiryType);
    const to = recipientsFor(route);
    if (!isEmailConfigured() || to.length === 0) {
        return { ok: false, route, to, error: "Email is not configured." };
    }

    const adminUrl = absoluteUrl(`/admin/enquiries/${enquiry.id}`);
    const rows: [string, string][] = [
        ["Reference", enquiry.reference],
        ["Name", enquiry.name],
        ["Email", enquiry.email],
        ["Company", enquiry.company ?? "—"],
        ["Country", enquiry.country ?? "—"],
        ["Enquiry type", enquiry.enquiryType ?? "General"],
        ["Timeline", enquiry.timeline ?? "—"],
        ["Sent from", enquiry.source === "contact" ? "Contact page" : "Enquiry popup"],
    ];

    const tableRows = rows
        .map(
            ([label, value]) =>
                `<tr><td style="padding:6px 16px 6px 0;color:#6b6259;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;color:#24211f">${escapeHtml(value)}</td></tr>`,
        )
        .join("");
    const attachments = enquiry.files.length
        ? `<p style="margin:20px 0 6px;color:#6b6259">Attachments (${enquiry.files.length})</p><ul style="margin:0;padding-left:18px">${enquiry.files
              .map((file) => `<li>${escapeHtml(file.filename)} <span style="color:#6b6259">(${formatSize(file.sizeBytes)})</span></li>`)
              .join("")}</ul><p style="margin:6px 0 0;color:#6b6259;font-size:13px">Open the enquiry in the admin to download them.</p>`
        : "";

    const htmlContent = `<!doctype html><html><body style="margin:0;background:#f6f2eb;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:620px;margin:0 auto;padding:24px">
<div style="background:#ffffff;border:1px solid #e3dccf;border-radius:8px;padding:28px">
<p style="margin:0 0 4px;color:#a48c70;font-size:12px;letter-spacing:2px;text-transform:uppercase">House of Arshiya</p>
<h1 style="margin:0 0 20px;font-size:22px;color:#24211f">New enquiry ${escapeHtml(enquiry.reference)}</h1>
<table style="border-collapse:collapse;font-size:15px">${tableRows}</table>
<p style="margin:20px 0 6px;color:#6b6259">Message</p>
<div style="white-space:pre-wrap;font-size:15px;line-height:1.6;color:#24211f;background:#f6f2eb;border-radius:6px;padding:14px">${escapeHtml(enquiry.brief)}</div>
${attachments}
<p style="margin:26px 0 0"><a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#24211f;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:6px;font-size:14px">Open in admin</a></p>
<p style="margin:18px 0 0;color:#6b6259;font-size:13px">You can reply to this email to answer ${escapeHtml(enquiry.name)} directly.</p>
</div></div></body></html>`;

    const textContent = [
        `New enquiry ${enquiry.reference}`,
        ...rows.map(([label, value]) => `${label}: ${value}`),
        "",
        enquiry.brief,
        enquiry.files.length ? `\nAttachments: ${enquiry.files.map((file) => file.filename).join(", ")}` : "",
        `\nOpen in admin: ${adminUrl}`,
    ].join("\n");

    try {
        const response = await fetch(BREVO_URL, {
            method: "POST",
            headers: {
                "api-key": process.env.BREVO_API_KEY!,
                "content-type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({
                sender: { name: process.env.BREVO_SENDER_NAME ?? "House of Arshiya Website", email: process.env.BREVO_SENDER_EMAIL },
                to: to.map((email) => ({ email })),
                // Replying to the notification answers the visitor.
                replyTo: { email: enquiry.email, name: oneLine(enquiry.name, 80) },
                subject: oneLine(`New enquiry ${enquiry.reference}: ${enquiry.enquiryType ?? "General"} from ${enquiry.name}`, 150),
                htmlContent,
                textContent,
                tags: ["enquiry", route],
            }),
            signal: AbortSignal.timeout(10_000),
        });
        const body = await response.text();
        if (!response.ok) {
            console.error(`[email] Brevo rejected ${enquiry.reference} (${response.status}): ${body.slice(0, 300)}`);
            return { ok: false, route, to, status: response.status, error: body.slice(0, 300) };
        }
        let messageId: string | undefined;
        try {
            messageId = (JSON.parse(body) as { messageId?: string }).messageId;
        } catch {
            // Brevo normally returns JSON; a missing id is not a failure.
        }
        console.log(`[email] ${enquiry.reference} sent to the ${route} inbox (${to.length} address${to.length === 1 ? "" : "es"})${messageId ? `, id ${messageId}` : ""}`);
        return { ok: true, route, to, status: response.status, messageId };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[email] Could not reach Brevo:", message);
        return { ok: false, route, to, error: message };
    }
}

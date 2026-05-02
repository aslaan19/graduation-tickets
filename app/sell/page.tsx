"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { translations, Lang } from "@/lib/translations";
import Link from "next/link";

/* ─── Inline styles as a design system ─── */
const ds = {
  green: "#16502e",
  greenLight: "#1e6b3e",
  greenGhost: "rgba(22,80,46,0.08)",
  amber: "#b45309",
  amberBg: "#fef9f0",
  amberBorder: "rgba(180,83,9,0.2)",
  surface: "#ffffff",
  bg: "#f8f6f1",
  border: "#e8e3d9",
  text: "#1c1917",
  muted: "#78716c",
  subtle: "#a8a29e",
  danger: "#c0392b",
  dangerBg: "#fdf2f2",
  radius: "14px",
  radiusSm: "8px",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)",
  shadowMd: "0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.07)",
};

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', 'Segoe UI', system-ui, sans-serif;
    background: ${ds.bg};
    color: ${ds.text};
    -webkit-font-smoothing: antialiased;
  }

  .rtl { direction: rtl; }
  .ltr { direction: ltr; }

  /* Grain overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.4;
  }

  .sell-input {
    width: 100%;
    padding: 13px 15px;
    border: 1.5px solid ${ds.border};
    border-radius: ${ds.radiusSm};
    font-family: inherit;
    font-size: 15px;
    color: ${ds.text};
    background: ${ds.surface};
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    appearance: none;
    -webkit-appearance: none;
  }
  .sell-input:focus {
    border-color: ${ds.green};
    box-shadow: 0 0 0 3px rgba(22,80,46,0.1);
  }
  .sell-input::placeholder { color: ${ds.subtle}; }
  textarea.sell-input { resize: vertical; min-height: 96px; line-height: 1.6; }

  .label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: ${ds.muted};
    margin-bottom: 7px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .btn-main {
    width: 100%;
    padding: 15px;
    background: ${ds.green};
    color: #fff;
    border: none;
    border-radius: ${ds.radiusSm};
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
    letter-spacing: 0.01em;
  }
  .btn-main:hover:not(:disabled) {
    background: ${ds.greenLight};
    box-shadow: 0 4px 14px rgba(22,80,46,0.28);
    transform: translateY(-1px);
  }
  .btn-main:active:not(:disabled) { transform: translateY(0); }
  .btn-main:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-ghost {
    width: 100%;
    padding: 14px;
    background: transparent;
    color: ${ds.green};
    border: 1.5px solid ${ds.green};
    border-radius: ${ds.radiusSm};
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
    letter-spacing: 0.01em;
  }
  .btn-ghost:hover { background: ${ds.greenGhost}; }

  /* Step progress */
  .step-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    transition: all 0.3s;
  }

  /* Fade-in animation */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.38s ease both; }
  .fade-up-2 { animation: fadeUp 0.38s 0.07s ease both; }
  .fade-up-3 { animation: fadeUp 0.38s 0.14s ease both; }

  /* Success ring */
  @keyframes scaleIn {
    from { transform: scale(0.6); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .scale-in { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* Checkbox custom */
  .custom-check {
    width: 20px; height: 20px;
    border: 2px solid ${ds.amberBorder};
    border-radius: 5px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.18s, background 0.18s;
    background: white;
  }
  .custom-check.checked {
    background: ${ds.green};
    border-color: ${ds.green};
  }

  @media (max-width: 600px) {
    .grid-2 { grid-template-columns: 1fr !important; }
    .page-header h1 { font-size: 26px !important; }
  }
`;

/* ─── Field wrapper ─── */
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">
        {label}
        {required && (
          <span style={{ color: ds.danger, marginInlineStart: 3 }}>*</span>
        )}
      </label>
      {children}
      {hint && (
        <p
          style={{
            fontSize: 12,
            color: ds.subtle,
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

/* ─── Main content ─── */
function SellContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Lang>(
    (searchParams.get("lang") as Lang) || "ar",
  );
  const t = translations[lang];
  const isRtl = lang === "ar";

  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ticket_type: "graduation",
    quantity: "1",
    price_sar: "",
    contact_methods: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.phone || !form.price_sar || !form.contact_methods) {
      setError(
        isRtl
          ? "يرجى ملء جميع الحقول المطلوبة"
          : "Please fill all required fields",
      );
      return;
    }
    setLoading(true);
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) setError(data.error);
    else setSubmitted(true);
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <div
        className={isRtl ? "rtl" : "ltr"}
        style={{
          minHeight: "100vh",
          background: ds.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <style>{globalCss}</style>
        <div
          className="scale-in"
          style={{
            background: ds.surface,
            borderRadius: 20,
            padding: "52px 40px",
            textAlign: "center",
            maxWidth: 460,
            width: "100%",
            boxShadow: ds.shadowMd,
            border: `1px solid ${ds.border}`,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              margin: "0 auto 28px",
              boxShadow: "0 4px 16px rgba(22,80,46,0.15)",
            }}
          >
            ✓
          </div>

          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 28,
              color: ds.green,
              marginBottom: 12,
              fontWeight: 400,
            }}
          >
            {t.offerPosted}
          </h2>

          <p
            style={{
              color: ds.muted,
              fontSize: 15,
              lineHeight: 1.75,
              marginBottom: 36,
            }}
          >
            {t.offerPostedDesc}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              className="btn-main"
              onClick={() => {
                setSubmitted(false);
                setAgreed(false);
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  ticket_type: "graduation",
                  quantity: "1",
                  price_sar: "",
                  contact_methods: "",
                });
              }}
            >
              {t.postAnother}
            </button>
            <Link
              href={"/browse?lang=" + lang}
              style={{ textDecoration: "none" }}
            >
              <button className="btn-ghost">{t.browseOffers}</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div
      className={isRtl ? "rtl" : "ltr"}
      style={{ minHeight: "100vh", background: ds.bg }}
    >
      <style>{globalCss}</style>

      {/* Nav */}
      <nav
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${ds.border}`,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px",
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: `linear-gradient(135deg, ${ds.green}, ${ds.greenLight})`,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              🎓
            </div>
            <div>
              <div
                style={{
                  color: ds.green,
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "-0.01em",
                }}
              >
                {t.siteName}
              </div>
              <div
                style={{
                  color: ds.subtle,
                  fontSize: 10,
                  letterSpacing: "0.02em",
                }}
              >
                {t.university}
              </div>
            </div>
          </Link>

          <button
            onClick={() => setLang(isRtl ? "en" : "ar")}
            style={{
              background: "transparent",
              color: ds.muted,
              border: `1px solid ${ds.border}`,
              borderRadius: 7,
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => (
              (e.currentTarget.style.borderColor = ds.green),
              (e.currentTarget.style.color = ds.green)
            )}
            onMouseLeave={(e) => (
              (e.currentTarget.style.borderColor = ds.border),
              (e.currentTarget.style.color = ds.muted)
            )}
          >
            {t.switchLang}
          </button>
        </div>
      </nav>

      {/* Page content */}
      <div
        style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 80px" }}
      >
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: ds.greenGhost,
              borderRadius: 20,
              padding: "4px 12px",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: ds.green,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: ds.green,
                letterSpacing: "0.04em",
              }}
            >
              {t.university}
            </span>
          </div>
          <h1
            className="page-header"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 32,
              fontWeight: 400,
              color: ds.text,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {t.sell}
          </h1>
        </div>

        {/* Warning card */}
        <div
          className="fade-up-2"
          style={{
            background: ds.amberBg,
            border: `1px solid ${ds.amberBorder}`,
            borderRadius: ds.radius,
            padding: "22px 24px",
            marginBottom: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative left strip */}
          <div
            style={{
              position: "absolute",
              [isRtl ? "right" : "left"]: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: "linear-gradient(180deg, #f59e0b, #d97706)",
              borderRadius: isRtl ? "0 4px 4px 0" : "4px 0 0 4px",
            }}
          />

          <p
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: "#92400e",
              marginBottom: 12,
              paddingInlineStart: 8,
            }}
          >
            {t.commissionWarning}
          </p>

          <div
            style={{
              color: "#78350f",
              fontSize: 14,
              lineHeight: 2,
              whiteSpace: "pre-line",
              paddingInlineStart: 8,
            }}
          >
            {t.commissionText}
          </div>

          {/* Agree checkbox */}
          <div
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: `1px solid ${ds.amberBorder}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingInlineStart: 8,
            }}
          >
            <div
              className={`custom-check${agreed ? " checked" : ""}`}
              onClick={() => setAgreed(!agreed)}
            >
              {agreed && (
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path
                    d="M1 4L4.5 7.5L10 1.5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <label
              onClick={() => setAgreed(!agreed)}
              style={{
                fontWeight: 600,
                color: "#92400e",
                cursor: "pointer",
                fontSize: 14,
                lineHeight: 1.4,
              }}
            >
              {t.iAgree}
            </label>
          </div>
        </div>

        {/* Form card */}
        <div
          className="fade-up-3"
          style={{
            background: ds.surface,
            borderRadius: ds.radius,
            padding: "28px 24px",
            border: `1px solid ${ds.border}`,
            boxShadow: ds.shadow,
            opacity: agreed ? 1 : 0.4,
            pointerEvents: agreed ? "auto" : "none",
            transition: "opacity 0.25s ease",
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            {/* Name */}
            <Field label={t.yourName} required hint={t.nameHint}>
              <input
                className="sell-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t.nameHint}
              />
            </Field>

            {/* Email + Phone */}
            <div
              className="grid-2"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Field label={t.email} required>
                <input
                  className="sell-input"
                  name="email"
                  type="email"
                  placeholder="don't want to use your email put a dot (.)"
                  value={form.email}
                  onChange={handleChange}
                />
              </Field>
              <Field label={t.phone} required>
                <input
                  className="sell-input"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                />
              </Field>
            </div>

            {/* Ticket type */}
            <Field label={t.ticketType} required>
              <div style={{ position: "relative" }}>
                <select
                  className="sell-input"
                  name="ticket_type"
                  value={form.ticket_type}
                  onChange={handleChange}
                  style={{ paddingInlineEnd: 36, cursor: "pointer" }}
                >
                  <option value="graduation">{t.graduation}</option>
                  <option value="honors_first">{t.honors_first}</option>
                  <option value="honors_second">{t.honors_second}</option>
                  <option value="honors_third">{t.honors_third}</option>
                </select>
                <svg
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    insetInlineEnd: 13,
                    pointerEvents: "none",
                  }}
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M3 5L7 9L11 5"
                    stroke={ds.muted}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Field>

            {/* Quantity + Price */}
            <div
              className="grid-2"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Field label={t.quantity} required>
                <input
                  className="sell-input"
                  name="quantity"
                  type="number"
                  min="1"
                  max="20"
                  value={form.quantity}
                  onChange={handleChange}
                />
              </Field>
              <Field label={t.price} required>
                <div style={{ position: "relative" }}>
                  <input
                    className="sell-input"
                    name="price_sar"
                    type="number"
                    min="0"
                    value={form.price_sar}
                    onChange={handleChange}
                    placeholder="0"
                    style={{ paddingInlineEnd: 46 }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      insetInlineEnd: 14,
                      fontSize: 12,
                      fontWeight: 700,
                      color: ds.subtle,
                      pointerEvents: "none",
                    }}
                  >
                    SAR
                  </span>
                </div>
              </Field>
            </div>

            {/* Contact methods */}
            <Field
              label={t.contactMethods}
              required
              hint={t.contactMethodsHint}
            >
              <textarea
                className="sell-input"
                name="contact_methods"
                value={form.contact_methods}
                onChange={handleChange}
                placeholder={t.contactMethodsHint}
              />
            </Field>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: 16,
                background: ds.dangerBg,
                border: `1px solid rgba(192,57,43,0.2)`,
                borderRadius: ds.radiusSm,
                padding: "12px 15px",
                color: ds.danger,
                fontSize: 14,
                fontWeight: 500,
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
              }}
            >
              <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            className="btn-main"
            style={{ marginTop: 24 }}
            onClick={handleSubmit}
            disabled={loading || !agreed}
          >
            {loading ? (isRtl ? "جاري النشر..." : "Posting...") : t.submitOffer}
          </button>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            color: ds.subtle,
            fontSize: 12,
            marginTop: 24,
            lineHeight: 1.6,
          }}
        >
          {isRtl
            ? "بنشر هذا العرض، أنت توافق على شروط الاستخدام"
            : "By posting, you agree to our terms of use"}
        </p>
      </div>
    </div>
  );
}

export default function SellPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "#f8f6f1",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "3px solid #e8e3d9",
              borderTopColor: "#16502e",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <SellContent />
    </Suspense>
  );
}

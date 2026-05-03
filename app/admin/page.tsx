"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { translations, Lang } from "@/lib/translations";
import { Offer } from "@/lib/supabase";
import Link from "next/link";

const ds = {
  green: "#16502e",
  greenLight: "#1e6b3e",
  bg: "#f4f6f8",
  surface: "#ffffff",
  border: "#e8ecf0",
  text: "#1a1a1a",
  muted: "#6b7280",
  subtle: "#9ca3af",
};

function AdminContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Lang>(
    (searchParams.get("lang") as Lang) || "ar",
  );
  const t = translations[lang];
  const isRTL = lang === "ar";

  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoginLoading(false);
    if (data.success) {
      setAuthed(true);
      setAdminPwd(password);
      fetchOffers(password);
    } else {
      setLoginError(t.wrongPassword);
    }
  };

  const fetchOffers = async (pwd?: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (genderFilter !== "all") params.set("gender", genderFilter);
    const res = await fetch("/api/offers?" + params.toString());
    const data = await res.json();
    setOffers(data.offers || []);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchOffers();
  }, [typeFilter, statusFilter, genderFilter]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": adminPwd,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchOffers();
  };

  const deleteOffer = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    const res = await fetch(`/api/offers/${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": adminPwd },
    });
    if (res.ok) {
      setExpandedId(null);
      fetchOffers();
    }
  };

  const totalSold = offers.filter((o) => o.status === "sold").length;
  const totalAvailable = offers.filter((o) => o.status === "available").length;
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const getTypeLabel = (type: string) =>
    (t[type as keyof typeof t] as string) || type;
  const getGenderLabel = (g: string) =>
    g === "female"
      ? isRTL
        ? "👩 نساء"
        : "👩 Female"
      : isRTL
        ? "👨 رجال"
        : "👨 Male";

  const FilterBtn = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        border: `1.5px solid ${active ? ds.green : ds.border}`,
        background: active ? ds.green : "white",
        color: active ? "white" : ds.muted,
        transition: "all 0.15s",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );

  /* ── Login ── */
  if (!authed) {
    return (
      <div
        className={isRTL ? "rtl" : "ltr"}
        style={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, #0a3320, ${ds.green})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 22,
            padding: "48px 40px",
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 60,
                height: 60,
                background: `linear-gradient(135deg, ${ds.green}, ${ds.greenLight})`,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                margin: "0 auto 16px",
                boxShadow: "0 4px 16px rgba(22,80,46,0.3)",
              }}
            >
              🔐
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: ds.text,
                marginBottom: 6,
              }}
            >
              {t.adminDashboard}
            </h1>
            <p style={{ color: ds.muted, fontSize: 14 }}>{t.adminLogin}</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontWeight: 700,
                color: ds.muted,
                marginBottom: 7,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {t.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoFocus
              style={{
                width: "100%",
                padding: "13px 15px",
                border: `1.5px solid ${ds.border}`,
                borderRadius: 10,
                fontSize: 15,
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = ds.green)}
              onBlur={(e) => (e.currentTarget.style.borderColor = ds.border)}
            />
          </div>
          {loginError && (
            <p
              style={{
                color: "#dc2626",
                fontSize: 13,
                marginBottom: 12,
                fontWeight: 600,
              }}
            >
              ⚠ {loginError}
            </p>
          )}
          <button
            onClick={handleLogin}
            disabled={loginLoading}
            style={{
              width: "100%",
              padding: 14,
              background: ds.green,
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              opacity: loginLoading ? 0.6 : 1,
              fontFamily: "inherit",
            }}
          >
            {loginLoading ? "..." : t.login}
          </button>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button
              onClick={() => setLang(isRTL ? "en" : "ar")}
              style={{
                background: "none",
                border: "none",
                color: ds.subtle,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              {t.switchLang}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <div
      className={isRTL ? "rtl" : "ltr"}
      style={{ minHeight: "100vh", background: ds.bg }}
    >
      {/* Navbar */}
      <nav
        style={{
          background: ds.green,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 28px",
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                background: "#c8a84b",
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              🔐
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 15 }}>
                {t.adminDashboard}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                جامعة الملك فهد للبترول والمعادن
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setLang(isRTL ? "en" : "ar")}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              {t.switchLang}
            </button>
            <button
              onClick={() => {
                setAuthed(false);
                setPassword("");
              }}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              {t.logout}
            </button>
          </div>
        </div>
      </nav>

      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 28px 60px" }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            marginBottom: 28,
          }}
        >
          {[
            {
              label: t.totalOffers,
              value: offers.length,
              icon: "🎫",
              bg: "#eff6ff",
              color: "#1e40af",
              border: "#bfdbfe",
            },
            {
              label: t.availableOffers,
              value: totalAvailable,
              icon: "✅",
              bg: "#f0fdf4",
              color: "#166534",
              border: "#bbf7d0",
            },
            {
              label: t.soldOffers,
              value: totalSold,
              icon: "💰",
              bg: "#fef2f2",
              color: "#991b1b",
              border: "#fecaca",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "white",
                borderRadius: 14,
                padding: "18px 22px",
                border: `1px solid ${stat.border}`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: stat.bg,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 12,
                    color: ds.subtle,
                    marginBottom: 3,
                    fontWeight: 600,
                  }}
                >
                  {stat.label}
                </p>
                <p
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: stat.color,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "18px 22px",
            marginBottom: 20,
            border: `1px solid ${ds.border}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              alignItems: "flex-start",
            }}
          >
            {/* Type */}
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: ds.subtle,
                  marginBottom: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {isRTL ? "نوع التذكرة" : "Ticket Type"}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  "all",
                  "graduation",
                  "honors_first",
                  "honors_second",
                  "honors_third",
                ].map((type) => (
                  <FilterBtn
                    key={type}
                    active={typeFilter === type}
                    onClick={() => setTypeFilter(type)}
                  >
                    {type === "all" ? t.allTypes : getTypeLabel(type)}
                  </FilterBtn>
                ))}
              </div>
            </div>
            {/* Divider */}
            <div
              style={{
                width: 1,
                background: ds.border,
                alignSelf: "stretch",
                margin: "0 4px",
              }}
            />
            {/* Gender */}
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: ds.subtle,
                  marginBottom: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {isRTL ? "الجنس" : "Gender"}
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { v: "all", l: t.allGenders },
                  { v: "male", l: isRTL ? "👨 رجال" : "👨 Male" },
                  { v: "female", l: isRTL ? "👩 نساء" : "👩 Female" },
                ].map((g) => (
                  <FilterBtn
                    key={g.v}
                    active={genderFilter === g.v}
                    onClick={() => setGenderFilter(g.v)}
                  >
                    {g.l}
                  </FilterBtn>
                ))}
              </div>
            </div>
            {/* Divider */}
            <div
              style={{
                width: 1,
                background: ds.border,
                alignSelf: "stretch",
                margin: "0 4px",
              }}
            />
            {/* Status */}
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: ds.subtle,
                  marginBottom: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {isRTL ? "الحالة" : "Status"}
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { v: "all", l: t.allStatus },
                  { v: "available", l: t.available },
                  { v: "sold", l: t.sold },
                ].map((s) => (
                  <FilterBtn
                    key={s.v}
                    active={statusFilter === s.v}
                    onClick={() => setStatusFilter(s.v)}
                  >
                    {s.l}
                  </FilterBtn>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p
            style={{
              fontSize: 13,
              color: ds.subtle,
              marginBottom: 14,
              fontWeight: 600,
            }}
          >
            {offers.length} {isRTL ? "عرض" : "offers"}
          </p>
        )}

        {/* Cards */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 14,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 14,
                  padding: 22,
                  border: `1px solid ${ds.border}`,
                  height: 160,
                }}
              >
                <div
                  style={{
                    height: 16,
                    width: "50%",
                    background: "#f0f2f5",
                    borderRadius: 6,
                    marginBottom: 12,
                  }}
                />
                <div
                  style={{
                    height: 12,
                    width: "70%",
                    background: "#f0f2f5",
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    height: 12,
                    width: "40%",
                    background: "#f0f2f5",
                    borderRadius: 6,
                  }}
                />
              </div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: 16,
              border: `1px solid ${ds.border}`,
              padding: "60px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎫</div>
            <p style={{ color: ds.muted, fontWeight: 600 }}>{t.noOffers}</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 14,
            }}
          >
            {offers.map((offer) => {
              const isExpanded = expandedId === offer.id;
              return (
                <div
                  key={offer.id}
                  style={{
                    background: "white",
                    borderRadius: 14,
                    border: `1.5px solid ${isExpanded ? ds.green : ds.border}`,
                    boxShadow: isExpanded
                      ? `0 4px 20px rgba(22,80,46,0.12)`
                      : "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "all 0.2s",
                    overflow: "hidden",
                  }}
                >
                  {/* Card header — always visible */}
                  <div
                    style={{
                      padding: "16px 18px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : offer.id)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Badges row */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "3px 9px",
                            borderRadius: 20,
                            background:
                              offer.status === "available"
                                ? "#f0fdf4"
                                : "#fef2f2",
                            color:
                              offer.status === "available"
                                ? "#166534"
                                : "#991b1b",
                            border: `1px solid ${offer.status === "available" ? "#bbf7d0" : "#fecaca"}`,
                          }}
                        >
                          {offer.status === "available"
                            ? t.availableBadge
                            : t.soldBadge}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "3px 9px",
                            borderRadius: 20,
                            background:
                              offer.gender === "female" ? "#fdf2f8" : "#eff6ff",
                            color:
                              offer.gender === "female" ? "#9d174d" : "#1e40af",
                            border: `1px solid ${offer.gender === "female" ? "#fbcfe8" : "#bfdbfe"}`,
                          }}
                        >
                          {getGenderLabel(offer.gender)}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 9px",
                            borderRadius: 20,
                            background: "#f8fafc",
                            color: ds.muted,
                            border: `1px solid ${ds.border}`,
                          }}
                        >
                          🎫 {getTypeLabel(offer.ticket_type)}
                        </span>
                      </div>
                      {/* Name + Price */}
                      <p
                        style={{
                          fontWeight: 800,
                          fontSize: 16,
                          color: ds.text,
                          marginBottom: 4,
                        }}
                      >
                        {offer.name}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 800,
                            color: ds.green,
                            fontSize: 17,
                          }}
                        >
                          {offer.price_sar}{" "}
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: ds.muted,
                            }}
                          >
                            {t.sar}
                          </span>
                        </span>
                        <span style={{ color: ds.subtle, fontSize: 12 }}>
                          ×{offer.quantity} {isRTL ? "تذكرة" : "ticket"}
                        </span>
                        <span
                          style={{
                            color: ds.subtle,
                            fontSize: 11,
                            marginInlineStart: "auto",
                          }}
                        >
                          {formatDate(offer.created_at)}
                        </span>
                      </div>
                    </div>
                    {/* Expand arrow */}
                    <div
                      style={{
                        color: ds.subtle,
                        fontSize: 12,
                        marginTop: 4,
                        transition: "transform 0.2s",
                        transform: isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    >
                      ▼
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div
                      style={{
                        borderTop: `1px solid ${ds.border}`,
                        padding: "16px 18px",
                        background: "#fafbfc",
                      }}
                    >
                      {/* Contact info */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                          marginBottom: 14,
                        }}
                      >
                        {[
                          {
                            icon: "📧",
                            label: isRTL ? "الإيميل" : "Email",
                            value: offer.email,
                          },
                          {
                            icon: "📱",
                            label: isRTL ? "الجوال" : "Phone",
                            value: offer.phone,
                          },
                        ].map((row, i) => (
                          <div
                            key={i}
                            style={{
                              background: "white",
                              borderRadius: 9,
                              padding: "10px 12px",
                              border: `1px solid ${ds.border}`,
                            }}
                          >
                            <p
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: ds.subtle,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                marginBottom: 4,
                              }}
                            >
                              {row.icon} {row.label}
                            </p>
                            <p
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: ds.text,
                                wordBreak: "break-all",
                              }}
                            >
                              {row.value}
                            </p>
                          </div>
                        ))}
                      </div>
                      {/* Contact methods */}
                      <div
                        style={{
                          background: "#fffbeb",
                          borderRadius: 9,
                          padding: "10px 14px",
                          border: "1px solid #fde68a",
                          marginBottom: 14,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#92400e",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: 6,
                          }}
                        >
                          💬 {isRTL ? "طرق التواصل" : "Contact Methods"}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "#78350f",
                            fontWeight: 600,
                            whiteSpace: "pre-line",
                            lineHeight: 1.7,
                          }}
                        >
                          {offer.contact_methods}
                        </p>
                      </div>
                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8 }}>
                        {offer.status === "available" ? (
                          <button
                            onClick={() => updateStatus(offer.id, "sold")}
                            style={{
                              flex: 1,
                              padding: "10px",
                              background: "#fef2f2",
                              color: "#991b1b",
                              border: "1.5px solid #fecaca",
                              borderRadius: 9,
                              cursor: "pointer",
                              fontSize: 13,
                              fontWeight: 700,
                              fontFamily: "inherit",
                            }}
                          >
                            💰 {t.markSold}
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(offer.id, "available")}
                            style={{
                              flex: 1,
                              padding: "10px",
                              background: "#f0fdf4",
                              color: "#166534",
                              border: "1.5px solid #bbf7d0",
                              borderRadius: 9,
                              cursor: "pointer",
                              fontSize: 13,
                              fontWeight: 700,
                              fontFamily: "inherit",
                            }}
                          >
                            ✅ {t.markAvailable}
                          </button>
                        )}
                        <button
                          onClick={() => deleteOffer(offer.id)}
                          style={{
                            padding: "10px 16px",
                            background: "#f8fafc",
                            color: ds.muted,
                            border: `1.5px solid ${ds.border}`,
                            borderRadius: 9,
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: "inherit",
                          }}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "#f4f6f8",
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
      <AdminContent />
    </Suspense>
  );
}

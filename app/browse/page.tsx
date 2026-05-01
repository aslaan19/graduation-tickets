/* eslint-disable react-hooks/immutability */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { translations, Lang } from "@/lib/translations";
import { Offer } from "@/lib/supabase";
import Link from "next/link";
import {
  GraduationCap,
  X,
  User,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Ticket,
  Tag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

function OfferModal({
  offer,
  lang,
  onClose,
}: {
  offer: Offer;
  lang: Lang;
  onClose: () => void;
}) {
  const t = translations[lang];
  const typeLabel = t[offer.ticket_type as keyof typeof t] as string;
  const isRTL = lang === "ar";

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="modal-animate w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative p-6"
          style={{
            background: "linear-gradient(135deg, #1a5c35 0%, #237a47 100%)",
          }}
        >
          <button
            onClick={onClose}
            className="absolute flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/20"
            style={{
              top: 16,
              [isRTL ? "left" : "right"]: 16,
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-3">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
              style={{
                background:
                  offer.status === "available"
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(254,226,226,0.3)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              {offer.status === "available" ? t.availableBadge : t.soldBadge}
            </span>
          </div>

          <h2 className="mb-2 text-xl font-bold text-white">{offer.name}</h2>

          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
          >
            <Ticket className="h-3.5 w-3.5" />
            {typeLabel}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Price & Quantity */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div
              className="rounded-xl border p-4"
              style={{ background: "#f0faf4", borderColor: "#c5e0ce" }}
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.pricePerTicket}
              </p>
              <p className="text-2xl font-bold" style={{ color: "#1a5c35" }}>
                {offer.price_sar}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  {t.sar}
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.totalTickets}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {offer.quantity}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  {offer.quantity === 1 ? t.ticket : t.tickets}
                </span>
              </p>
            </div>
          </div>

          {/* Seller Details */}
          <div className="mb-5 overflow-hidden rounded-xl border border-border">
            {[
              { icon: User, label: t.sellerName, value: offer.name },
              { icon: Mail, label: t.sellerEmail, value: offer.email },
              { icon: Phone, label: t.sellerPhone, value: offer.phone },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-border bg-muted/20 px-4 py-3.5 last:border-b-0"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-white">
                  <row.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </p>
                  <p className="font-semibold text-foreground">{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Methods */}
          <div
            className="mb-5 rounded-xl border p-4"
            style={{ background: "#fffbeb", borderColor: "#fde68a" }}
          >
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" style={{ color: "#92400e" }} />
              <p
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: "#92400e" }}
              >
                {t.sellerContact}
              </p>
            </div>
            <p
              className="whitespace-pre-line text-sm font-medium"
              style={{ color: "#78350f", lineHeight: 1.8 }}
            >
              {offer.contact_methods}
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {t.postedOn}: {formatDate(offer.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Lang>(
    (searchParams.get("lang") as Lang) || "ar",
  );
  const t = translations[lang];
  const isRTL = lang === "ar";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("available");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    fetchOffers();
  }, [typeFilter, statusFilter]);

  const fetchOffers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    const res = await fetch("/api/offers?" + params.toString());
    const data = await res.json();
    setOffers(data.offers || []);
    setLoading(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
      month: "short",
      day: "numeric",
    });

  const getTypeLabel = (type: string) =>
    type === "all" ? t.allTypes : (t[type as keyof typeof t] as string);

  const ticketTypes = [
    "all",
    "graduation",
    "honors_first",
    "honors_second",
    "honors_third",
  ];
  const statuses = ["all", "available", "sold"];

  return (
    <div
      className={`min-h-screen ${isRTL ? "rtl" : "ltr"}`}
      style={{ background: "#fafbfc" }}
    >
      {selectedOffer && (
        <OfferModal
          offer={selectedOffer}
          lang={lang}
          onClose={() => setSelectedOffer(null)}
        />
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-border/60"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, #1a5c35 0%, #237a47 100%)",
              }}
            >
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1
                className="text-[15px] font-bold"
                style={{ color: "#1a5c35" }}
              >
                {t.siteName}
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {t.university}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/sell?lang=${lang}`}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "#1a5c35" }}
            >
              {t.sell}
            </Link>
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted"
            >
              {t.switchLang}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="mb-1 text-2xl font-bold text-foreground md:text-3xl">
            {t.browse}
          </h2>
          <p className="text-sm text-muted-foreground">{t.university}</p>
        </div>
        {/* Notice Banner */}
        <div
          className="mb-6 rounded-2xl border-2 p-5"
          style={{
            background: "linear-gradient(135deg, #f0faf4, #e6f4ec)",
            borderColor: "#a7d5b8",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg"
              style={{ background: "#1a5c35", color: "white" }}
            >
              ⚡
            </div>
            <div>
              <p
                className="mb-1 font-bold"
                style={{ color: "#0f3d22", fontSize: 16 }}
              >
                {t.browseNoticeTitle}
              </p>
              <p style={{ color: "#1a5c35", fontSize: 14, lineHeight: 1.8 }}>
                {t.browseNoticeText}
              </p>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
          {/* Type Filter */}
          <div className="mb-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isRTL ? "نوع التذكرة" : "Ticket Type"}
            </p>
            <div className="flex flex-wrap gap-2">
              {ticketTypes.map((type) => (
                <button
                  key={type}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    typeFilter === type
                      ? "border-transparent text-white"
                      : "border-border bg-white text-muted-foreground hover:border-[#1a5c35] hover:text-[#1a5c35]"
                  }`}
                  style={typeFilter === type ? { background: "#1a5c35" } : {}}
                  onClick={() => setTypeFilter(type)}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isRTL ? "الحالة" : "Status"}
            </p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    statusFilter === s
                      ? "border-transparent text-white"
                      : "border-border bg-white text-muted-foreground hover:border-[#1a5c35] hover:text-[#1a5c35]"
                  }`}
                  style={statusFilter === s ? { background: "#1a5c35" } : {}}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === "all"
                    ? t.allStatus
                    : s === "available"
                      ? t.available
                      : t.sold}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            {offers.length} {isRTL ? "عرض" : "offers"}
          </p>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-white p-5"
              >
                <div className="skeleton mb-3 h-5 w-20" />
                <div className="skeleton mb-4 h-4 w-32" />
                <div className="skeleton mb-4 h-12 w-full" />
                <div className="skeleton h-10 w-full" />
              </div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-border bg-white py-16 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "#e8f5ee" }}
            >
              <Ticket className="h-8 w-8" style={{ color: "#1a5c35" }} />
            </div>
            <p className="mb-2 text-lg font-bold text-foreground">
              {t.noOffers}
            </p>
            <Link
              href={`/sell?lang=${lang}`}
              className="inline-flex items-center gap-2 font-semibold transition-colors hover:underline"
              style={{ color: "#1a5c35" }}
            >
              {t.sell}
              <Arrow className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Offers Grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="group cursor-pointer rounded-2xl border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#c5e0ce] hover:shadow-lg"
                onClick={() => setSelectedOffer(offer)}
              >
                {/* Status & Date */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                      offer.status === "available"
                        ? "border border-green-200 bg-green-50 text-green-700"
                        : "border border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {offer.status === "available"
                      ? t.availableBadge
                      : t.soldBadge}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatDate(offer.created_at)}
                  </span>
                </div>

                {/* Type Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <Ticket className="h-3 w-3" />
                    {t[offer.ticket_type as keyof typeof t] as string}
                  </span>
                </div>

                {/* Name */}
                <p className="mb-4 text-base font-bold text-foreground">
                  {offer.name}
                </p>

                {/* Price & Quantity */}
                <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {isRTL ? "العدد" : "Qty"}
                    </p>
                    <p className="text-base font-bold text-foreground">
                      {offer.quantity}{" "}
                      {offer.quantity === 1 ? t.ticket : t.tickets}
                    </p>
                  </div>
                  <div className={isRTL ? "text-left" : "text-right"}>
                    <p className="text-xs font-medium text-muted-foreground">
                      {isRTL ? "السعر" : "Price"}
                    </p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: "#1a5c35" }}
                    >
                      {offer.price_sar}{" "}
                      <span className="text-xs font-medium text-muted-foreground">
                        {t.sar}
                      </span>
                    </p>
                  </div>
                </div>

                {/* View Details Button */}
                <div
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all group-hover:gap-3"
                  style={{ background: "#1a5c35" }}
                >
                  {t.viewDetails}
                  <Arrow className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center"
          style={{ background: "#fafbfc" }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: "#1a5c35" }}
          >
            <GraduationCap className="h-6 w-6 animate-pulse text-white" />
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}

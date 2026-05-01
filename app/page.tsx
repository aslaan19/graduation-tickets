"use client";

import { useState } from "react";
import { translations, Lang } from "@/lib/translations";
import Link from "next/link";
import {
  Search,
  Tag,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Shield,
  Users,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = translations[lang];
  const isRTL = lang === "ar";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div
      className={`min-h-screen ${isRTL ? "rtl" : "ltr"}`}
      style={{ background: "#fafbfc" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-border/60"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
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
          </div>

          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            {t.switchLang}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0f3d22 0%, #1a5c35 50%, #237a47 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, white 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full opacity-5"
            style={{
              background: "radial-gradient(circle, white 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center lg:py-28">
          {/* University Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-white/80" />
            <span className="text-sm font-medium text-white/90">
              {t.university}
            </span>
          </div>

          <h2
            className="mx-auto mb-6 max-w-2xl text-balance text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            style={{ lineHeight: 1.2 }}
          >
            {t.siteName}
          </h2>

          <p
            className="mx-auto mb-12 max-w-xl text-pretty text-lg text-white/70"
            style={{ lineHeight: 1.8 }}
          >
            {t.siteSubtitle}
          </p>

          {/* CTA Cards */}
          <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
            {/* Buy Card */}
            <Link href={`/browse?lang=${lang}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div
                  className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ background: "#e8f5ee" }}
                >
                  <Search className="h-7 w-7" style={{ color: "#1a5c35" }} />
                </div>
                <h3
                  className="mb-3 text-xl font-bold"
                  style={{ color: "#1a5c35" }}
                >
                  {t.buyTickets}
                </h3>
                <p
                  className="mb-6 text-sm text-muted-foreground"
                  style={{ lineHeight: 1.7 }}
                >
                  {t.buyDesc}
                </p>
                <div
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all group-hover:gap-3"
                  style={{ background: "#1a5c35" }}
                >
                  {t.browse}
                  <Arrow className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Sell Card */}
            <Link href={`/sell?lang=${lang}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div
                  className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ background: "#f0faf4" }}
                >
                  <Tag className="h-7 w-7" style={{ color: "#1a5c35" }} />
                </div>
                <h3
                  className="mb-3 text-xl font-bold"
                  style={{ color: "#1a5c35" }}
                >
                  {t.sellTickets}
                </h3>
                <p
                  className="mb-6 text-sm text-muted-foreground"
                  style={{ lineHeight: 1.7 }}
                >
                  {t.sellDesc}
                </p>
                <div
                  className="inline-flex items-center gap-2 rounded-xl border-2 bg-white px-6 py-3 text-sm font-bold transition-all group-hover:gap-3"
                  style={{ borderColor: "#1a5c35", color: "#1a5c35" }}
                >
                  {t.sell}
                  <Arrow className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-b border-border/40 bg-white py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-6 text-center md:gap-16">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "#e8f5ee" }}
            >
              <Shield className="h-5 w-5" style={{ color: "#1a5c35" }} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {isRTL ? "كلشي موثوق" : "Trusted Platform"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "#e8f5ee" }}
            >
              <Users className="h-5 w-5" style={{ color: "#1a5c35" }} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {isRTL ? "تواصل مباشر" : "Direct Contact"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "#e8f5ee" }}
            >
              <GraduationCap className="h-5 w-5" style={{ color: "#1a5c35" }} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {isRTL ? "خاص بجامعة بجامعة الملك فهد البترول والمعادن" : "KFUPM Exclusive"}
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-sm text-muted-foreground">
          {t.university} © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

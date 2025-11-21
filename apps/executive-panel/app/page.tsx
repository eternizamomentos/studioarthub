"use client";

import { useCallback, useEffect, useState } from "react";

import Header from "@/components/Header";
import MissionVision from "@/components/MissionVision";
import KPIGrid from "@/components/KPIGrid";
import ProjectsBoard from "@/components/ProjectsBoard";
import Alerts from "@/components/Alerts";
import Quote from "@/components/Quote";
import ETOSection from "@/components/ETO/ETOSection";
import Footer from "@/components/Footer";

import {
  fetchHealth,
  fetchKVList,
  fetchFinanceKPI,
} from "./api-client";

/* ============================================================
   BADGES — literal types fix
============================================================ */
const BADGES = {
  green: "green",
  amber: "amber",
  red:   "red",
} as const;

/* ============================================================
   HELPERS
============================================================ */

// Garante que o gráfico tenha sempre 7 pontos
function ensure7(values: number[] | undefined): number[] {
  if (!Array.isArray(values)) return Array(7).fill(0);
  if (values.length >= 7) return values.slice(-7);
  
  const missing = 7 - values.length;
  return [...Array(missing).fill(0), ...values];
}

// Formata números centavos → R$ normal
function brl(cents: number | undefined): string {
  if (!cents) return "R$ —";
  return `R$ ${(cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/* ============================================================
   PAGE COMPONENT
============================================================ */

export default function Page() {
  const [version] = useState("0.2.0-premium");
  import type { KPI } from "@/components/KPIGrid";

  const [kpis, setKpis] = useState<KPI[]>([
    { label: "Receita (mês)",       value: "R$ —", badge: BADGES.amber, series: Array(7).fill(0) },
    { label: "PIX pagos (30d)",      value: "—",    badge: BADGES.amber, series: Array(7).fill(0) },
    { label: "Cartões pagos (30d)",  value: "—",    badge: BADGES.amber, series: Array(7).fill(0) },
    { label: "Ticket médio (30d)",   value: "R$ —", badge: BADGES.amber, series: Array(7).fill(0) },
    { label: "Taxa de erro PIX",     value: "—%",   badge: BADGES.amber, series: Array(7).fill(0) },
    { label: "Latência Pagar.me",    value: "— ms", badge: BADGES.amber, series: [12,28,40,33,22,19,25] },
  ]);

  /* ============================================================
     REFRESH — otimizado, limpo e resiliente
  ============================================================ */
  const refresh = useCallback(async () => {
    try {
      const [health, kv, finance] = await Promise.all([
        fetchHealth(),
        fetchKVList(),
        fetchFinanceKPI(),
      ]);

      const m = finance?.metrics;

      const pixPaid30d = m?.pix_paid_30d ?? 0;
      const pixError   = m?.pix_error_rate ?? 0;

      const receitaMes = brl(m?.month_gross_cents);
      const ticketMedio = brl(m?.avg_ticket_30d_cents);

      setKpis([
        {
          label: "Receita (mês)",
          value: receitaMes,
          badge: m?.month_gross_cents ? BADGES.green : BADGES.amber,
          series: ensure7([
            m?.month_gross_cents ? m.month_gross_cents / 100 : 0,
            m?.month_gross_cents ? m.month_gross_cents / 100 : 0,
            m?.month_gross_cents ? m.month_gross_cents / 100 : 0,
            m?.month_gross_cents ? m.month_gross_cents / 100 : 0,
            0, 0, 0,
          ]),
        },

        {
          label: "PIX pagos (30d)",
          value: String(pixPaid30d),
          badge: pixPaid30d > 0 ? BADGES.green : BADGES.amber,
          series: ensure7([
            pixPaid30d * 0.1,
            pixPaid30d * 0.3,
            pixPaid30d * 0.6,
            pixPaid30d * 0.9,
            pixPaid30d,
            pixPaid30d * 0.7,
            pixPaid30d * 0.4,
          ]),
        },

        {
          label: "Cartões pagos (30d)",
          value: String(m?.cc_orders_30d ?? 0),
          badge: (m?.cc_orders_30d ?? 0) > 0 ? BADGES.green : BADGES.amber,
          series: ensure7(m?.cc_daily),
        },

        {
          label: "Ticket médio (30d)",
          value: ticketMedio,
          badge: (m?.avg_ticket_30d_cents ?? 0) > 0 ? BADGES.green : BADGES.amber,
          series: ensure7([
            (m?.avg_ticket_30d_cents ?? 0) / 100,
            (m?.avg_ticket_30d_cents ?? 0) / 100,
            (m?.avg_ticket_30d_cents ?? 0) / 100,
            0,0,0,0,
          ]),
        },

        {
          label: "Taxa de erro PIX",
          value: `${(pixError * 100).toFixed(1)}%`,
          badge: pixError > 0 ? BADGES.amber : BADGES.green,
          series: ensure7([
            pixError * 0.1,
            pixError * 0.3,
            pixError * 0.6,
            pixError * 0.9,
            pixError,
            pixError * 0.7,
            pixError * 0.4,
          ]),
        },

        {
          label: "Latência Pagar.me",
          value: "— ms",
          badge: BADGES.amber,
          series: ensure7([12, 28, 40, 33, 22, 19, 25]),
        },
      ]);
    } catch (e) {
      console.error("Refresh fail:", e);
    }
  }, []);

  /* ============================================================
     CARREGAMENTO INICIAL
  ============================================================ */
  useEffect(() => {
    refresh();
  }, [refresh]);

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <main>
      <Header onRefresh={refresh} />
      <MissionVision />
      <ETOSection />
      <KPIGrid data={kpis} />
      <ProjectsBoard />
      <Alerts />
      <Quote />
      <Footer version={version} />
    </main>
  );
}
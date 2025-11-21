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

// IMPORTAR O TIPO AQUI
import type { KPI } from "@/components/KPIGrid";

import { fetchHealth, fetchKVList, fetchFinanceKPI } from "./api-client";

// ---------------------------------------------
// FIX: Definição segura dos BADGES (literal types)
// ---------------------------------------------
const BADGES = {
  green: "green",
  amber: "amber",
  red: "red",
} as const;

export default function Page() {
  const [version] = useState("0.2.0-premium");

  const [kpis, setKpis] = useState<KPI[]>([
    { label: "Receita (mês)",      value: "R$ —", badge: "amber", series: Array<number>(7).fill(0) },
    { label: "PIX pagos (30d)",    value: "—",    badge: "green", series: Array<number>(7).fill(0) },
    { label: "Ticket médio (30d)", value: "R$ —", badge: "amber", series: Array<number>(7).fill(0) },
    { label: "Taxa de erro PIX",   value: "—%",   badge: "amber", series: [1, 1, 2, 1, 2, 3, 2] },
    { label: "Latência Pagar.me",  value: "— ms", badge: "amber", series: [30, 25, 40, 33, 29, 31, 28] },
    { label: "Cartões pagos (30d)",value: "—",    badge: "amber", series: Array<number>(7).fill(0) },
  ]);

  const refresh = useCallback(async () => {
    try {
      const [health, kv, finance] = await Promise.all([
        fetchHealth(),
        fetchKVList(),
        fetchFinanceKPI(),
      ]);

      const metrics = finance?.metrics;

      const pixPaid30d = metrics?.pix_paid_30d ?? 0;

      const pixErrorRate =
        typeof metrics?.pix_error_rate === "number"
          ? metrics.pix_error_rate
          : 0;

      const monthGrossCents = metrics?.month_gross_cents ?? 0;
      const avgTicketCents = metrics?.avg_ticket_30d_cents ?? 0;

      const receitaMes =
        metrics
          ? `R$ ${(monthGrossCents / 100).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "R$ —";

      const ticketMedio =
        metrics
          ? `R$ ${(avgTicketCents / 100).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "R$ —";

      // ---------------------------------------------
      // FIX: TODAS AS BADGES convertidas para literal
      // ---------------------------------------------
      setKpis([
        {
          label: "Receita (mês)",
          value: receitaMes,
          badge: monthGrossCents > 0 ? BADGES.green : BADGES.amber,
          series: [
            monthGrossCents/100,
            monthGrossCents/100,
            monthGrossCents/100,
            monthGrossCents/100,
            0,0,0
          ],
        },

        {
          label: "PIX pagos (30d)",
          value: String(pixPaid30d),
          badge: pixPaid30d > 0 ? BADGES.green : BADGES.amber,
          series: [
            pixPaid30d * 0.1,
            pixPaid30d * 0.3,
            pixPaid30d * 0.6,
            pixPaid30d * 0.9,
            pixPaid30d,
            pixPaid30d * 0.7,
            pixPaid30d * 0.4,
          ],
        },

        {
          label: "Cartões pagos (30d)",
          value: String(metrics?.cc_orders_30d ?? 0),
          badge: (metrics?.cc_orders_30d ?? 0) > 0 ? BADGES.green : BADGES.amber,
          series: (metrics?.cc_daily ?? []).slice(-7) as number[],
        },

        {
          label: "Ticket médio (30d)",
          value: ticketMedio,
          badge: avgTicketCents > 0 ? BADGES.green : BADGES.amber,
          series: [
            avgTicketCents/100,
            avgTicketCents/100,
            avgTicketCents/100,
            0,0,0,0
          ],
        },

        {
          label: "Taxa de erro PIX",
          value: pixErrorRate > 0
            ? `${(pixErrorRate * 100).toFixed(1)}%`
            : "0%",
          badge: pixErrorRate > 0 ? BADGES.amber : BADGES.green,
          series: [
            pixErrorRate * 0.1,
            pixErrorRate * 0.3,
            pixErrorRate * 0.6,
            pixErrorRate * 0.9,
            pixErrorRate,
            pixErrorRate * 0.7,
            pixErrorRate * 0.4,
          ],
        },

        {
          label: "Latência Pagar.me",
          value: "— ms",
          badge: BADGES.amber,
          series: [12,28,40,33,22,19,25],
        },
      ]);

    } catch (e) {
      console.error("Refresh fail:", e);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <main>
      <Header onRefresh={() => void refresh()} />
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
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

export default function Page() {
  const [version] = useState("0.1.0");

  const [kpis, setKpis] = useState([
    { label: "Receita (mês)", value: "R$ —", badge: "amber", series: Array(7).fill(0) },
    { label: "PIX pagos (30d)", value: "—", badge: "green", series: Array(7).fill(0) },
    { label: "Ticket médio (30d)", value: "R$ —", badge: "amber", series: Array(7).fill(0) },
    { label: "Taxa de erro PIX", value: "—%", badge: "amber", series: [1, 1, 2, 1, 2, 3, 2] },
    { label: "Latência Pagar.me", value: "— ms", badge: "amber", series: [30,25,40,33,29,31,28] },
    { label: "Cartões pagos (30d)", value: "—", badge: "amber", series: Array(7).fill(0) },
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

      setKpis([
        // -------------------------
        // 1) Receita (mês)
        // -------------------------
        {
          label: "Receita (mês)",
          value: receitaMes,
          badge: monthGrossCents > 0 ? "green" : "amber",
          series: [
            monthGrossCents/100,
            monthGrossCents/100,
            monthGrossCents/100,
            monthGrossCents/100,
            0,0,0
          ],
        },

        // -------------------------
        // 2) PIX pagos (30d)
        // -------------------------
        {
          label: "PIX pagos (30d)",
          value: String(pixPaid30d),
          badge: pixPaid30d > 0 ? "green" : "amber",
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

        // -------------------------
        // 3) Cartões pagos (30d)
        // -------------------------
        {
          label: "Cartões pagos (30d)",
          value: String(metrics?.cc_orders_30d ?? 0),
          badge: (metrics?.cc_orders_30d ?? 0) > 0 ? "green" : "amber",
          series: (metrics?.cc_daily ?? []).slice(-7),
        },

        // -------------------------
        // 4) Ticket médio (30d)
        // -------------------------
        {
          label: "Ticket médio (30d)",
          value: ticketMedio,
          badge: avgTicketCents > 0 ? "green" : "amber",
          series: [
            avgTicketCents/100,
            avgTicketCents/100,
            avgTicketCents/100,
            0,0,0,0
          ],
        },

        // -------------------------
        // 5) Taxa de erro PIX  (CORRIGIDO)
        // -------------------------
        {
          label: "Taxa de erro PIX",
          value: pixErrorRate > 0
            ? `${(pixErrorRate * 100).toFixed(1)}%`
            : "0%",
          badge: pixErrorRate > 0 ? "amber" : "green",
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

        // -------------------------
        // 6) Latência (placeholder)
        // -------------------------
        {
          label: "Latência Pagar.me",
          value: "— ms",
          badge: "amber",
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
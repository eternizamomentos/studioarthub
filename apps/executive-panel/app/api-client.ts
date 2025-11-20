const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://studioarthub-api.rapid-hill-dc23.workers.dev";

// Cache local para manter UI funcional quando a API estiver indisponível
const FINANCE_CACHE_KEY = "finance_kpi_cache_v1";

// Helper: fetch com timeout
async function fetchJSONWithTimeout<T>(url: string, init: RequestInit = {}, timeoutMs = 7000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// ================================================
// 📊 Tipos base
// ================================================

export type PixKPI = {
  date: string; // ISO
  ok: number;
  error: number;
  pending: number;
};

export type Health = {
  ok: boolean;
  service: string;
  time: string;
};

export type KVList = {
  ok: boolean;
  count: number;
  list_complete?: boolean;
};

// ================================================
// 🌡 Healthcheck do Worker
// ================================================

export async function fetchHealth(): Promise<Health> {
  const r = await fetch(`${API_URL}/health`, { cache: "no-store" });
  if (!r.ok) throw new Error("health_fail");
  return r.json() as Promise<Health>;
}

// ================================================
// 📂 KV / Logs (apenas para debug do painel)
// ================================================

export async function fetchKVList(): Promise<KVList> {
  const r = await fetch(`${API_URL}/api/system/logs`, { cache: "no-store" });
  if (!r.ok) throw new Error("kv_fail");
  return r.json() as Promise<KVList>;
}

// ================================================
// 📈 KPI PIX (mock local provisório)
// ================================================
// 👉 Por enquanto ainda não temos rota real /api/kpi/pix no Worker.
//    Então usamos um mock previsível para alimentar o painel.
// ================================================

export async function fetchPixKPIMock(): Promise<PixKPI[]> {
  const now = Date.now();
  return Array.from({ length: 7 }).map((_, i) => {
    const t = new Date(now - (6 - i) * 86400000);
    return {
      date: t.toISOString(),
      ok: 5 + (i % 3), // leve variação nos "ok"
      error: i % 2,    // alguns erros espaçados
      pending: 1,
    };
  });
}

// ================================================
// 💰 KPI Financeiro (Pagar.me v5 via Worker)
// ================================================

export type FinanceMetrics = {
  month_gross_cents: number;
  month_orders_paid: number;
  avg_ticket_30d_cents: number;
  orders_paid_7d: number;
  pix_paid_30d: number;
  pix_errors_30d: number;
  pix_total_30d: number;
  // Taxa de erro PIX (0..1) – opcional, dependendo da API
  pix_error_rate?: number;

  // 💳 Métricas de cartão
  cc_orders_30d: number;
  cc_total_cents_30d: number;
  cc_installments_map: Record<"1" | "2" | "3", number>;
  cc_daily: number[]; // série diária em centavos (30 dias)
};

export type FinanceKPIResponse = {
  ok: boolean;
  cached?: boolean;
  source: string;
  generated_at: string;
  metrics: FinanceMetrics;
};

export async function fetchFinanceKPI(): Promise<FinanceKPIResponse | null> {
  const url = `${API_URL}/api/kpi/finance`;

  // Até 2 tentativas com timeout e pequeno backoff
  const attempts = 2;
  const timeoutMs = 7000;

  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetchJSONWithTimeout(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }, timeoutMs);

      if (r.ok) {
        const data = (await r.json()) as FinanceKPIResponse;
        if (data && data.ok && data.metrics) {
          // Atualiza cache local com sucesso
          if (typeof window !== "undefined") {
            try { window.localStorage.setItem(FINANCE_CACHE_KEY, JSON.stringify(data)); } catch {}
          }
          return data;
        }
        // Resposta inválida: tenta próximo loop
        if (process.env.NODE_ENV === "development") {
          console.warn("[fetchFinanceKPI] Resposta inválida (sem metrics)");
        }
      } else {
        // HTTP != 2xx
        if (process.env.NODE_ENV === "development") {
          console.warn(`[fetchFinanceKPI] HTTP ${r.status}`);
        }
      }
    } catch (err) {
      // Timeout/Abort/Network
      if (process.env.NODE_ENV === "development") {
        console.warn("[fetchFinanceKPI] Falha de rede/timeout");
      }
    }

    // Backoff simples antes da próxima tentativa
    await new Promise((res) => setTimeout(res, 400));
  }

  // Fallback: usar último cache válido, se existir
  if (typeof window !== "undefined") {
    try {
      const cached = window.localStorage.getItem(FINANCE_CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached) as FinanceKPIResponse;
        return data;
      }
    } catch {}
  }

  // Último recurso: objeto mínimo para manter UI funcional
  const zero: FinanceKPIResponse = {
    ok: true,
    source: "fallback",
    generated_at: new Date().toISOString(),
    metrics: {
      month_gross_cents: 0,
      month_orders_paid: 0,
      avg_ticket_30d_cents: 0,
      orders_paid_7d: 0,
      pix_paid_30d: 0,
      pix_errors_30d: 0,
      pix_total_30d: 0,
      pix_error_rate: 0,
      cc_orders_30d: 0,
      cc_total_cents_30d: 0,
      cc_installments_map: { "1": 0, "2": 0, "3": 0 },
      cc_daily: Array(30).fill(0),
    },
  };

  return zero;
}
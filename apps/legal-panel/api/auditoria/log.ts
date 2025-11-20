// apps/legal-panel/api/auditoria/log.ts
import { NextRequest, NextResponse } from "next/server";

type Severity = "info" | "warning" | "critical";

export interface AuditEvent {
  id: string;
  timestamp: string;          // ISO
  actor: string;              // quem fez (ex: "admin@studioarthub.com" ou "system")
  action: string;             // verbo curto: "CRIAR_OBRA", "ATUALIZAR_CONTRATO"
  entityType?: string;        // ex: "OBRA", "CONTRATO", "EVIDENCIA"
  entityId?: string;          // id da entidade relacionada, se houver
  source?: string;            // ex: "legal-panel", "executive-panel"
  severity: Severity;         // "info" | "warning" | "critical"
  ip?: string;
  userAgent?: string;
  details?: string;           // texto livre (JSON stringificado, resumo, etc.)
}

// ========================================================================
// ARMAZENAMENTO EM MEMÓRIA (MVP)
// Depois, será substituído por SQLite + AuditoriaService
// ========================================================================
const AUDIT_LOG: AuditEvent[] = [];

// ========================================================================
// GET /api/auditoria/log
// Lista eventos de auditoria com filtros simples
// ========================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const severityParam = searchParams.get("severity") as Severity | null;
    const actorParam = searchParams.get("actor");
    const entityTypeParam = searchParams.get("entityType");
    const limitParam = searchParams.get("limit");

    const limit = limitParam ? Math.max(1, Math.min(200, Number(limitParam))) : 50;

    let result = [...AUDIT_LOG].sort((a, b) =>
      a.timestamp < b.timestamp ? 1 : -1
    );

    if (severityParam) {
      result = result.filter((e) => e.severity === severityParam);
    }

    if (actorParam) {
      result = result.filter((e) => e.actor === actorParam);
    }

    if (entityTypeParam) {
      result = result.filter((e) => e.entityType === entityTypeParam);
    }

    result = result.slice(0, limit);

    return NextResponse.json(
      {
        ok: true,
        total: result.length,
        events: result,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[api/auditoria/log] GET erro:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao listar eventos de auditoria." },
      { status: 500 }
    );
  }
}

// ========================================================================
// POST /api/auditoria/log
// Registra um novo evento de auditoria
// ========================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const actor = String(body?.actor || "").trim() || "system";
    const action = String(body?.action || "").trim();
    const entityType = body?.entityType ? String(body.entityType).trim() : undefined;
    const entityId = body?.entityId ? String(body.entityId).trim() : undefined;
    const source =
      body?.source && String(body.source).trim()
        ? String(body.source).trim()
        : "legal-panel";

    const severityRaw = (body?.severity || "info") as Severity;
    const severity: Severity =
      severityRaw === "warning" || severityRaw === "critical"
        ? severityRaw
        : "info";

    const details =
      body?.details !== undefined && body?.details !== null
        ? String(body.details)
        : undefined;

    if (!action) {
      return NextResponse.json(
        { ok: false, error: "Campo 'action' é obrigatório." },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      undefined;

    const userAgent = request.headers.get("user-agent") ?? undefined;

    const event: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor,
      action,
      entityType,
      entityId,
      source,
      severity,
      ip,
      userAgent,
      details,
    };

    AUDIT_LOG.push(event);

    return NextResponse.json(
      {
        ok: true,
        event,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/auditoria/log] POST erro:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao registrar evento de auditoria." },
      { status: 500 }
    );
  }
}
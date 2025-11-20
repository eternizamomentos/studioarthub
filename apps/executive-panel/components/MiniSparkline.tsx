// components/MiniSparkline.tsx — Versão Premium v2.0

type Point = { x: number; y: number };

export default function MiniSparkline({
  values,
  w = 160,
  h = 48,
  color = "#E7B75F",       // gold premium
  fillArea = true,         // novo
  showBaseline = false,    // novo
}: {
  values: number[];
  w?: number;
  h?: number;
  color?: string;
  fillArea?: boolean;
  showBaseline?: boolean;
}) {
  // Proteções importantes
  if (!values || values.length === 0) values = [0];
  if (values.length === 1) values = [...values, values[0]]; // evita divisão por zero

  const max = Math.max(...values, 1);

  // Margem premium
  const pad = 4;
  const usableW = w - pad * 2;
  const usableH = h - pad * 2;

  // Mapeamento de pontos
  const pts: Point[] = values.map((v, i) => ({
    x: pad + (i / (values.length - 1)) * usableW,
    y: pad + (1 - v / max) * usableH,
  }));

  // Função para suavizar curva - Bezier cúbica
  const buildSmoothPath = (pts: Point[]) => {
    if (pts.length < 2) return "";

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const midX = (p0.x + p1.x) / 2;
      d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const pathD = buildSmoothPath(pts);

  // Área preenchida
  const fillD = `${pathD} L ${pts[pts.length - 1].x} ${h - pad} L ${pts[0].x} ${
    h - pad
  } Z`;

  // Baseline (linha zero)
  const baselineY = h - pad;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      style={{
        overflow: "visible",
      }}
    >
      {/* Linha-base opcional */}
      {showBaseline && (
        <line
          x1={pad}
          y1={baselineY}
          x2={w - pad}
          y2={baselineY}
          stroke="#ffffff15"
          strokeWidth="1"
        />
      )}

      {/* Área preenchida premium */}
      {fillArea && (
        <path
          d={fillD}
          fill={color + "22"} // 22 = transparência leve
          style={{
            transition: "all 0.35s ease",
          }}
        />
      )}

      {/* Linha premium */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        style={{
          transition: "all 0.35s ease",
          filter: "drop-shadow(0 0 4px rgba(231,183,95,0.35))",
        }}
      />
    </svg>
  );
}
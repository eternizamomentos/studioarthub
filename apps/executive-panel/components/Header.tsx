"use client";
import { useEffect, useState, useRef } from "react";

function brNow(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

const phrases = [
  "“Sua história merece uma música.”",
  "“Quando as palavras não bastam, nasce uma música.”",
  "“Filosofia + Música + Significado.”",
];

export default function Header({ onRefresh }: { onRefresh: () => void }) {
  const [clock, setClock] = useState("");
  const [idx, setIdx] = useState(0);
  const [updatedAgo, setUpdatedAgo] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setClock(brNow());

    const tickClock = setInterval(() => setClock(brNow()), 1000);
    const rot = setInterval(() => setIdx((v) => (v + 1) % phrases.length), 7000);

    return () => {
      clearInterval(tickClock);
      clearInterval(rot);
    };
  }, []);

  /* AUTO-REFRESH PREMIUM */
  useEffect(() => {
    let seconds = 0;
    setUpdatedAgo(0);

    const secInterval = setInterval(() => {
      seconds++;
      setUpdatedAgo(seconds);
    }, 1000);

    intervalRef.current = setInterval(() => {
      onRefresh();
      seconds = 0;
      setUpdatedAgo(0);
    }, 60000);

    return () => {
      clearInterval(secInterval);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onRefresh]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B1222]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 flex items-center justify-center h-[90px] md:h-[110px] lg:h-[130px]">
            <img
              src="/logo-icon.svg"
              alt="Ícone Studio Art Hub"
              className="object-contain"
              style={{
                width: "clamp(72px, 10vw, 120px)",
                filter: "drop-shadow(0px 0px 6px rgba(231,183,95,0.45))",
                transform: "translateY(-5px)",
              }}
              loading="eager"
              decoding="sync"
            />
          </div>

          <div>
            <h1 className="section-title text-2xl md:text-3xl lg:text-4xl leading-tight">
              Studio Art Hub — Painel Executivo
            </h1>
            <p className="text-pure/60 text-base md:text-lg leading-snug mt-0.5">
              {phrases[idx]}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-end leading-tight">
          <span className="text-sm md:text-base text-gold mb-1">
            {clock}
          </span>

          <span className="text-xs text-pure/40 tracking-wide select-none">
            Atualizado há {updatedAgo}s
          </span>
        </div>

      </div>
    </header>
  );
}
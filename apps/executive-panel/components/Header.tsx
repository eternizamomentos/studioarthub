"use client";
import { useEffect, useState } from "react";

function brNow(): string {
  const d = new Date();
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Sao_Paulo"
  }).format(d);
}

const phrases = [
  "“Sua história merece uma música.”",
  "“Quando as palavras não bastam, nasce uma música.”",
  "“Filosofia + Música + Significado.”"
];

export default function Header({ onRefresh }: { onRefresh: () => void }) {
  const [clock, setClock] = useState("");
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Garante que só renderiza no cliente
    setMounted(true);
    setClock(brNow());
    
    const t = setInterval(() => setClock(brNow()), 1000);
    const p = setInterval(() => setIdx((v) => (v + 1) % phrases.length), 7000);
    return () => { clearInterval(t); clearInterval(p); };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B1222]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Ícone da logo (versão aprimorada e responsiva) */}
          <div className="flex-shrink-0 flex items-center justify-center h-[90px] md:h-[110px] lg:h-[130px]">
            <img
              src="/logo-icon.svg"
              alt="Ícone Studio Art Hub"
              className="object-contain"
              style={{
                width: "clamp(72px, 10vw, 120px)",
                height: "auto",
                filter: "drop-shadow(0px 0px 6px rgba(231,183,95,0.45))",
                transform: "translateY(-5px)", // microajuste de alinhamento
              }}
              loading="eager"
              decoding="sync"
            />
          </div>
          <div>
            <h1 className="text-pure font-title text-3xl md:text-4xl leading-tight tracking-wide">
              Studio Art Hub — Painel Executivo
            </h1>
            <p className="subtle text-base md:text-lg leading-snug mt-0.5">
              {phrases[idx]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {mounted && (
            <span className="text-sm md:text-base text-gold">{clock}</span>
          )}
          <button
            onClick={onRefresh}
            className="px-3.5 py-2.5 rounded-lg bg-gold text-black hover:brightness-110 transition"
            aria-label="Atualizar dados"
          >
            Atualizar
          </button>
        </div>
      </div>
    </header>
  );
}
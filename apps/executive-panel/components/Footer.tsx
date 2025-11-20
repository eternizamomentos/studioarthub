export default function Footer({ version }: { version: string }) {
  return (
    <footer className="mx-auto max-w-7xl px-4 mt-12 mb-8">
      <div className="text-center text-sm text-pure/60 leading-relaxed">

        {/* Linha principal — Identidade */}
        <div className="text-pure/70 font-medium tracking-wide">
          📊 Painel Executivo — Studio Art Hub  
        </div>

        {/* Versão em destaque suave */}
        <div className="mt-1 text-[12px] text-gold/70">
          Versão {version}
        </div>

        {/* Divider sutil */}
        <div className="w-full mx-auto mt-4 mb-4 h-px bg-white/5" />

        {/* Direitos autorais */}
        <div className="text-[12px] text-pure/50">
          © {new Date().getFullYear()} Studio Art Hub  
          <span className="text-pure/40"> — Todos os direitos reservados.</span>
        </div>

        {/* Mensagem executiva premium opcional */}
        <div className="mt-3 text-[11px] text-pure/40">
          Construindo visão, estratégia e operação — um passo por vez.
        </div>
      </div>
    </footer>
  );
}
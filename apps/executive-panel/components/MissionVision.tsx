"use client";

export default function MissionVision() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-10 grid md:grid-cols-3 gap-6">
      
      {/* MISSÃO */}
      <div className="card group transition-all">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gold text-lg">✦</span>
          <h2 className="section-title">Missão</h2>
        </div>

        <p className="mt-2 text-pure/90 leading-relaxed">
          Transformar histórias pessoais em músicas emocionantes, únicas e memoráveis —
          experiências sonoras que conectam afetos, fortalecem vínculos e eternizam momentos.
        </p>

        <p className="text-xs text-pure/50 mt-3 italic">
          “Sua história merece uma música.”  
        </p>
      </div>

      {/* VISÃO */}
      <div className="card group transition-all">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blush text-lg">◆</span>
          <h2 className="section-title">Visão</h2>
        </div>

        <p className="mt-2 text-pure/90 leading-relaxed">
          Ser a marca referência nacional em músicas personalizadas de alto valor emocional,
          reconhecida por sensibilidade artística, excelência técnica e inovação criativa 
          apoiada por IA.
        </p>

        <p className="text-xs text-pure/50 mt-3 italic">
          “Quando as palavras não bastam, nasce uma música.”  
        </p>
      </div>

      {/* FILOSOFIAS */}
      <div className="card group transition-all">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-raspberry text-lg">●</span>
          <h2 className="section-title">Filosofias</h2>
        </div>

        <ul className="mt-2 space-y-3 text-pure/90 leading-relaxed text-sm">
          <li className="border-l-2 border-gold/40 pl-3">
            “A maneira de começar é parar de falar e começar a fazer.”  
            <span className="text-xs text-pure/50 ml-1">— Walt Disney</span>
          </li>

          <li className="border-l-2 border-gold/40 pl-3">
            “A música é a linguagem universal da humanidade.”  
            <span className="text-xs text-pure/50 ml-1">— Longfellow</span>
          </li>

          <li className="border-l-2 border-gold/40 pl-3">
            “A única maneira de fazer um excelente trabalho é amar o que você faz.”  
            <span className="text-xs text-pure/50 ml-1">— Steve Jobs</span>
          </li>
        </ul>

        <p className="text-xs text-pure/50 mt-4 italic">
          Estes princípios formam a base de decisão do Studio Art Hub.
        </p>
      </div>

    </section>
  );
}
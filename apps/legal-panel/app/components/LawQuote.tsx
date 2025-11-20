// apps/legal-panel/app/components/LawQuote.tsx
type LawQuoteProps = {
    fonte: string;      // ex.: "Lei 9.610/98, art. 7º, inc. V"
    trecho: string;     // texto da linha exata (que depois você vai preencher)
    comentario?: string;
  };
  
  export default function LawQuote({
    fonte,
    trecho,
    comentario,
  }: LawQuoteProps) {
    return (
      <figure className="law-quote">
        <blockquote className="law-quote-text">“{trecho}”</blockquote>
        <figcaption className="law-quote-meta">
          <span className="law-quote-fonte">{fonte}</span>
          {comentario && (
            <span className="law-quote-comment"> — {comentario}</span>
          )}
        </figcaption>
      </figure>
    );
  }  
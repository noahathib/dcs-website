import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import { Check, Plus } from "lucide-react";
import type { Swatch } from "@/data/content";
import { sampleRequest, usePicked } from "@/lib/sampleRequest";
import { Link } from "@/lib/router";
import { imgSrc, Strip } from "./Img";

/**
 * A fanned precast ring set: laminated sample cards on a ring, like the ones DCS sends out.
 * Cards rotate about the ring at the lower left and spread through a quarter turn.
 */
export function RingSet({ swatches, selected, onSelect }: { swatches: Swatch[]; selected: number; onSelect: (i: number) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = swatches.length;
  const start = -84;
  const span = 84;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = selected;
    if (e.key in keys) next = (selected + keys[e.key] + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    onSelect(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="ringset rv" role="radiogroup" aria-label="Featured DCS colors" onKeyDown={onKey}>
      {swatches.map((s, i) => {
        const a = start + (span * i) / Math.max(1, n - 1);
        return (
          <button
            key={s.no}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={i === selected}
            aria-label={`#${s.no} ${s.name}`}
            tabIndex={i === selected ? 0 : -1}
            className="ringcard"
            style={{ "--a": `${a}deg`, "--i": i, zIndex: i === selected ? 30 : i + 1, background: s.hex } as CSSProperties}
            onClick={() => onSelect(i)}
          >
            <span className="ringcard__hole" aria-hidden />
            <Strip img={s.img} />
            <span className="ringcard__tab" aria-hidden>
              <b>#{s.no}</b>
              <i>{s.name}</i>
            </span>
          </button>
        );
      })}
      <span className="ringset__pivot" aria-hidden />
    </div>
  );
}

export function SwatchDetail({ s, headingLevel = 2 }: { s: Swatch; headingLevel?: 2 | 3 }) {
  const picked = usePicked();
  const isPicked = picked.includes(s.no);
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="swatch-detail">
      <div className="swatch-detail__chip strip" style={{ backgroundImage: `url(${imgSrc(s.img)})`, backgroundColor: s.hex }}>
        <span className="sr-only">Photo of a concrete sample in DCS #{s.no} {s.name}</span>
      </div>
      <div className="flex items-baseline justify-between gap-4 mt-5">
        <H className="d-3">
          <span className="mono align-top text-ink-3" style={{ fontSize: "0.4em", letterSpacing: "0.04em" }}>
            No.
          </span>{" "}
          {s.no}
        </H>
        <p className="d-4 text-right">{s.name}</p>
      </div>
      <dl className="swatch-detail__meta">
        <dt>Family</dt>
        <dd>{s.family}</dd>
        <dt>Sample</dt>
        <dd>Made with grey cement. White or half-and-half cement shifts the color; ring sets show all three.</dd>
        <dt>Order as</dt>
        <dd>Dry pigment or Custom Small Bags. Ask DCS about liquid and granular blends.</dd>
      </dl>
      <div className="flex flex-wrap gap-3 mt-6">
        <button type="button" className={`btn ${isPicked ? "btn--ghost" : "btn--solid"}`} aria-pressed={isPicked} onClick={() => sampleRequest.toggle(s.no)}>
          {isPicked ? <Check aria-hidden /> : <Plus aria-hidden />}
          Add to sample request
        </button>
        {picked.length > 0 && (
          <Link to="contact" className="arrow-link self-center">
            Request {picked.length} {picked.length === 1 ? "sample" : "samples"}
          </Link>
        )}
      </div>
    </div>
  );
}

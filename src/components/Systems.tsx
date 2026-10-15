import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { BASE_SYSTEMS } from "@/data/content";
import { Img } from "./Img";

type Kind = keyof typeof BASE_SYSTEMS;

/** Liquid (5) vs granular (4) base color systems and how each dispenser doses them. */
export function BaseColorSystem({ initial = "liquid", showPhoto = true, chip }: { initial?: Kind; showPhoto?: boolean; chip?: ReactNode }) {
  const [kind, setKind] = useState<Kind>(initial);
  const sys = BASE_SYSTEMS[kind];
  const kinds = Object.keys(BASE_SYSTEMS) as Kind[];

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = kinds[(kinds.indexOf(kind) + 1) % kinds.length];
    setKind(next);
    document.getElementById(`bcs-tab-${next}`)?.focus();
  };

  return (
    <div className="bcs">
      <div className="bcs__intro rv">
        {chip}
        <p className="eyebrow eyebrow--oxide">DCS Base Color System</p>
        <h2 className="d-2 mt-4">
          {sys.count} pigments.
          <br />
          <strong>Thousands of colors.</strong>
        </h2>
        <p className="prose mt-6">
          Stock only the base pigments and let the dispenser weigh a blend for every batch. Recipes replace guesswork, employee
          error drops out, and batch-to-batch variation shrinks. At the end of a job there is nothing left over: the same base
          pigments make the next project's color.
        </p>
        <div className="seg mt-8" role="tablist" aria-label="Base color system" onKeyDown={onKey}>
          {kinds.map((k) => (
            <button
              key={k}
              id={`bcs-tab-${k}`}
              role="tab"
              type="button"
              aria-selected={k === kind}
              aria-controls="bcs-panel"
              tabIndex={k === kind ? 0 : -1}
              onClick={() => setKind(k)}
            >
              {BASE_SYSTEMS[k].label} · {BASE_SYSTEMS[k].pigments.length} colors
            </button>
          ))}
        </div>
      </div>

      <div className="bcs__stage rv" id="bcs-panel" role="tabpanel" aria-labelledby={`bcs-tab-${kind}`}>
        <ul className="pigments" key={kind} aria-label={`${sys.label} base pigments`}>
          {sys.pigments.map((p, i) => (
            <li key={p.name} className="pigment">
              <span className="pigment__pile" style={{ background: p.color, animationDelay: `${i * 70}ms` } as CSSProperties} aria-hidden />
              <b>{p.name}</b>
            </li>
          ))}
        </ul>
        <p className="mono text-ink-3 mt-4">Pigment colors shown are representative.</p>
        <ol className="flow" key={`${kind}-flow`} aria-label={`How the ${sys.label.toLowerCase()} dispenser works`}>
          {sys.flow.map((f) => (
            <li key={f.t}>
              <div>
                <b>{f.t}</b>
                <span>{f.d}</span>
              </div>
            </li>
          ))}
        </ol>
        {showPhoto && (
          <figure className="mt-8">
            <div className="ph-frame">
              <Img name={kind === "liquid" ? "liquid-system-totes" : "granular-system"} alt={kind === "liquid" ? "DCS liquid color dispensing system with pump rack, weigh vessel, totes and drums" : "DCS granular color dispensing system with four labeled supersacks"} />
            </div>
            <figcaption className="ph-caption mono">
              <span>{kind === "liquid" ? "Liquid dispensing system" : "Granular dispensing system"}</span>
              <span>DCS</span>
            </figcaption>
          </figure>
        )}
      </div>
    </div>
  );
}

/** Dry pigment packaging on a log scale of pounds, from 50 g small bags to 60-lb pails. */
const LB_MIN = 0.110231; // 50 g
const LB_MAX = 60;
const pos = (lb: number) => ((Math.log10(lb) - Math.log10(LB_MIN)) / (Math.log10(LB_MAX) - Math.log10(LB_MIN))) * 100;

const PACKS = [
  { name: "Custom Small Bags", note: "50 g to 49 lb, add the whole bag", from: LB_MIN, to: 49, label: "50 g – 49 lb" },
  { name: "Soluble bags", note: "Custom sizes, toss the bag in the mixer", to: 15, fade: true, label: "up to 15 lb" },
  { name: "Standard bag", note: "Dry pigment, weighed by your trained operator", at: 50, label: "50 lb" },
  { name: "Dynamicast pail", note: "Color hardener, 10 standard colors", at: 60, label: "60 lb" },
];
const TICKS = [
  { lb: LB_MIN, t: "50 g", align: "start" },
  { lb: 1, t: "1 lb" },
  { lb: 5, t: "5 lb" },
  { lb: 15, t: "15 lb" },
  { lb: LB_MAX, t: "60 lb", align: "end" },
];

export function PackagingScale() {
  return (
    <figure className="scale rv" aria-labelledby="scale-cap">
      <figcaption id="scale-cap" className="sr-only">
        Dry pigment packaging sizes on a logarithmic scale: Custom Small Bags from 50 grams to 49 pounds, soluble bags up to 15
        pounds, standard 50-pound bags and 60-pound Dynamicast color hardener pails.
      </figcaption>
      {PACKS.map((p) => (
        <div key={p.name} className="scale__row">
          <div className="scale__name">
            <b>{p.name}</b>
            <span>{p.note}</span>
          </div>
          <div className="scale__track" aria-hidden>
            {"at" in p && p.at !== undefined ? (
              <span className="scale__pt" style={{ left: `${pos(p.at)}%` }} />
            ) : (
              <span
                className={`scale__range ${p.fade ? "scale__range--fade" : ""}`}
                style={{ left: `${pos(p.from ?? LB_MIN)}%`, width: `${pos(p.to!) - pos(p.from ?? LB_MIN)}%` }}
              />
            )}
            <span className="scale__tag" style={{ right: `${100 - pos(("at" in p && p.at) || p.to!)}%` }}>
              {p.label}
            </span>
          </div>
        </div>
      ))}
      <div className="scale__axis" aria-hidden>
        {TICKS.map((t) => (
          <span key={t.t} className={`scale__tick ${t.align ? `scale__tick--${t.align}` : ""}`} style={{ left: `${pos(t.lb)}%` }}>
            {t.t}
          </span>
        ))}
      </div>
    </figure>
  );
}

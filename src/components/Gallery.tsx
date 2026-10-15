import { useEffect, useRef, useState, type Ref } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MARKET_LABEL, TESTIMONIALS, TESTIMONIAL_ORDER, type Project } from "@/data/content";
import { Img } from "./Img";

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
  returnFocus,
}: {
  items: Project[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  returnFocus: (i: number) => void;
}) {
  const open = index !== null;
  const p = open ? items[Math.min(index, items.length - 1)] : null;
  const last = useRef(0);
  if (index !== null) last.current = index;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndex((index! + 1) % items.length);
      if (e.key === "ArrowLeft") onIndex((index! - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onIndex]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Content
          className="lightbox"
          aria-describedby={undefined}
          onCloseAutoFocus={(e) => {
            // Return focus to the tile of the last photo viewed (the dialog has no Trigger to fall back on).
            e.preventDefault();
            returnFocus(last.current);
          }}
        >
          {p && (
            <>
              <div className="lightbox__top">
                <span className="mono" style={{ color: "#a9b0b4" }} aria-hidden>
                  {String(index! + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
                <Dialog.Close className="icon-btn" aria-label="Close">
                  <X aria-hidden />
                </Dialog.Close>
              </div>
              <div className="lightbox__stage">
                <Img name={p.img} alt={p.alt} loading="eager" />
              </div>
              <div className="lightbox__bottom">
                <div className="min-w-0">
                  <Dialog.Title className="d-5">{p.name}</Dialog.Title>
                  <p className="mono" style={{ color: "#a9b0b4" }}>
                    {p.label ?? MARKET_LABEL[p.market]}
                    {p.credit ? ` · Photo: ${p.credit}` : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" className="icon-btn" aria-label="Previous photo" onClick={() => onIndex((index! - 1 + items.length) % items.length)}>
                    <ChevronLeft aria-hidden />
                  </button>
                  <button type="button" className="icon-btn" aria-label="Next photo" onClick={() => onIndex((index! + 1) % items.length)}>
                    <ChevronRight aria-hidden />
                  </button>
                </div>
              </div>
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {`${p.name}, ${p.label ?? MARKET_LABEL[p.market]}. Photo ${index! + 1} of ${items.length}`}
              </p>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ProjectTile({ p, onOpen, showMarket = true, ref }: { p: Project; onOpen: () => void; showMarket?: boolean; ref?: Ref<HTMLButtonElement> }) {
  return (
    <button ref={ref} type="button" className="tile" onClick={onOpen} aria-label={`${p.name}. ${p.alt}. View larger`}>
      <Img name={p.img} alt="" />
      <span className="tile__cap" aria-hidden>
        <b>{p.name}</b>
        {showMarket && <span>{p.label ?? MARKET_LABEL[p.market]}</span>}
      </span>
    </button>
  );
}

function useTileFocus() {
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const setTile = (i: number) => (el: HTMLButtonElement | null) => {
    tiles.current[i] = el;
  };
  const returnFocus = (i: number) => tiles.current[i]?.focus();
  return { setTile, returnFocus };
}

export function Masonry({ items, showMarket = true }: { items: Project[]; showMarket?: boolean }) {
  const [idx, setIdx] = useState<number | null>(null);
  const { setTile, returnFocus } = useTileFocus();
  return (
    <>
      <div className="masonry">
        {items.map((p, i) => (
          <ProjectTile key={p.img} ref={setTile(i)} p={p} onOpen={() => setIdx(i)} showMarket={showMarket} />
        ))}
      </div>
      <Lightbox items={items} index={idx} onIndex={setIdx} onClose={() => setIdx(null)} returnFocus={returnFocus} />
    </>
  );
}

export function Rail({ items }: { items: Project[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  const { setTile, returnFocus } = useTileFocus();
  return (
    <>
      <div className="rail" role="list" aria-label="Featured projects">
        {items.map((p, i) => (
          <div role="listitem" key={p.img}>
            <ProjectTile ref={setTile(i)} p={p} onOpen={() => setIdx(i)} />
          </div>
        ))}
      </div>
      <Lightbox items={items} index={idx} onIndex={setIdx} onClose={() => setIdx(null)} returnFocus={returnFocus} />
    </>
  );
}

/** Customer testimonials as an index: names on the left, the selected quote large. */
export function Voices({ ids = TESTIMONIAL_ORDER }: { ids?: string[] }) {
  const [sel, setSel] = useState(0);
  const t = TESTIMONIALS[ids[sel]];
  const onKey = (e: React.KeyboardEvent) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const n = (sel + d + ids.length) % ids.length;
    setSel(n);
    document.getElementById(`voice-tab-${n}`)?.focus();
  };
  return (
    <div className="voices">
      <div className="voices__list" role="tablist" aria-label="Customer testimonials" aria-orientation="vertical" onKeyDown={onKey}>
        {ids.map((id, i) => (
          <button
            key={id}
            id={`voice-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === sel}
            aria-controls="voice-panel"
            tabIndex={i === sel ? 0 : -1}
            className="voice-tab"
            onClick={() => setSel(i)}
          >
            <b>{TESTIMONIALS[id].name}</b>
            <span>{TESTIMONIALS[id].company}</span>
          </button>
        ))}
      </div>
      <figure className="voices__quote" id="voice-panel" role="tabpanel" aria-labelledby={`voice-tab-${sel}`}>
        <blockquote key={t.id} className="quote-big quote-fade">
          <p>{t.quote}</p>
        </blockquote>
        <figcaption className="quote-attr">
          <b>{t.name}</b>
          <span className="mono text-ink-3">{t.company}</span>
        </figcaption>
      </figure>
    </div>
  );
}

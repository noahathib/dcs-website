import { useEffect } from "react";

const TRACKPAD_SCALE = 0.5;
const NATIVE_TARGETS = 'input, textarea, select, dialog, [contenteditable]:not([contenteditable="false"]), [role="dialog"], [aria-modal="true"]';
const scrollable = (overflow: string) => /^(auto|scroll|overlay)$/.test(overflow);
const locked = (el: Element) => /^(hidden|clip)$/.test(getComputedStyle(el).overflowY);

/** Halve pixel-based trackpad travel, preserving the device's own timing and momentum. */
export function useScrollSensitivity(navigation: number) {
  useEffect(() => {
    // Keep a fractional destination even when a browser rounds its actual scroll offset. Small trackpad deltas
    // then accumulate instead of disappearing. Any native/programmatic move starts from the new position.
    let target = 0;
    let written: number | null = null;
    const native = () => { written = null; };

    const onWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented || !event.cancelable || event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL ||
        event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
        !Number.isFinite(event.deltaY) || event.deltaY === 0 || Math.abs(event.deltaX) >= Math.abs(event.deltaY)
      ) return native();

      const root = document.documentElement;
      const body = document.body;
      if (locked(root) || locked(body)) return native();

      // Scrollable controls and dialogs own their gestures, including their native boundary/overscroll behavior.
      // Do not treat body as a nested scroller: overflow-x:hidden makes its computed overflow-y:auto.
      for (const node of event.composedPath()) {
        if (node === body || node === root) break;
        if (!(node instanceof Element)) continue;
        if (node.matches(NATIVE_TARGETS)) return native();
        const style = getComputedStyle(node);
        if (scrollable(style.overflowY) && node.scrollHeight > node.clientHeight) return native();
        if (event.deltaX !== 0 && scrollable(style.overflowX) && node.scrollWidth > node.clientWidth) return native();
      }

      const scroller = document.scrollingElement;
      if (!scroller) return native();
      const max = Math.max(0, scroller.scrollHeight - root.clientHeight);
      const current = window.scrollY;
      if (max === 0 || (current <= 0 && event.deltaY < 0) || (current >= max - 1 && event.deltaY > 0)) return native();
      if (written === null || Math.abs(current - written) > 0.01) target = current;
      target = Math.min(max, Math.max(0, target + event.deltaY * TRACKPAD_SCALE));
      event.preventDefault();
      // The OS already supplies trackpad momentum. Extra easing here would cause drift after the fingers stop.
      window.scrollTo({ top: target, behavior: "instant" });
      written = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [navigation]);
}

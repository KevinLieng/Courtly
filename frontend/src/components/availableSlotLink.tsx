import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./availableSlotLink.module.css";

type Props = {
  href: string;
  className: string;
  ariaLabel: string;
  count: number;
  windowLabel: string;
};

type Placement = "above" | "below";

type TooltipPosition = {
  top: number;
  left: number;
  arrowLeft: number;
  placement: Placement;
  measured: boolean;
};

const VIEWPORT_MARGIN = 8;
const CELL_GAP = 9;
const ESTIMATED_TOOLTIP_HEIGHT = 56;
const ARROW_EDGE_MARGIN = 12;

export default function AvailableSlotLink({ href, className, ariaLabel, count, windowLabel }: Props) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const cellRectRef = useRef<DOMRect | null>(null);
  const [pos, setPos] = useState<TooltipPosition | null>(null);

  function show() {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return;
    cellRectRef.current = rect;

    const placement: Placement =
      rect.top - ESTIMATED_TOOLTIP_HEIGHT - CELL_GAP >= 0 ? "above" : "below";

    // First pass: mount off-screen so the real width/height can be
    // measured from actual content before it's ever painted anywhere.
    setPos({ top: -9999, left: -9999, arrowLeft: 0, placement, measured: false });
  }

  function hide() {
    setPos(null);
  }

  // Finalize position from the real rendered size — calculated once per
  // show, never recomputed on scroll.
  useLayoutEffect(() => {
    if (!pos || pos.measured) return;
    const tooltipEl = tooltipRef.current;
    const cellRect = cellRectRef.current;
    if (!tooltipEl || !cellRect) return;

    const { width: tw, height: th } = tooltipEl.getBoundingClientRect();

    const top = pos.placement === "above"
      ? cellRect.top - th - CELL_GAP
      : cellRect.bottom + CELL_GAP;

    const idealLeft = cellRect.left + cellRect.width / 2 - tw / 2;
    const left = Math.min(
      Math.max(idealLeft, VIEWPORT_MARGIN),
      window.innerWidth - tw - VIEWPORT_MARGIN
    );

    const cellCenterX = cellRect.left + cellRect.width / 2;
    const arrowLeft = Math.min(
      Math.max(cellCenterX - left, ARROW_EDGE_MARGIN),
      tw - ARROW_EDGE_MARGIN
    );

    setPos({ top, left, arrowLeft, placement: pos.placement, measured: true });
  }, [pos]);

  // Scroll/wheel/touch/resize/Escape only ever dismiss — never reposition.
  useEffect(() => {
    if (pos === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") hide();
    }

    document.addEventListener("scroll", hide, { capture: true, passive: true });
    window.addEventListener("wheel", hide, { passive: true });
    window.addEventListener("touchmove", hide, { passive: true });
    window.addEventListener("resize", hide);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("scroll", hide, true);
      window.removeEventListener("wheel", hide);
      window.removeEventListener("touchmove", hide);
      window.removeEventListener("resize", hide);
      window.removeEventListener("keydown", onKeyDown);
    };
    // Re-subscribe only when visibility toggles, not on every measurement update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos !== null]);

  return (
    <>
      <a
        ref={anchorRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={hide}
      >
        {count}
      </a>
      {pos &&
        createPortal(
          <div
            ref={tooltipRef}
            className={styles.tooltip}
            style={{
              top: pos.top,
              left: pos.left,
              visibility: pos.measured ? "visible" : "hidden",
            }}
            role="tooltip"
            aria-hidden="true"
          >
            <span className={styles.window}>{windowLabel}</span>
            <span className={styles.count}>{count} court{count === 1 ? "" : "s"} available</span>
            <span
              className={pos.placement === "above" ? styles.arrowAbove : styles.arrowBelow}
              style={{ left: pos.arrowLeft }}
            />
          </div>,
          document.body
        )}
    </>
  );
}

import { useEffect, useRef, useState } from "react";

/**
 * Returns a callback ref (not a plain ref object) on purpose: the sentinel
 * element this observes is typically only rendered once data has loaded, so
 * the observer must be (re)created at the moment the node actually mounts —
 * a plain `useRef` here would fire its setup effect once while the node is
 * still null and never run again, since nothing in its dependencies changes.
 *
 * The callback is stashed in a ref (updated in an effect, not during render)
 * so the observer isn't torn down and recreated every render just because
 * the caller passed a fresh function identity.
 */
export function useIntersectionObserver(onIntersect: () => void, options?: IntersectionObserverInit) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onIntersectRef.current();
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, options]);

  return setNode;
}

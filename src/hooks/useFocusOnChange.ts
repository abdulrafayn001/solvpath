import { useEffect, type RefObject } from "react"

/**
 * Focuses `ref`'s element whenever `dependency` changes. Exists because a
 * plain effect can't live inline in a component that also needs the same
 * heading element focused for more than one reason (step change vs. initial
 * mount) without repeating the ref-wiring — kept here so any other
 * multi-step flow can reuse the same "move focus to the new view" behavior.
 */
export function useFocusOnChange(ref: RefObject<HTMLElement | null>, dependency: unknown) {
  useEffect(() => {
    ref.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ref identity is stable; only `dependency` should retrigger this
  }, [dependency])
}

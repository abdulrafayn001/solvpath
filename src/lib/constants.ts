/** Orders list page size — shared by paginated (desktop) and infinite (mobile)
 * fetching, and by their loading skeletons so the skeleton row/card count
 * always matches how many real rows/cards a page actually renders. */
export const ORDERS_PAGE_SIZE = 4

/** The app's two layout breakpoints, matching Tailwind's `sm`/`md`
 * scale so JS-driven switches (useMediaQuery) and CSS `sm:`/`md:` modifiers
 * agree on the same pixel values instead of drifting independently:
 *  - phone (<640px "tablet" bound): single column, stacked controls
 *  - tablet (640–767px): controls sit in a row, but list density stays
 *    compact (e.g. orders stay a card list, not a table)
 *  - desktop (≥768px "desktop" bound): full table/dense layouts
 */
export const BREAKPOINTS = {
  tablet: 640,
  desktop: 768,
} as const

export const DESKTOP_QUERY = `(min-width: ${BREAKPOINTS.desktop}px)` as const

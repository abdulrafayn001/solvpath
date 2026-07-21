/** Orders list page size — shared by paginated (desktop) and infinite (mobile)
 * fetching, and by their loading skeletons so the skeleton row/card count
 * always matches how many real rows/cards a page actually renders. */
export const ORDERS_PAGE_SIZE = 4

/** The dashboard's table/card switch, matching Tailwind's `md` breakpoint
 * (768px) so the JS-driven useMediaQuery and the CSS `md:` modifiers used
 * elsewhere agree on the same value instead of drifting independently. The
 * app's other breakpoint (Tailwind's `sm`, 640px, for stacking controls into
 * a row) is expressed purely in CSS since nothing in JS branches on it. */
export const DESKTOP_QUERY = "(min-width: 768px)" as const

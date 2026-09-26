export type EventProps = Record<string, string | number | boolean>;
export type AnalyticsAdapter = (event: string, props: EventProps) => void;

export const consoleAdapter: AnalyticsAdapter = (event, props) => console.info('[analytics]', event, props);

/** Fans one track() call out to every adapter (e.g. Vercel's `track`). A failing adapter never breaks the app. */
export const createAnalytics = (product: string, adapters: readonly AnalyticsAdapter[]) => ({
  track: (event: string, props: EventProps = {}) => {
    for (const adapter of adapters) {
      try {
        adapter(event, { ...props, product });
      } catch {
        // ponytail: swallowed silently; add an error sink if analytics loss matters
      }
    }
  },
});

export interface StromaOptions {
  /** Page title. Truncated to maxTitleLength (default 60) with an ellipsis. */
  title: string;
  /** Page description. Truncated to maxDescriptionLength (default 160). */
  description: string;

  /** Canonical page URL. Defaults to window.location.href in the browser. */
  url?: string;
  /** Absolute URL of the social share image. Falls back to the first <img> in the DOM. */
  image?: string;
  /** Alt text for the social share image. Defaults to the page title. */
  imageAlt?: string;
  /** OG image width in pixels. Default: '1200'. */
  imageWidth?: string;
  /** OG image height in pixels. Default: '630'. */
  imageHeight?: string;

  /** Human-readable site or brand name. Populates og:site_name. */
  siteName?: string;
  /** Author name. Populates meta[name=author] and article:author. */
  author?: string;
  /** Keywords — a string or an array of strings. Joined with ', ' if an array. */
  keywords?: string | string[];

  /** BCP 47 / Open Graph locale string. Default: 'en_US'. */
  locale?: string;
  /** meta[name=robots] content. Default: 'index, follow'. */
  robots?: string;
  /** Browser theme color (#rrggbb). Populates theme-color and msapplication-navbutton-color. */
  themeColor?: string;
  /** Explicit canonical URL. Falls back to url if omitted. */
  canonical?: string;

  /** Open Graph type. Default: 'website'. */
  ogType?: string;
  /** Twitter Card type. Auto-selects 'summary_large_image' when an image is present. */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  /** Twitter @handle for the site. e.g. '@mysite'. */
  twitterSite?: string;
  /** Twitter @handle for the content creator. e.g. '@author'. */
  twitterCreator?: string;

  /**
   * JSON-LD schema type to generate.
   * - 'webpage'    → schema.org/WebPage (default)
   * - 'article'    → schema.org/Article
   * - 'product'    → schema.org/Product
   * - 'breadcrumb' → schema.org/BreadcrumbList (requires breadcrumb array)
   */
  schema?: 'webpage' | 'article' | 'product' | 'breadcrumb';

  /** ISO 8601 publish date (e.g. '2024-03-15'). Used in Article schema. */
  datePublished?: string;
  /** ISO 8601 last-modified date. Falls back to datePublished if omitted. */
  dateModified?: string;

  /** Product price. Used in Product schema. */
  price?: number;
  /** ISO 4217 currency code. Default: 'USD'. */
  priceCurrency?: string;

  /** Breadcrumb items. Required when schema is 'breadcrumb'. */
  breadcrumb?: Array<{ name: string; url: string }>;

  /** Inject Apple / PWA meta hints (apple-mobile-web-app-capable, etc.). */
  pwa?: boolean;
  /** PWA display name. Defaults to title. */
  appName?: string;
  /** Publisher logo URL used in Article schema. */
  logo?: string;

  /**
   * Override the 60-character title truncation limit for this call only.
   * To change it globally, use Stroma.defaults({ maxTitleLength: n }).
   */
  maxTitleLength?: number;
  /**
   * Override the 160-character description truncation limit for this call only.
   * To change it globally, use Stroma.defaults({ maxDescriptionLength: n }).
   */
  maxDescriptionLength?: number;
}

export interface StromaDefaults {
  maxTitleLength:       number;
  maxDescriptionLength: number;
  robots:      string;
  ogType:      string;
  locale:      string;
  imageWidth:  string;
  imageHeight: string;
}

export interface StromaInstance {
  /**
   * Initialize (or re-initialize) all SEO tags in the DOM.
   * Removes any previously injected Stroma tags first.
   * In SSR environments (no document), call renderToString() instead.
   */
  init(options: StromaOptions): this;

  /**
   * Shallow-merge a patch onto the current config and re-apply all tags.
   * Ideal for SPA route changes — only send fields that have changed.
   *
   * @example
   *   // React Router / Vue Router onChange:
   *   Stroma.update({ title: route.meta.title, description: route.meta.description });
   */
  update(patch: Partial<StromaOptions>): this;

  /**
   * Remove all Stroma-injected tags from <head>.
   */
  reset(): this;

  /**
   * Returns a snapshot of the last resolved config, including computed fields
   * such as titleFull and descriptionFull.
   */
  getConfig(): StromaOptions & { titleFull: string; descriptionFull: string; twitterCard: string };

  /**
   * Server-Side Rendering support.
   * Returns an HTML string of all meta tags — no DOM access, no side-effects.
   *
   * @example (Next.js pages router)
   *   export function getServerSideProps() {
   *     const headHtml = Stroma.renderToString({ title: 'My Page', description: '...' });
   *     return { props: { headHtml } };
   *   }
   *
   * @example (Node.js / Express)
   *   const headHtml = Stroma.renderToString({ title: req.page.title, ... });
   *   res.send(`<html><head>${headHtml}</head><body>...</body></html>`);
   */
  renderToString(options: StromaOptions): string;

  /**
   * Inject a standalone BreadcrumbList JSON-LD block (client-side only).
   * For SSR, use renderToString({ schema: 'breadcrumb', breadcrumb: [...] }).
   */
  breadcrumb(items: Array<{ name: string; url: string }>): this;

  /**
   * Read or update module-level defaults that apply to every call.
   *
   * @example
   *   // Set once at app startup, affects all subsequent init() calls:
   *   Stroma.defaults({ maxTitleLength: 70, robots: 'noindex, nofollow' });
   *
   *   // Read current defaults:
   *   const d = Stroma.defaults(); // → StromaDefaults
   */
  defaults(patch: Partial<StromaDefaults>): this;
  defaults(): StromaDefaults;

  readonly version: string;
}

declare const Stroma: StromaInstance;
export default Stroma;
export { Stroma };

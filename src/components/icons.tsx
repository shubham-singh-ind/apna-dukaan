// Inline SVG icons — server-rendered, zero client JS, no dependencies.
// Stroke-based (Lucide-style) at 24x24; size/color via className.

type P = { className?: string };

function Svg({ className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const SearchIcon = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

export const MapPinIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

export const ClockIcon = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Svg>
);

export const PhoneIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.18 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
  </Svg>
);

export const MessageIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </Svg>
);

export const BadgeCheckIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const StarIcon = ({ className }: P) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
  </svg>
);

export const ChevronRightIcon = ({ className }: P) => (
  <Svg className={className}>
    <polyline points="9 18 15 12 9 6" />
  </Svg>
);

export const ArrowRightIcon = ({ className }: P) => (
  <Svg className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Svg>
);

export const NavigationIcon = ({ className }: P) => (
  <Svg className={className}>
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </Svg>
);

// --- Category icons ---

const ShoppingCartIcon = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </Svg>
);

const UtensilsIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M3 2v7c0 1.1.9 2 2 2a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </Svg>
);

const PillIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </Svg>
);

const SmartphoneIcon = ({ className }: P) => (
  <Svg className={className}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12" y2="18.01" />
  </Svg>
);

const ShirtIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" />
  </Svg>
);

const WrenchIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
  </Svg>
);

export const StoreIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
  </Svg>
);

// Pick a category icon by slug/name keywords; falls back to a storefront.
export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const s = slug.toLowerCase();
  if (/grocer|kirana|super|mart|vegetable|fruit/.test(s))
    return <ShoppingCartIcon className={className} />;
  if (/food|restaurant|cafe|bakery|sweet|tea|dhaba|eat/.test(s))
    return <UtensilsIcon className={className} />;
  if (/pharma|medic|chemist|health|clinic/.test(s)) return <PillIcon className={className} />;
  if (/electro|mobile|phone|gadget|repair|computer/.test(s))
    return <SmartphoneIcon className={className} />;
  if (/cloth|apparel|fashion|garment|tailor|boutique/.test(s))
    return <ShirtIcon className={className} />;
  if (/hardware|tool|paint|plumb|electric/.test(s)) return <WrenchIcon className={className} />;
  return <StoreIcon className={className} />;
}

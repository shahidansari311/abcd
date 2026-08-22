type Props = {
  variant?: "light" | "vivid";
  className?: string;
};

/**
 * Shared floating-blob backdrop used behind glass panels (hero, auth, CTA).
 * Blobs drift slowly and continuously; motion is disabled under
 * prefers-reduced-motion via the global rule in index.css.
 */
export default function AnimatedBackground({ variant = "light", className = "" }: Props) {
  const base =
    variant === "vivid"
      ? "bg-[linear-gradient(135deg,#CFFFDC_0%,#68BA7F_45%,#2E6F40_100%)]"
      : "bg-bg";

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${base} ${className}`}>
      <div
        className="blob"
        style={{
          width: 460,
          height: 460,
          top: "-8%",
          left: "-6%",
          background: "#68BA7F",
          opacity: variant === "vivid" ? 0.55 : 0.4,
          animation: "drift-a 9s ease-in-out infinite",
        }}
      />
      <div
        className="blob"
        style={{
          width: 380,
          height: 380,
          top: "35%",
          right: "-8%",
          background: "#CFFFDC",
          opacity: 0.6,
          animation: "drift-b 11s ease-in-out infinite",
        }}
      />
      <div
        className="blob"
        style={{
          width: 320,
          height: 320,
          bottom: "-10%",
          left: "30%",
          background: variant === "vivid" ? "#CFFFDC" : "#68BA7F",
          opacity: 0.35,
          animation: "drift-c 13s ease-in-out infinite",
        }}
      />
    </div>
  );
}

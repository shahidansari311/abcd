import { motion } from "framer-motion";

const PRIMARY = "#2E6F40";
const ACCENT = "#68BA7F";
const TINT = "#CFFFDC";
const GRID = "#D8ECDD";

/* ---------------- Radar ---------------- */
export function RadarChart({
  data,
  size = 260,
}: {
  data: { label: string; value: number }[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 42;
  const n = data.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, val: number) => {
    const rad = (val / 100) * r;
    return [cx + rad * Math.cos(angle(i)), cy + rad * Math.sin(angle(i))];
  };
  const poly = data.map((d, i) => point(i, d.value).join(",")).join(" ");
  const rings = [25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[300px]">
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={data.map((_, i) => point(i, ring).join(",")).join(" ")}
          fill="none"
          stroke={GRID}
          strokeWidth={1}
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={GRID} strokeWidth={1} />;
      })}
      <motion.polygon
        points={poly}
        fill={ACCENT}
        fillOpacity={0.35}
        stroke={PRIMARY}
        strokeWidth={2}
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "center" }}
      />
      {data.map((d, i) => {
        const [x, y] = point(i, 112);
        return (
          <text
            key={d.label}
            x={x}
            y={y}
            fill="#4E6B55"
            fontSize={10}
            fontWeight={600}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ---------------- Trend (line) ---------------- */
export function TrendChart({
  data,
  height = 200,
}: {
  data: number[];
  height?: number;
}) {
  const w = 520;
  const pad = 12;
  const max = Math.max(...data) * 1.1;
  const min = Math.min(...data) * 0.9;
  const stepX = (w - pad * 2) / (data.length - 1);
  const y = (v: number) => pad + (1 - (v - min) / (max - min)) * (height - pad * 2);
  const pts = data.map((v, i) => [pad + i * stepX, y(v)]);
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `${pad},${height - pad} ${line} ${w - pad},${height - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
          <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad} y1={pad + g * (height - pad * 2)} x2={w - pad} y2={pad + g * (height - pad * 2)} stroke={GRID} strokeWidth={1} />
      ))}
      <motion.polygon
        points={area}
        fill="url(#trendFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <motion.polyline
        points={line}
        fill="none"
        stroke={PRIMARY}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

/* ---------------- Bar list ---------------- */
export function BarList({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-ink">{d.label}</span>
            <span className="text-ink-soft">{d.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#68BA7F,#2E6F40)]"
              initial={{ width: 0 }}
              whileInView={{ width: `${(d.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Compatibility gauge ---------------- */
export function CompatibilityScore({ value, size = 140, label }: { value: number; size?: number; label?: string }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GRID} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={PRIMARY}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (value / 100) * c }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold text-ink">{value}%</p>
        {label && <p className="text-xs text-ink-soft">{label}</p>}
      </div>
    </div>
  );
}

/* ---------------- Heatmap ---------------- */
export function HeatmapChart({
  rows,
  cols,
  data,
}: {
  rows: string[];
  cols: string[];
  data: number[][];
}) {
  const shade = (v: number) => {
    // 0..100 -> tint..primary
    const t = v / 100;
    const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
    const from = [207, 255, 220];
    const to = [46, 111, 64];
    return `rgb(${lerp(from[0], to[0])},${lerp(from[1], to[1])},${lerp(from[2], to[2])})`;
  };
  return (
    <div className="overflow-x-auto">
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `120px repeat(${cols.length}, 1fr)` }}>
        <div />
        {cols.map((c) => (
          <div key={c} className="px-1 pb-1 text-center text-xs font-medium text-ink-soft">
            {c}
          </div>
        ))}
        {rows.map((row, ri) => (
          <>
            <div key={row} className="flex items-center pr-2 text-sm font-medium text-ink">
              {row}
            </div>
            {cols.map((_, ci) => (
              <motion.div
                key={`${ri}-${ci}`}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (ri * cols.length + ci) * 0.02 }}
                className="grid h-11 min-w-11 place-items-center rounded-md text-xs font-semibold"
                style={{ background: shade(data[ri][ci]), color: data[ri][ci] > 55 ? "#F7FBF8" : "#1B2E20" }}
              >
                {data[ri][ci]}
              </motion.div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}

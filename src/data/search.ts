import { INCIDENTS } from "./incidents";
import { CAMERAS, PUMPS, STAFF } from "./station";

export type Hit = { kind: "Pompa" | "Kamera" | "Personel" | "Olay" | "Plaka"; label: string; sub: string; to: string; keys: string };

const norm = (s: string) => s.toLocaleLowerCase("tr").replace(/[#\s-]/g, "");

export const SEARCH_INDEX: Hit[] = [
  ...PUMPS.map((p) => ({ kind: "Pompa" as const, label: `Pompa ${p.id}`, sub: `Ada ${p.island} · ${p.state} · kuyruk ${p.queue}`, to: `/pumps`, keys: `pompa ${p.id} ${p.id}` })),
  ...CAMERAS.map((c) => ({ kind: "Kamera" as const, label: c.id, sub: `${c.name}${c.issue ? ` · ${c.issue}` : ""}`, to: `/cameras`, keys: `${c.id} ${c.name}` })),
  ...STAFF.map((s) => ({ kind: "Personel" as const, label: s.id, sub: `${s.role} · ${s.area} · ${s.status}`, to: `/staffing`, keys: `personel ${s.id} ${s.name}` })),
  ...INCIDENTS.map((i) => ({ kind: "Olay" as const, label: i.id, sub: `#${i.no} ${i.title}`, to: `/incidents?id=${i.id}`, keys: `olay ${i.id} ${i.title} ${i.pump ?? ""} ${i.staff ?? ""}` })),
  ...[...new Map(INCIDENTS.filter((i) => i.plate && i.plate !== "OKUNAMADI").map((i) => [i.plate!, i])).values()].map((i) => ({
    kind: "Plaka" as const,
    label: i.plate!,
    sub: i.title,
    to: `/incidents?id=${i.id}`,
    keys: `plaka ${i.plate}`,
  })),
];

export function searchAll(q: string, limit = 8): Hit[] {
  const n = norm(q);
  if (!n) return [];
  const scored = SEARCH_INDEX.map((h) => {
    const toks = h.keys.split(" ").map(norm);
    const l = norm(h.label);
    const all = norm(h.keys + h.label);
    const score = l === n || toks.includes(n) ? 0 : l.startsWith(n) || toks.some((t) => t.startsWith(n)) ? 1 : all.includes(n) ? 2 : -1;
    return { h, score };
  }).filter((x) => x.score >= 0);
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, limit).map((x) => x.h);
}

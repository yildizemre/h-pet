import { CalendarClock, Car, UserMinus, UserPlus, UsersRound } from "lucide-react";
import { Chart, Legend } from "../components/charts";
import { AlertGrid } from "../components/incident";
import { AIInsight, ChartCard, DataTable, KpiCard, KpiGrid, SectionTitle, StatusBadge, type Col } from "../components/kit";
import { Badge, Card, CardHead, PageHead } from "../components/ui";
import { incByCat } from "../data/incidents";
import { STAFF, STATION, type Staff } from "../data/station";
import { HOURLY } from "../data/series";
import { cx } from "../lib/util";

const S = [
  { key: "staff", name: "Sahadaki personel", color: "#18d5e8", type: "bar" as const, barSize: 14 },
  { key: "ideal", name: "Gereken personel", color: "#f6ae2d", type: "line" as const, dashed: true },
];

const ST = { SAHADA: "ok", MARKET: "accent", MOLA: "mute", PASİF: "danger" } as const;

const cols: Col<Staff>[] = [
  { key: "id", label: "Personel", render: (r) => <span className="num font-bold text-ink">{r.id}</span> },
  { key: "role", label: "Rol", render: (r) => r.role },
  { key: "st", label: "Durum", render: (r) => <StatusBadge label={r.status} tone={ST[r.status]} dot /> },
  { key: "a", label: "Alan", render: (r) => r.area },
  { key: "f", label: "Sahada (dk)", render: (r) => <span className="num">{r.fieldMin || "—"}</span>, sort: (r) => r.fieldMin, align: "right" },
];

export default function Staffing() {
  const short = HOURLY.filter((h) => h.staff < h.ideal);
  const over = HOURLY.filter((h) => h.staff > h.ideal + 1);
  return (
    <div className="fade-up">
      <PageHead title="Personel – Yoğunluk Dengesi" sub={`Modül 4 · ${STATION.full} · saatlik personel sayısı ile araç yoğunluğu karşılaştırması`} />

      <KpiGrid cols="xl:grid-cols-5">
        <KpiCard label="Şu an sahada" value="5" unit="/ 6 pompacı" icon={UsersRound} tone="ok" />
        <KpiCard label="Eksik personelli saat" value={`${short.length}`} sub={short.map((h) => h.t.slice(0, 2)).join(", ")} icon={UserMinus} tone="danger" alert />
        <KpiCard label="Fazla personelli saat" value={`${over.length}`} sub={over.map((h) => h.t.slice(0, 2)).join(", ") || "—"} icon={UserPlus} tone="warn" />
        <KpiCard label="Zirve araç / personel" value="33" sub="17:00 · hedef ≤ 22" icon={Car} tone="danger" />
        <KpiCard label="Vardiya planı" value="16–24" sub="önerilen: +2 pompacı 17–19" icon={CalendarClock} />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight tone="warn">
          **16:00–18:00** arasında sahadaki personel ihtiyacın 1–2 kişi altında; bu saatlere bir mola denk geliyor. **Öneri:** molaları 14:00–16:00 ve 20:00 sonrasına kaydır, 17:00–19:00 için +2 pompacı planla. 06:00 ve 22:00 sonrası 1 personel fazla.
        </AIInsight>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard title="Saatlik personel ve ihtiyaç" sub="Gereken = araç / 22" icon={UsersRound} right={<Legend series={S} />}>
          <Chart data={HOURLY} series={S} height={240} />
        </ChartCard>
        <Card>
          <CardHead title="Saatlik denge" icon={CalendarClock} />
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {HOURLY.map((h) => {
              const d = h.staff - h.ideal;
              return (
                <div key={h.t} className={cx("rounded-lg border px-1.5 py-1.5 text-center", d < 0 ? "border-danger/45 bg-danger/8" : d > 1 ? "border-warn/40 bg-warn/8" : "border-line bg-panel2")}>
                  <div className="num text-[10.5px] font-bold text-mute">{h.t.slice(0, 2)}</div>
                  <div className="num text-[13px] font-bold text-ink">{h.staff}/{h.ideal}</div>
                  <Badge tone={d < 0 ? "danger" : d > 1 ? "warn" : "ok"}>{d < 0 ? "eksik" : d > 1 ? "fazla" : "denge"}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="mb-5">
        <CardHead title="Personel listesi" sub="Anonim personel ID · 18:40" icon={UsersRound} />
        <DataTable rows={STAFF} cols={cols} rowKey={(r) => r.id} />
      </Card>

      <SectionTitle>Personel bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("staffing")} />
    </div>
  );
}

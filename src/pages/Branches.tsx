import { Banknote, Building2, Car, Gauge, Trophy, Video } from "lucide-react";
import { RankBars } from "../components/charts";
import { AIInsight, DataTable, KpiCard, type Col } from "../components/kit";
import { Badge, Card, CardHead, PageHead } from "../components/ui";
import { STATION } from "../data/station";
import { STATIONS, type StationRow } from "../data/series";
import { cx, mmss, n, sum } from "../lib/util";

const TONE = { NORMAL: "ok", WARNING: "warn", CRITICAL: "danger" } as const;

const cols: Col<StationRow>[] = [
  { key: "name", label: "İstasyon", render: (r) => <span className={cx("font-semibold", r.id === STATION.id ? "text-accent" : "text-ink")}>{r.name}</span>, sort: (r) => r.name },
  { key: "reg", label: "Bölge", render: (r) => r.region, sort: (r) => r.region },
  { key: "st", label: "Durum", render: (r) => <Badge tone={TONE[r.status]}>{r.status}</Badge>, sort: (r) => ["NORMAL", "WARNING", "CRITICAL"].indexOf(r.status) },
  { key: "sc", label: "Skor", render: (r) => <span className="num font-bold text-ink">{r.score}</span>, sort: (r) => r.score, align: "right" },
  { key: "c", label: "Araç", render: (r) => <span className="num">{n(r.cars)}</span>, sort: (r) => r.cars, align: "right" },
  { key: "s", label: "Hizmet", render: (r) => <span className={cx("num", r.service > 285 && "font-semibold text-danger")}>{mmss(r.service)}</span>, sort: (r) => r.service, align: "right" },
  { key: "q", label: "Bekleme", render: (r) => <span className="num">{mmss(r.queue)}</span>, sort: (r) => r.queue, align: "right" },
  { key: "w", label: "Cam silme", render: (r) => <span className="num">%{r.wash}</span>, sort: (r) => r.wash, align: "right" },
  { key: "u", label: "Kıyafet", render: (r) => <span className="num">%{r.uniform}</span>, sort: (r) => r.uniform, align: "right" },
  { key: "sf", label: "Emniyet ihlali", render: (r) => <span className={cx("num", r.safety > 4 && "text-danger")}>{r.safety}</span>, sort: (r) => r.safety, align: "right" },
  { key: "d", label: "Drive-off", render: (r) => <span className="num">{r.driveoff}</span>, sort: (r) => r.driveoff, align: "right" },
  { key: "m", label: "Market dönüşüm", render: (r) => <span className="num">%{r.market}</span>, sort: (r) => r.market, align: "right" },
  { key: "cam", label: "Kamera", render: (r) => <span className="num">{r.cams}</span> },
];

export default function Branches() {
  const ranked = [...STATIONS].sort((a, b) => b.score - a.score);
  return (
    <div className="fade-up">
      <PageHead title="Çoklu İstasyon Karşılaştırma" sub="Modül 20 · Petrol Ofisi · 8 istasyon · aynı KPI seti (personel değerlendirmesi değildir)" />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiCard label="Toplam araç" value={n(sum(STATIONS.map((s) => s.cars)))} icon={Car} />
        <KpiCard label="İstasyon" value={`${STATIONS.length}`} sub={`${STATIONS.filter((s) => s.status === "NORMAL").length} normal`} icon={Building2} tone="ok" />
        <KpiCard label="Uyarı / kritik" value={`${STATIONS.filter((s) => s.status !== "NORMAL").length}`} sub="Tuzla · Ankara · Örnek" icon={Gauge} tone="warn" />
        <KpiCard label="Drive-off" value={`${sum(STATIONS.map((s) => s.driveoff))}`} icon={Banknote} tone="danger" />
        <KpiCard label="Kamera" value={`${sum(STATIONS.map((s) => Number(s.cams.split("/")[0])))}`} unit={`/ ${sum(STATIONS.map((s) => Number(s.cams.split("/")[1])))}`} icon={Video} tone="ok" />
      </div>

      <div className="mb-4">
        <AIInsight tone="warn">**Tuzla TEM** en yoğun istasyon (2.184 araç) ancak hizmet süresi 05:12 ve 9 emniyet ihlaliyle sıralamada son. **Başakşehir** 91 skorla en iyi; cam silme %68 ve kıyafet uyumu %97.</AIInsight>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHead title="İstasyon sıralaması" sub="Bileşik operasyon skoru" icon={Trophy} />
          <RankBars items={ranked.map((s) => ({ label: s.name, value: s.score, tone: s.status === "CRITICAL" ? "danger" : s.status === "WARNING" ? "warn" : "ok" }))} max={100} />
        </Card>
        <Card>
          <CardHead title="Bölge müdürü özeti" icon={Building2} />
          <div className="grid grid-cols-2 gap-2">
            {[...new Set(STATIONS.map((s) => s.region))].map((r) => {
              const xs = STATIONS.filter((s) => s.region === r);
              const score = Math.round(sum(xs.map((x) => x.score)) / xs.length);
              return (
                <div key={r} className="rounded-xl border border-line bg-panel2 p-3">
                  <div className="text-[12.5px] font-bold text-ink">{r}</div>
                  <div className="text-[10.5px] text-mute">{xs.length} istasyon</div>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className={cx("num text-[20px] font-bold", score < 75 ? "text-danger" : score < 85 ? "text-warn" : "text-ok")}>{score}</span>
                    <span className="text-[10.5px] text-mute">ort. skor</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <CardHead title="İstasyon KPI tablosu" sub="17.10.2026 · 18:40 itibarıyla" icon={Building2} />
        <DataTable rows={STATIONS} cols={cols} rowKey={(r) => r.id} initialSort={{ key: "sc", dir: "desc" }} search={(r) => `${r.name} ${r.region}`} />
      </Card>
    </div>
  );
}

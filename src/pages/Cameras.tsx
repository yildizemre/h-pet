import { Activity, BrainCircuit, CircleOff, EyeOff, Move, Video, Wifi } from "lucide-react";
import { AlertGrid } from "../components/incident";
import { AIInsight, DataTable, KpiCard, SectionTitle, StatusBadge, type Col } from "../components/kit";
import { Card, CardHead, PageHead } from "../components/ui";
import { incByCat } from "../data/incidents";
import { CAMERAS, CAM_STATS, STATION, type Camera } from "../data/station";
import { cx, hhmmss } from "../lib/util";

const cols: Col<Camera>[] = [
  { key: "id", label: "Kamera", render: (r) => <span className="num font-bold text-ink">{r.id}</span>, sort: (r) => r.id },
  { key: "n", label: "Konum", render: (r) => r.name, sort: (r) => r.name },
  { key: "a", label: "Bölge", render: (r) => r.area, sort: (r) => r.area },
  { key: "st", label: "Durum", render: (r) => <StatusBadge label={r.status === "online" ? "ONLINE" : r.status === "offline" ? "OFFLINE" : "UYARI"} tone={r.status === "online" ? "ok" : r.status === "offline" ? "danger" : "warn"} dot />, sort: (r) => r.status },
  { key: "i", label: "Sorun", render: (r) => (r.issue ? `${r.issue} · ${hhmmss(r.issueAt!)}` : "—") },
  { key: "c", label: "Güven", render: (r) => <span className={cx("num", r.conf < 80 && "font-semibold text-warn")}>%{r.conf}</span>, sort: (r) => r.conf, align: "right" },
  { key: "m", label: "Modeller", render: (r) => <span className="text-mute">{r.models.join(" · ")}</span> },
];

export default function Cameras() {
  return (
    <div className="fade-up">
      <PageHead title="Kamera Sağlığı" sub={`Modül 21 · ${STATION.full} · ${CAM_STATS.total} kamera · açı kayması, kararma / kirlenme, bağlantı kopması`} />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Toplam kamera" value={`${CAM_STATS.total}`} icon={Video} />
        <KpiCard label="Online" value={`${CAM_STATS.online}`} icon={Wifi} tone="ok" />
        <KpiCard label="Bağlantı koptu" value={`${CAM_STATS.offline}`} sub="CAM-14 · 18:02" icon={CircleOff} tone="danger" alert />
        <KpiCard label="Açı kayması" value="1" sub="CAM-07 · 17:04" icon={Move} tone="warn" alert />
        <KpiCard label="Kirlenme / kararma" value="1" sub="CAM-04 · 15:22" icon={EyeOff} tone="warn" alert />
        <KpiCard label="Analitik sağlıklı" value={`${CAM_STATS.analyticsHealthy}`} unit={`/ ${CAM_STATS.total}`} icon={BrainCircuit} tone="ok" />
      </div>

      <div className="mb-4">
        <AIInsight tone="warn">**CAM-14** (jeneratör odası) 18:02'den beri görüntü göndermiyor — yasaklı alan izlemesi durdu. **CAM-07** açısı kaydığı için P6 tabanca bölgesi kısmen kadraj dışında; **CAM-04** lensi yakıt buharı ve tozdan kirlendi.</AIInsight>
      </div>

      <SectionTitle>Kamera sağlığı bildirimleri</SectionTitle>
      <div className="mb-5">
        <AlertGrid items={incByCat("camera")} />
      </div>

      <Card>
        <CardHead title="Kamera envanteri" sub="Bağlı analitik modelleri" icon={Activity} />
        <DataTable rows={CAMERAS} cols={cols} rowKey={(r) => r.id} pageSize={12} search={(r) => `${r.id} ${r.name} ${r.area}`} initialSort={{ key: "c", dir: "asc" }} />
      </Card>
    </div>
  );
}

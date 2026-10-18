import { BellRing, Clock3, Flame, MapPin, Wind } from "lucide-react";
import { AlertGrid } from "../components/incident";
import { AIInsight, KpiCard, KpiGrid, SectionTitle } from "../components/kit";
import { Badge, Card, CardHead, PageHead } from "../components/ui";
import { incByCat } from "../data/incidents";
import { CAMERAS, STATION } from "../data/station";

const ZONES = [
  { t: "Pompa adaları", cams: ["CAM-03", "CAM-05", "CAM-07", "CAM-09", "CAM-10"], ev: 0 },
  { t: "Tanker boşaltma alanı", cams: ["CAM-11"], ev: 0 },
  { t: "Tank sahası", cams: ["CAM-13"], ev: 0 },
  { t: "Market / market arkası", cams: ["CAM-15", "CAM-17"], ev: 1 },
  { t: "Depo", cams: ["CAM-16"], ev: 0 },
];

export default function Fire() {
  return (
    <div className="fade-up">
      <PageHead title="Yangın ve Duman Erken Uyarı" sub={`Modül 9 · ${STATION.full} · pompa adası, tanker alanı, market ve depo`} />

      <KpiGrid cols="xl:grid-cols-5">
        <KpiCard label="Bugünkü tespit" value="1" sub="market arkası · alev" icon={Flame} tone="danger" alert />
        <KpiCard label="Ort. bildirim süresi" value="3" unit="sn" sub="tespitten bildirime" icon={BellRing} tone="ok" />
        <KpiCard label="Ort. müdahale" value="01:40" sub="market arkası olayı" icon={Clock3} />
        <KpiCard label="İzlenen bölge" value={`${ZONES.length}`} sub={`${ZONES.reduce((a, z) => a + z.cams.length, 0)} kamera`} icon={MapPin} />
        <KpiCard label="Yanlış alarm (30 gün)" value="%2,1" sub="buhar / far yansıması" icon={Wind} tone="mute" />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight tone="danger">12:51'de **market arkasındaki çöp konteyneri yanında alev** tespit edildi. Bildirim **3 saniyede** panel, mobil uygulama ve WhatsApp grubuna gitti; personel **01:40**'ta söndürücüyle müdahale etti.</AIInsight>
      </div>

      <Card className="mb-5">
        <CardHead title="İzlenen bölgeler" sub="Alev ve duman modelleri" icon={MapPin} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">
          {ZONES.map((z) => (
            <div key={z.t} className="rounded-xl border border-line bg-panel2 p-3">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[12.5px] font-bold text-ink">{z.t}</span>
                <Badge tone={z.ev ? "danger" : "ok"}>{z.ev ? `${z.ev} olay` : "Normal"}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {z.cams.map((c) => (
                  <Badge key={c} tone={CAMERAS.find((x) => x.id === c)?.status === "online" ? "mute" : "warn"}>{c}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <SectionTitle>Yangın & duman bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("fire")} cols="md:grid-cols-2 xl:grid-cols-3" />
    </div>
  );
}

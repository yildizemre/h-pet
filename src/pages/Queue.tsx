import { Clock3, Gauge, ListOrdered, Timer } from "lucide-react";
import { Chart, Heatmap, Legend, RankBars } from "../components/charts";
import { AlertGrid } from "../components/incident";
import { AIInsight, ChartCard, KpiCard, KpiGrid, SectionTitle } from "../components/kit";
import { Card, CardHead, PageHead } from "../components/ui";
import { incByCat } from "../data/incidents";
import { PUMPS, STATION } from "../data/station";
import { HEAT, HOURLY } from "../data/series";
import { mmss } from "../lib/util";

const S = [
  { key: "queue", name: "Ort. kuyruk (araç)", color: "#f6ae2d", type: "bar" as const, barSize: 14 },
  { key: "waitMin", name: "Ort. bekleme (dk)", color: "#18d5e8", type: "line" as const },
];

export default function Queue() {
  const data = HOURLY.map((h) => ({ ...h, waitMin: Math.round((h.wait / 60) * 10) / 10 }));
  const avgOcc = Math.round(PUMPS.reduce((a, p) => a + p.occupancy, 0) / PUMPS.length);
  return (
    <div className="fade-up">
      <PageHead title="Pompa Kuyruğu ve Doluluk Analizi" sub={`Modül 3 · ${STATION.full} · pompa başına kuyruk, bekleme ve doluluk`} />

      <KpiGrid cols="xl:grid-cols-4">
        <KpiCard label="Anlık kuyruk" value={`${PUMPS.reduce((a, p) => a + p.queue, 0)}`} unit="araç" sub="P3 · 5 araç" icon={ListOrdered} tone="warn" alert />
        <KpiCard label="Ort. bekleme" value={mmss(Math.round(PUMPS.reduce((a, p) => a + p.wait, 0) / PUMPS.length))} sub="en uzun P3 · 03:56" icon={Clock3} />
        <KpiCard label="Ort. pompa doluluğu" value={`%${avgOcc}`} sub="P3 %93 · P8 %41" icon={Gauge} />
        <KpiCard label="Zirve saat" value="17:00" sub="ort. 2,8 araç kuyruk" icon={Timer} tone="danger" />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight tone="warn">
          Ada 2 (P3–P4) LPG nedeniyle sürekli dolu: doluluk **%93 / %84**. Aynı saatlerde Ada 3'teki **P5 %62**. Girişte yönlendirme ile Ada 2 kuyruğu ortalama **1,5 araç** azaltılabilir.
        </AIInsight>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard title="Saatlik kuyruk ve bekleme" icon={ListOrdered} right={<Legend series={S} />}>
          <Chart data={data} series={S} height={240} />
        </ChartCard>
        <Card>
          <CardHead title="Pompa doluluk oranı" sub="Bugün" icon={Gauge} />
          <RankBars items={PUMPS.map((p) => ({ label: `${p.id} · Ada ${p.island} · kuyruk ${p.queue}`, value: p.occupancy, tone: p.occupancy >= 90 ? "danger" : p.occupancy >= 80 ? "warn" : "accent" }))} max={100} unit="%" />
        </Card>
      </div>

      <Card className="mb-5">
        <CardHead title="Saatlik yoğunluk ısı haritası" sub="Son 7 gün · pompa doluluğu %" icon={Gauge} />
        <Heatmap rows={HEAT} />
      </Card>

      <SectionTitle>Kuyruk bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("queue")} />
    </div>
  );
}

import { Car, Clock3, Droplets, ListOrdered, Wind } from "lucide-react";
import { Chart, Legend } from "../components/charts";
import { AlertGrid } from "../components/incident";
import { ChartCard, KpiCard, KpiGrid, SectionTitle } from "../components/kit";
import { PageHead } from "../components/ui";
import { incByCat } from "../data/incidents";
import { STATION } from "../data/station";
import { CARWASH, CARWASH_HOURLY } from "../data/series";
import { mmss } from "../lib/util";

const S = [
  { key: "wash", name: "Yıkamaya giren", color: "#18d5e8", type: "bar" as const, barSize: 12 },
  { key: "air", name: "Hava-su kullanımı", color: "#8b7cf6", type: "line" as const },
];

export default function CarWash() {
  return (
    <div className="fade-up">
      <PageHead title="Oto Yıkama ve Hava-Su Ünitesi" sub={`Modül 18 · ${STATION.full} · istasyonda bulunması hâlinde`} />

      <KpiGrid cols="xl:grid-cols-4">
        <KpiCard label="Yıkamaya giren" value={`${CARWASH.cars}`} icon={Car} />
        <KpiCard label="Ort. yıkama süresi" value={mmss(CARWASH.avg)} icon={Clock3} />
        <KpiCard label="Hava-su kullanımı" value={`${CARWASH.airWater}`} icon={Wind} tone="violet" />
        <KpiCard label="Zirve kuyruk" value={`${CARWASH.queuePeak}`} unit="araç" sub="15:48" icon={ListOrdered} tone="warn" />
      </KpiGrid>

      <ChartCard title="Saatlik kullanım" icon={Droplets} right={<Legend series={S} />} className="mb-5">
        <Chart data={CARWASH_HOURLY} series={S} height={240} />
      </ChartCard>

      <SectionTitle>Oto yıkama bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("carwash")} />
    </div>
  );
}

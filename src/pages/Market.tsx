import { Clock3, Flame, ListOrdered, Megaphone, UserCheck } from "lucide-react";
import { Chart, Legend, RankBars } from "../components/charts";
import { AlertGrid } from "../components/incident";
import { AIInsight, ChartCard, KpiCard, KpiGrid, SectionTitle } from "../components/kit";
import { Card, CardHead, PageHead } from "../components/ui";
import { incByCat } from "../data/incidents";
import { STATION } from "../data/station";
import { AISLES, CASH_HOURLY, MARKET } from "../data/series";
import { cx, mmss, n } from "../lib/util";

const S = [
  { key: "queue", name: "Ort. kasa kuyruğu", color: "#f6ae2d", type: "bar" as const, barSize: 14 },
  { key: "wait", name: "Ort. bekleme (sn)", color: "#18d5e8", type: "line" as const },
];

export default function Market() {
  return (
    <div className="fade-up">
      <PageHead title="Market Kasa, Kuyruk ve Isı Haritası" sub={`Modül 15 & 16 · ${STATION.full} · kasa kuyruğu, personel varlığı ve reyon ilgisi`} />

      <KpiGrid cols="xl:grid-cols-5">
        <KpiCard label="Ort. kasa kuyruğu" value={n(MARKET.avgQueue, 1)} unit="kişi" sub="zirve 6 · 18:18" icon={ListOrdered} tone="warn" />
        <KpiCard label="Ort. bekleme" value={mmss(MARKET.avgWait)} icon={Clock3} />
        <KpiCard label="Kasa başında personel" value={`%${n(MARKET.staffed, 1)}`} sub="Kasa 2 · 03:05 boş" icon={UserCheck} tone="ok" />
        <KpiCard label="En ilgi gören reyon" value="İçecek" sub="ilgi skoru 92" icon={Flame} tone="violet" />
        <KpiCard label="Kampanya standı" value="64" sub="ort. 36 sn durma" icon={Megaphone} />
      </KpiGrid>

      <div className="mb-4">
        <AIInsight tone="warn">17:00–18:30 arası Kasa 1'de kuyruk **6 kişiye** çıkarken Kasa 2 kapalıydı. **Kahve köşesi** düşük trafiğe rağmen en uzun durma süresine (01:52) sahip; madeni yağ kampanya standı orta düzey ilgi görüyor.</AIInsight>
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard title="Saatlik kasa kuyruğu" icon={ListOrdered} right={<Legend series={S} />}>
          <Chart data={CASH_HOURLY} series={S} height={240} />
        </ChartCard>
        <Card>
          <CardHead title="Reyon ısı haritası" sub="İlgi skoru · ort. durma" icon={Flame} />
          <div className="mb-4 grid grid-cols-3 gap-1.5">
            {AISLES.map((a) => (
              <div
                key={a.label}
                className={cx("rounded-lg p-2 text-center text-white")}
                style={{ background: `color-mix(in srgb, ${a.value > 80 ? "#fb5d5d" : a.value > 60 ? "#f6ae2d" : "#18d5e8"} ${30 + a.value * 0.6}%, transparent)` }}
              >
                <div className="truncate text-[10.5px] font-semibold text-ink">{a.label}</div>
                <div className="num text-[15px] font-bold text-ink">{a.value}</div>
              </div>
            ))}
          </div>
          <RankBars items={AISLES.map((a) => ({ label: a.label, value: a.dwell }))} formatter={mmss} />
        </Card>
      </div>

      <SectionTitle>Market bildirimleri</SectionTitle>
      <AlertGrid items={incByCat("market")} cols="md:grid-cols-2" />
    </div>
  );
}
